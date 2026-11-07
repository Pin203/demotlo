const crypto = require("crypto");
const Invitationmodel = require("../Model/Invitationmodel");
const Membershipmodel = require("../Model/membershipModel");

// Gọi ngay sau khi 1 user vừa được tạo (đăng ký hoặc đăng nhập Google lần đầu).
// Mọi lời mời chờ gửi tới email của họ được chuyển thành thành viên thật, rồi xóa lời mời.
async function acceptPendingInvitations(userId, email) {
  const invitations = await Invitationmodel.findInvitationsByEmail(email);

  for (const inv of invitations) {
    const already = await Membershipmodel.findMembership(userId, inv.workspace_id);
    if (!already) {
      await Membershipmodel.addMember(
        crypto.randomUUID(),
        userId,
        inv.workspace_id,
        inv.role
      );
    }
    await Invitationmodel.deleteInvitation(inv.id);
  }
}

module.exports = { acceptPendingInvitations };