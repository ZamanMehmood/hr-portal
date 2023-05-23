const express = require("express");
const router = express.Router();
const controller = require("../../controllers/sales/invoices.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

router.post("/addInvoice", controller.createInvoice);
router.get("/listInvoices", controller.listInvoices);
router.get("/:id", controller.viewInvoice);
router.put("/:id", controller.editInvoice);
router.delete("/:id", controller.deleteInvoice);

module.exports = router;
