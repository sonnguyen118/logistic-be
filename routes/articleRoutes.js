const express = require("express");
const articleController = require("../controllers/articleController");
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadArticle } = require("../services/uploadImageService");

const router = express.Router();

// Xử lý yêu cầu tải lên ảnh CKEditor
router.post('/ckeditor_image', uploadArticle.single('img'), articleController.handleCkeditor);
router.get("/", authMiddleware.authenticateRequest, articleController.getArticles);
router.post("/add", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.addArticle);
router.post("/update", authMiddleware.authenticateRequest, authMiddleware.authorize, articleController.updateArticle);
router.post("/:link", articleController.getArticleByLink);
router.post("/", articleController.getArticleById);


module.exports = router;
