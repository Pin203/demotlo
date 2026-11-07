const pool = require("../config/db");

// Thêm 1 người vào workspace với 1 vai trò: "admin" | "member" | "viewer"
async function addMember(id, userId, workspaceId, role) {
  await pool.query(
    "INSERT INTO memberships (id, user_id, workspace_id, role) VALUES (?, ?, ?, ?)",
    [id, userId, workspaceId, role]
  );
}

// Xem ai đang ở trong workspace.
// Bảng memberships chỉ giữ mã user_id, muốn hiện tên và email phải nối (JOIN) sang bảng users.
async function getMembersByWorkspace(workspaceId) {
  const [rows] = await pool.query(
    `SELECT m.id, m.role, u.id AS user_id, u.name, u.email
     FROM memberships m
     JOIN users u ON u.id = m.user_id
     WHERE m.workspace_id = ?`,
    [workspaceId]
  );
  return rows;
}

// Tìm vai trò của 1 người trong 1 workspace. Không phải thành viên thì trả về undefined.
async function findMembership(userId, workspaceId) {
  const [rows] = await pool.query(
    "SELECT * FROM memberships WHERE user_id = ? AND workspace_id = ?",
    [userId, workspaceId]
  );
  return rows[0];
}

// Tìm 1 dòng membership theo id của chính nó (để biết nó thuộc workspace nào)
async function findMembershipById(id) {
  const [rows] = await pool.query("SELECT * FROM memberships WHERE id = ?", [id]);
  return rows[0];
}

// Đếm số admin của workspace (không cho xóa hoặc hạ quyền admin cuối cùng)
async function countAdmins(workspaceId) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS total FROM memberships WHERE workspace_id = ? AND role = 'admin'",
    [workspaceId]
  );
  return rows[0].total;
}

// Đổi vai trò. Trả về số dòng bị sửa (0 nghĩa là không tìm thấy id).
async function updateRole(id, role) {
  const [result] = await pool.query(
    "UPDATE memberships SET role = ? WHERE id = ?",
    [role, id]
  );
  return result.affectedRows;
}

// Xóa 1 thành viên khỏi workspace. Trả về số dòng bị xóa.
async function removeMember(id) {
  const [result] = await pool.query("DELETE FROM memberships WHERE id = ?", [id]);
  return result.affectedRows;
}

module.exports = {
  addMember,
  getMembersByWorkspace,
  findMembership,
  findMembershipById,
  countAdmins,
  updateRole,
  removeMember,
};