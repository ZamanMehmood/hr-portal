const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.auth.controller");
//
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/forgot-password", controller.forgotPassword);
router.put("/reset-password", controller.resetPassword);

module.exports = router;
