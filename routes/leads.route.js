const express = require("express");
const router = express.Router();
const controller = require("../controllers/leads.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//
router.post("/addLead", authMiddleware, controller.createLead);
router.get("/listLeads", authMiddleware, controller.listLeads);

router.get("/:id", authMiddleware, controller.getSignleLead);
router.put("/:id", authMiddleware, controller.updateLead);
router.delete("/:id", controller.deleteLead);

module.exports = router;
