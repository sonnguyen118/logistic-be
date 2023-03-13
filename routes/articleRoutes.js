const express = require("express");
const articleController = require("../controllers/articleController");
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/", authMiddleware.authenticateRequest, articleController.getArticles);
router.post("/add", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.addArticle);
router.post("/update", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.updateArticle);
router.get("/:link", articleController.getArticleByLink);
router.post("/", articleController.getArticleById);

module.exports = router;
