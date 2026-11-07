const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");
const membershipController = require("../Controller/Membershipcontroller");

// Mọi route đều cần đăng nhập (auth) vì phải biết AI đang gọi để kiểm tra quyền
router.post("/invite", auth, membershipController.inviteMember);
router.get("/:workspaceId", auth, membershipController.getMembers);
router.put("/:id", auth, membershipController.updateRole);
router.delete("/:id", auth, membershipController.removeMember);

module.exports = router;