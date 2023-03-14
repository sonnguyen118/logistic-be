const express = require("express");
const articleController = require("../controllers/articleController");
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadArticle } = require("../services/uploadImageService");

const router = express.Router();

router.get("/", authMiddleware.authenticateRequest, articleController.getArticles);
router.post("/add", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.addArticle);
router.post("/update", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.updateArticle);
router.post("/upload-img", authMiddleware.authenticateRequest, uploadArticle.single('img'), function (req, res) { res.status(200).json({ success: true, message: "success" }) });
router.post("/:link", articleController.getArticleByLink);
router.post("/", articleController.getArticleById);

module.exports = router;
