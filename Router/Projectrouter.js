const express = require("express");
const router = express.Router();

const projectController = require("../Controller/Projectcontroller");

router.get("/", projectController.getProject);
router.post("/", projectController.createProject);
router.put("/", projectController.updateproject);
router.delete("/:id", projectController.deleteproject);


// Khi trình duyệt gọi POST /api/tasks (kèm dữ liệu trong body) -> chạy hàm createTask

module.exports = router;