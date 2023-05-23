const express = require("express");
const router = express.Router();
const controller = require("../../controllers/sales/estimates.controller");

router.post("/addEstimate", controller.addEstimate);
router.get("/listEstimates", controller.listEstimates);
router.get("/:id", controller.viewEstimate);
router.put("/:id", controller.editEstimate);
router.delete("/:id", controller.deleteEstimate);

module.exports = router;
