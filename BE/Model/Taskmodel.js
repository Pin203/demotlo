const pool = require("../config/db");

// Model = nơi DUY NHẤT được viết câu lệnh SQL, chạm vào database
async function getTasksByBoard(boardId) {
  const [rows] = await pool.query(
    "SELECT * FROM tasks WHERE board_id = ?",
    [boardId]
  );
  return rows;
}

async function createTask(id, title, boardId, assigneeId) {
 const [result] = await pool.query(
    "INSERT INTO tasks (id, title, board_id, assignee_id) VALUES (?, ?, ?, ?)",
    [id, title, boardId, assigneeId]
  );
  return result.insertId;
}
async function updateTask(id, title, assigneeId) {
  const [result] = await pool.query(
    "UPDATE tasks SET title = ?,assignee_id = ? WHERE id = ?",
    [title, assigneeId, id]
  );
  return result.affectedRows;
}
async function deleteTask(id) {
  const [result] = await pool.query(
    "DELETE FROM tasks WHERE id = ?",
    [id]
  );
  return result.affectedRows;
}
module.exports = { getTasksByBoard, createTask,updateTask,deleteTask };