const express = require("express");
const router = express.Router();
const controller = require("../controllers/projects.templates.controller");
const authMiddleware = require("../middlewares/auth.middleware");
//
router.post("/addTemplate", authMiddleware, controller.addTemplate);
router.get("/listTemplates", authMiddleware, controller.listTemplates);
router.get("/:id", authMiddleware, controller.getSignleTemplate);
router.put("/:id", authMiddleware, controller.updateTemplate);
router.delete("/:id", authMiddleware, controller.deleteTemplate);

module.exports = router;
