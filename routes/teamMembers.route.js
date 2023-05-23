const express = require("express");
const router = express.Router();
const controller = require("../controllers/teamMembers.controller");
//
router.post("/addMember", controller.addTeamMember);
router.get("/listMembers", controller.listTeamMembers);
router.put("/:id", controller.updateMember);
router.delete("/:id", controller.deleteMember);

module.exports = router;
