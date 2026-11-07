const pool = require("../config/db");

// Lưu 1 lời mời chờ cho email chưa có tài khoản
async function createInvitation(id, email, workspaceId, role, invitedBy) {
  await pool.query(
    "INSERT INTO invitations (id, email, workspace_id, role, invited_by) VALUES (?, ?, ?, ?, ?)",
    [id, email, workspaceId, role, invitedBy]
  );
}

// Tìm mọi lời mời đang chờ của 1 email
async function findInvitationsByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM invitations WHERE email = ?", [email]);
  return rows;
}

// Xóa lời mời (sau khi đã chuyển thành thành viên thật)
async function deleteInvitation(id) {
  await pool.query("DELETE FROM invitations WHERE id = ?", [id]);
}

module.exports = { createInvitation, findInvitationsByEmail, deleteInvitation };