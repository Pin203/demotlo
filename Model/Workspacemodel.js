const pool = require("../config/db");

async function getAllWorkspaces() {
    const [rows] = await pool.query(
        "SELECT * FROM workspaces"
    );
    return rows
}
async function createWorkspaces(id, name) {
  const [result] = await pool.query(
    "INSERT INTO Workspaces (id, name) VALUES (?, ?)",
    [id, name]
);
return result
}
async function updateWorkspaces(name,id) {
     const [result] = await pool.query(
    "UPDATE Workspaces SET name = ? WHERE id = ?",
    [ name,id]
     )
     return result.affectedRows
}
async function deleteWorkspaces(id) {
  const [result] = await pool.query(
    "DELETE FROM Workspaces WHERE id = ?",
    [id]
  );
  return result.affectedRows;
}
module.exports = { getAllWorkspaces,createWorkspaces,updateWorkspaces,deleteWorkspaces };