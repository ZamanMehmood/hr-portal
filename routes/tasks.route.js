const express = require("express");
const router = express.Router();
const controller = require("../controllers/tasks.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//
router.post("/addTask", authMiddleware, controller.createTask);
router.get("/listTasks", authMiddleware, controller.listTask);
router.get("/:id", authMiddleware, controller.getSingleTask);
router.put("/:id", authMiddleware, controller.updateTask);
router.delete("/:id", authMiddleware, controller.deleteTask);

module.exports = router;
