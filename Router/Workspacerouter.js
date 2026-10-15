const express = require("express");
const router = express.Router();
const workspaceController = require("../Controller/Workspacecontroller");

router.get("/", workspaceController.getWorkspaces);
router.post("/", workspaceController.createWork);
router.put("/", workspaceController.updateWork);
router.delete("/:id", workspaceController.deleteWork);
module.exports = router;