const express = require("express");
const router = express.Router();
const BoabrController = require("../Controller/Boabrcontroller");

router.get("/", BoabrController.getBoabr);
router.post("/",BoabrController.createBoabr);
router.put("/", BoabrController.updateboabr);
router.delete("/:id",BoabrController.deleteboabr)
module.exports = router;