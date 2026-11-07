const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const Usermodel = require("../Model/Usermodel");
const { createToken } = require("../utils/token");
const { acceptPendingInvitations } = require("../utils/Acceptinvitations");

// Đối tượng dùng để hỏi Google "token này có thật không?"
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Đăng ký bằng email + mật khẩu
async function register(req, res) {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu tên, email hoặc mật khẩu" });
    }

    const exists = await Usermodel.findUserByEmail(email);
    if (exists) {
      return res.status(400).json({ message: "Email đã được dùng" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    await Usermodel.createUser(userId, name, email, hashed);

    // Nếu email này từng được mời vào workspace nào, cho vào luôn
    await acceptPendingInvitations(userId, email);

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Đăng nhập bằng email + mật khẩu
async function login(req, res) {
  try {
    const { password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }

    const user = await Usermodel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
    }

    // Tài khoản tạo bằng Google không có mật khẩu
    if (!user.password) {
      return res.status(401).json({ message: "Tài khoản này đăng nhập bằng Google" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
    }

    const token = createToken(user.id);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Đăng nhập (hoặc đăng ký lần đầu) bằng Google.
// Frontend gửi lên "credential" (ID token do Google cấp), backend hỏi lại Google để xác minh.
async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Thiếu credential" });
    }

    // 1. Xác minh token với Google. audience = Client ID của app mình,
    //    để chắc token này được cấp cho đúng app của mình chứ không phải app khác.
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({ message: "Token Google không hợp lệ" });
    }

    if (!payload.email_verified) {
      return res.status(401).json({ message: "Email Google chưa được xác minh" });
    }

    // 2. Tìm user theo email, chưa có thì tạo mới (không có mật khẩu)
    const email = payload.email.toLowerCase();
    const name = payload.name || email;
    let user = await Usermodel.findUserByEmail(email);

    if (!user) {
      const userId = crypto.randomUUID();
      await Usermodel.createUser(userId, name, email, null);
      // Email này đã được Google xác minh nên an toàn để nhận lời mời đang chờ
      await acceptPendingInvitations(userId, email);
      user = { id: userId, name, email };
    }

    // 3. Trả token của chính mình, giống hệt đăng nhập thường
    const token = createToken(user.id);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login, googleLogin };