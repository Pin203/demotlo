const pool = require("../config/db");

async function getAllWorkspaces() {
    const [rows] = await pool.query(
        "SELECT * FROM workspaces"
    );
    return rows
}
async function createWorkspaces(id, name) {
 const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Step 1: Thêm Workspace mới
    await connection.query(
      "INSERT INTO workspaces (id, name) VALUES (?, ?)",
      [id, name]
    );

    // Step 2: Tự động gắn quyền admin cho người tạo trong bảng memberships
    await connection.query(
      "INSERT INTO memberships (user_id, workspace_id, role) VALUES (?, ?, ?)",
      [userId, id, 'admin']
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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