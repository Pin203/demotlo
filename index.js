const pool = require("./config/db");

pool.query("SELECT 1")
  .then(() => console.log(" Kết nối MySQL thành công"))
  .catch((err) => console.log(" Lỗi kết nối:", err.message));