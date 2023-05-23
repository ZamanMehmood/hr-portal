const express = require("express");
const router = express.Router();
const controller = require("../controllers/cutomers.client.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//
router.post("/addClient", authMiddleware, controller.Clients);
router.get("/listClients", authMiddleware, controller.listClients);
router.get("/:id", authMiddleware, controller.getSingalClient);
router.put("/:id", authMiddleware, controller.updateClient);
router.delete("/:id", authMiddleware, controller.deleteClient);

module.exports = router;
