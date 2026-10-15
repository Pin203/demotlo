const express = require("express");
const router = express.Router();
const taskController = require("../Controller/Taskcontroller");
// console.log(taskController);
// Khi trình duyệt gọi GET /api/tasks?boardId=... -> chạy hàm getTasks
router.get("/", taskController.getTask);

// Khi trình duyệt gọi POST /api/tasks (kèm dữ liệu trong body) -> chạy hàm createTask
router.post("/", taskController.createTask);
router.put("/", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
module.exports = router;