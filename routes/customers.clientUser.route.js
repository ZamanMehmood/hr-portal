const express = require("express");
const router = express.Router();
const controller = require("../controllers/customers.clientUser.controller");
// const authMiddleware = require("../middlewares/auth.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

//
router.post("/addUser", authMiddleware, controller.clientUser);
router.get("/listUsers", authMiddleware, controller.listClientUsers);
router.get("/:id", authMiddleware, controller.getSingalClientUser);
router.put("/:id", authMiddleware, controller.updateClientUser);
router.delete("/:id", authMiddleware, controller.deleteClientUser);

module.exports = router;
