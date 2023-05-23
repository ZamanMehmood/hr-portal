const express = require("express");
const router = express.Router();
const controller = require("../controllers/knowledgebase.article.controller");
const authMiddleware = require("../middlewares/auth.middleware");
//
router.post("/addArticle", controller.createArticle);
router.get("/listArticle", controller.listArticle);
router.put("/:id", controller.updateArticle);
router.delete("/:id", controller.deleteArticle);

module.exports = router;
