const express = require("express");
const router = express.Router();
const controller = require("../controllers/projects.controller");
const authMiddleware = require("../middlewares/auth.middleware");
//
router.post("/addProject", authMiddleware, controller.project);
router.get("/listProject", authMiddleware, controller.listProjects);
router.get("/:id", authMiddleware, controller.getSingleProject);
router.put("/:id", authMiddleware, controller.updateProject);
router.delete("/:id", authMiddleware, controller.deleteProject);

module.exports = router;
