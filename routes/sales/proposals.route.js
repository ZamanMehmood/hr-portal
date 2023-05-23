const express = require("express");
const router = express.Router();
const controller = require("../../controllers/sales/proposals.controller");

router.post("/addProposal", controller.addProposal);
router.get("/listProposals", controller.listProposals);
router.get("/:id", controller.viewProposal);
router.put("/:id", controller.editProposal);
router.delete("/:id", controller.deleteProposal);

module.exports = router;
