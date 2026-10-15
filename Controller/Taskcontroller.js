const Taskmodel = require("../Model/Taskmodel");


async function getTask(req, res) {

    try {
        // Lấy giá trị boardId từ URL
        // ví dụ URL: /api/tasks?boardId=b1 -> boardId sẽ = "b1"
        const boardId = req.query.boardId;
        // Gọi xuống Model, đưa boardId vào, nhờ Model đi hỏi database
        // -> đi tới Taskmodel.js, chạy hàm getTasksByBoard(boardId)
        // -> Model sẽ chạy SQL: SELECT * FROM tasks WHERE board_id = boardId
        const task = await Taskmodel.getTasksByBoard(boardId);
        // Trả kết quả (mảng các task) về cho trình duyệt, dạng JSON
        // -> đi ngược lên Router -> lên trình duyệt, hiện lên màn hình
        res.json(task)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function createTask(req, res) {
    try {
        // lấy giá trị 
        const { id, title, boardId, assigneeId } = req.body;
        // gửi xuống model 
        await Taskmodel.createTask(id, title, boardId, assigneeId);

        res.status(201).json({ message: "Tạo task thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}
async function updateTask(req, res) {
    try {
        // lấy giá trị 
        const { id, title, assigneeId } = req.body;
        // gửi xuống model 
        if (!id) {
            return res.status(400).json({ error: "Thiếu id task" });
        }
       const affected =  await Taskmodel.updateTask(id, title, assigneeId);
       
        if (affected === 0) {
            return res.status(404).json({ message: "Không tìm thấy task để cập nhật" });
        }
        res.status(200).json({ message: "update thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}
async function deleteTask(req,res) {
    try{
        const {id} = req.params;
        if (!id) {
      return res.status(400).json({ error: "Thiếu id task" });
    }
     const affected = await Taskmodel.deleteTask(id);
     if (affected === 0) {
      return res.status(404).json({ message: "Không tìm thấy task để xóa" });
    }
     res.status(200).json({ message: "Xóa task thành công" });
    }catch (err) {
    res.status(500).json({ error: err.message });
  }
}



module.exports = { getTask, createTask,updateTask,deleteTask};