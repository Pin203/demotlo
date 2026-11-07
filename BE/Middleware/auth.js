const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization;     // frontend gửi kèm: "Bearer <token>"
  if (!header) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  try {
    const token = header.split(" ")[1];                       // tách lấy phần token sau chữ "Bearer"
    const data = jwt.verify(token, process.env.JWT_SECRET);      // kiểm tra vé thật hay giả
    req.userId = data.id;                                    // ghi nhớ "ai đang gọi"
    next();                                                    // cho đi tiếp sang Controller
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
}

module.exports = auth;