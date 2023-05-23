const express = require("express");
const router = express.Router();
const controller = require("../../controllers/sales/payments.controller");

router.post("/addPayment", controller.addPayment);
router.get("/listPayments", controller.listPayments);
router.get("/:id", controller.viewPayment);
router.put("/:id", controller.editPayment);
router.delete("/:id", controller.deletePayment);

module.exports = router;
