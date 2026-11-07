const pool = require("../config/db");

// Model = nơi DUY NHẤT được viết câu lệnh SQL, chạm vào database
async function getboardIdbuyProject(ProjectId) {
  const [rows] = await pool.query(
    "SELECT * FROM boards WHERE project_id = ?",
    [ProjectId]
  );
  return rows;
}
async function creatboabr(id, name,projectId) {
  const [result] = await pool.query(
    "INSERT INTO  boards (id, name, project_id ) VALUES (?,?,?) ",
    [id, name, projectId],
  );
   return result;
}
async function updateboabr(name,id) {
     const [result] = await pool.query(
    "UPDATE boards SET name = ? WHERE id = ?",
    [ name,id]
     )
     return result.affectedRows
}
async function deleteboabr(id) {
  const [result] = await pool.query(
    "DELETE FROM boards WHERE id = ?",
    [id]
  );
  return result.affectedRows;
}
module.exports = { getboardIdbuyProject,creatboabr,updateboabr, deleteboabr};