const articleModel = require("../models/articleModel");
const response = require("../utils/response");
const mysql = require('mysql2/promise');
const { fileConfig } = require('../configs/database');

const pool = mysql.createPool(fileConfig)

const articleController = {}
articleController.getArticles = async (req, res) => {
    try {
        const articles = await articleModel.getArticles();
        res.status(200).json(response.successResponse(articles, "success"));
    } catch (error) {
        res.status(200).json(response.errorResponse(error.message));
    }
}

articleController.addArticle = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const insertId = await articleModel.addArticle(req.body, connection);
        await connection.commit();
        res.status(200).json(response.successResponse(insertId, "OK"));
    } catch (error) {
        res.status(200).json(response.errorResponse(error.message));
    } finally {
        connection.release();
    }
}

articleController.updateArticle = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const isSuccess = await articleModel.updateArticleById(req.body, connection);
        await connection.commit();
        res.status(200).json(response.successResponse(isSuccess, "OK"));
    } catch (error) {
        res.status(200).json(response.errorResponse(error.message));
    } finally {
        connection.release();
    }
}



module.exports = articleController;