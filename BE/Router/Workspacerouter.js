const express = require("express");
const router = express.Router();
const workspaceController = require("../Controller/Workspacecontroller");
const auth = require("../Middleware/auth");
router.get("/", auth, workspaceController.getWorkspaces);
router.post("/", auth, workspaceController.createWork); 
router.put("/", auth, workspaceController.updateWork);
router.delete("/:id", auth, workspaceController.deleteWork);
module.exports = router;