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
  await pool.query(
    "INSERT INTO tasks (id, title, board_id, assignee_id) VALUES (?, ?, ?, ?)",
    [id, title, boardId, assigneeId]
  );
}

module.exports = { getTasksByBoard, createTask };