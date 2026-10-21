const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Usermodel = require("../Model/userModel");
const jwt = require("jsonwebtoken");
async function register(req, res) {
  try {
    // 1. NHẬN: lấy dữ liệu frontend gửi lên
    const { name, email, password } = req.body;

    // 2. KIỂM TRA: email này đã có người dùng chưa?
    const exists = await Usermodel.findUserByEmail(email);
    if (exists) {
      return res.status(400).json({ message: "Email đã được dùng" });
    }

    // 3. MÃ HÓA mật khẩu: database chỉ lưu chuỗi đã mã hóa, không lưu mật khẩu gốc
    const hashed = await bcrypt.hash(password, 10);

    // 4. GỌI Model để lưu, id tự sinh ngẫu nhiên nên frontend không cần gửi id
    await Usermodel.createUser(crypto.randomUUID(), name, email, hashed);

    // 5. TRẢ kết quả
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await Usermodel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
    }

   const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Sai email hoặc mật khẩu" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
module.exports = { register,login };