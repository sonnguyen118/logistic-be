const articleModel = require("../models/articleModel");
const response = require("../utils/response");
const mysql = require('mysql2/promise');
const { fileConfig } = require('../configs/database');
const userRoleService = require("../services/userRoleServices");
const log = require("../utils/log");

const dotenv = require("dotenv");

dotenv.config();
const USER_ROLE = process.env.USER_ROLE;
const ADMIN_ROLE = process.env.ADMIN_ROLE;

const pool = mysql.createPool(fileConfig)

const articleController = {}
articleController.getArticles = async (req, res) => {
    try {
        const articles = await articleModel.getArticles();
        res.status(200).json(response.successResponse(articles, "success"));
    } catch (error) {
        log.writeErrorLog(error.message)
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
        log.writeErrorLog(error.message)
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
        log.writeErrorLog(error.message)
        res.status(200).json(response.errorResponse(error.message));
    } finally {
        connection.release();
    }
}

articleController.getArticleByLink = async (req, res) => {
    let userId = req.body.userId;
    userId = !userId ? null : userId;
    const link = '/' + req.params.link;
    try {
        const articles = await articleModel.getArticleByLink(link);
        if (!articles) {
            throw new Error("B??i vi???t kh??ng t???n t???i")
        }
        await userRoleService.checkUserHavePermission(userId, articles?.role, [USER_ROLE, ADMIN_ROLE])
        res.status(200).json(response.successResponse(articles, "success"));
    } catch (error) {
        log.writeErrorLog(error.message)
        res.status(200).json(response.errorResponse(error.message));
    }
}

articleController.getArticleById = async (req, res) => {
    const { userId, id } = req.body
    try {
        const articles = await articleModel.getArticleById(id);
        if (!articles) {
            throw new Error("B??i vi???t kh??ng t???n t???i")
        }
        await userRoleService.checkUserHavePermission(userId, articles.role, [USER_ROLE, ADMIN_ROLE])
        res.status(200).json(response.successResponse(articles, "success"));
    } catch (error) {
        log.writeErrorLog(error.message)
        res.status(200).json(response.errorResponse(error.message));
    }
}


module.exports = articleController;