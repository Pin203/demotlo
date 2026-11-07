const crypto = require("crypto");
const Membershipmodel = require("../Model/membershipModel");
const Invitationmodel = require("../Model/Invitationmodel");
const Usermodel = require("../Model/userModel");

const ROLES = ["admin", "member", "viewer"];

// req.userId do Middleware/auth.js gắn vào sau khi kiểm tra token.
// Hàm này trả lời: "người đang gọi API có phải admin của workspace này không?"
async function isAdmin(userId, workspaceId) {
  const m = await Membershipmodel.findMembership(userId, workspaceId);
  return m?.role === "admin";
}

// Mời bằng email.
//  - Email đã có tài khoản: thêm thẳng vào workspace.
//  - Email chưa có tài khoản: lưu lời mời chờ, họ đăng ký sau sẽ tự vào.
async function inviteMember(req, res) {
  try {
    const { workspaceId, role } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !workspaceId || !ROLES.includes(role)) {
      return res
        .status(400)
        .json({ message: "Thiếu email, workspace hoặc vai trò không hợp lệ" });
    }
    if (!(await isAdmin(req.userId, workspaceId))) {
      return res.status(403).json({ message: "Chỉ admin mới được mời thành viên" });
    }

    const user = await Usermodel.findUserByEmail(email);

    if (user) {
      const existing = await Membershipmodel.findMembership(user.id, workspaceId);
      if (existing) {
        return res.status(400).json({ message: "Người này đã ở trong workspace" });
      }
      await Membershipmodel.addMember(crypto.randomUUID(), user.id, workspaceId, role);
      return res.status(201).json({ message: "Đã thêm vào workspace", status: "added" });
    }

    await Invitationmodel.createInvitation(
      crypto.randomUUID(),
      email,
      workspaceId,
      role,
      req.userId
    );
    res.status(201).json({
      message: "Email này chưa có tài khoản. Lời mời đã được lưu, họ đăng ký xong sẽ tự vào workspace.",
      status: "pending",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Đã mời email này rồi" });
    }
    res.status(500).json({ error: err.message });
  }
}

// Xem thành viên của workspace (chỉ thành viên của workspace đó mới xem được)
async function getMembers(req, res) {
  try {
    const { workspaceId } = req.params;
    const me = await Membershipmodel.findMembership(req.userId, workspaceId);
    if (!me) {
      return res.status(403).json({ message: "Bạn không thuộc workspace này" });
    }
    const members = await Membershipmodel.getMembersByWorkspace(workspaceId);
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Đổi vai trò (chỉ admin)
async function updateRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: "Vai trò không hợp lệ" });
    }

    const target = await Membershipmodel.findMembershipById(id);
    if (!target) {
      return res.status(404).json({ message: "Không tìm thấy thành viên" });
    }
    if (!(await isAdmin(req.userId, target.workspace_id))) {
      return res.status(403).json({ message: "Chỉ admin mới được đổi vai trò" });
    }

    // Không hạ quyền admin cuối cùng
    if (target.role === "admin" && role !== "admin") {
      const admins = await Membershipmodel.countAdmins(target.workspace_id);
      if (admins <= 1) {
        return res.status(400).json({ message: "Workspace phải còn ít nhất 1 admin" });
      }
    }

    await Membershipmodel.updateRole(id, role);
    res.json({ message: "Cập nhật vai trò thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Xóa thành viên (chỉ admin)
async function removeMember(req, res) {
  try {
    const { id } = req.params;

    const target = await Membershipmodel.findMembershipById(id);
    if (!target) {
      return res.status(404).json({ message: "Không tìm thấy thành viên" });
    }
    if (!(await isAdmin(req.userId, target.workspace_id))) {
      return res.status(403).json({ message: "Chỉ admin mới được xóa thành viên" });
    }

    // Không xóa admin cuối cùng
    if (target.role === "admin") {
      const admins = await Membershipmodel.countAdmins(target.workspace_id);
      if (admins <= 1) {
        return res.status(400).json({ message: "Workspace phải còn ít nhất 1 admin" });
      }
    }

    await Membershipmodel.removeMember(id);
    res.json({ message: "Xóa thành viên thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { inviteMember, getMembers, updateRole, removeMember };