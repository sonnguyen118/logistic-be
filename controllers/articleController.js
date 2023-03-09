const articleModel = require("../models/articleModel");
const response = require("../utils/response");

const articleController = {}
articleController.getArticles = async (req, res) => {
    try {
        const articles = await articleModel.getArticles();
        res.status(200).json(response.successResponse(articles, "success"));
    } catch (error) {
        res.status(500).json(response.errorResponse(error.message));
    }
}

articleController.addArticle = async (req, res) => {
    try {
        const insertId = await articleModel.addArticle(req.body);
        res.status(200).json(response.successResponse(insertId, "OK"));
    } catch (error) {
        console.log(error)
        res.status(500).json(response.errorResponse(error.message));
    }
}

articleController.updateArticle = async (req, res) => {
    try {
        const insertId = await articleModel.updateArticleById(req.body);
        res.status(200).json(response.successResponse(insertId, "OK"));
    } catch (error) {
        res.status(500).json(response.errorResponse(error.message));
    }
}



module.exports = articleController;