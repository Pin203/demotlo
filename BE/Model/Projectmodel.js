const pool = require("../config/db");

// Model = nơi DUY NHẤT được viết câu lệnh SQL, chạm vào database
async function getProjecByworks(workspacesId) {
  const [rows] = await pool.query(
    "SELECT * FROM projects WHERE workspace_id = ?",
    [workspacesId]
  );
  return rows;
}
async function creatproject(id, name,workspacesId) {
  const [result] = await pool.query(
    "INSERT INTO  projects (id, name, workspace_id  ) VALUES (?,?,?) ",
    [id, name, workspacesId],
  );
   return result;
}
async function updateproject(name,id) {
     const [result] = await pool.query(
    "UPDATE projects SET name = ? WHERE id = ?",
    [ name,id]
     )
     return result.affectedRows
}
async function deleteproject(id) {
  const [result] = await pool.query(
    "DELETE FROM projects WHERE id = ?",
    [id]
  );
  return result.affectedRows;
}
module.exports = {
  getProjecByworks,
  creatproject,
  updateproject,
  deleteproject
}
