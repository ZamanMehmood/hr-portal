const express = require("express");
const router = express.Router();
const controller = require("../../controllers/sales/products.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

router.post("/addProduct", controller.addProduct);
router.get("/listProducts", controller.listProducts);
router.get("/:id", controller.viewProduct);
router.put("/:id", controller.editProduct);
router.delete("/:id", controller.deleteProduct);

module.exports = router;
