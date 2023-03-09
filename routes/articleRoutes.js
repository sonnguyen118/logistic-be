const express = require("express");
const articleController = require("../controllers/articleController");

const router = express.Router();

router.get("/", articleController.getArticles);
router.post("/add", articleController.addArticle);
router.post("/update", articleController.updateArticle);

module.exports = router;
