require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const app = express();  
// Cho phép trình duyệt/frontend gọi được API
app.use(cors());
// Cho phép đọc dữ liệu JSON gửi lên qua req.body
app.use(express.json());
 

// Test kết nối database ngay lúc khởi động
pool.query("SELECT 1")
  .then(() => console.log("Ket noi MySQL thanh cong"))
  .catch((err) => console.log("Loi ket noi:", err.message));



// Mọi URL
const taskRouter = require("./Router/Taskrouter");
app.use("/api/tasks", taskRouter);
const WorkspaceRouter = require("./Router/Workspacerouter")
app.use("/api/works",WorkspaceRouter)
const boarRouter = require("./Router/Boabrrouter")
app.use("/api/boars", boarRouter) 
const projectRouter = require("./Router/Projectrouter")
app.use("/api/project", projectRouter ) 

const userRouter = require("./Router/userRouter");
app.use("/api/users", userRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chay tai http://localhost:${PORT}`);
});