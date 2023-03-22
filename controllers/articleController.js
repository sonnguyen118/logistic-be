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
const articleStoragePath = process.env.ARTICLE_IMAGES_STORAGE_PATH;
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
// chỉ được xem các bài đc hiển thị

articleController.getArticleByLink = async (req, res) => {
    let userId = req.body.userId;
    userId = !userId ? null : userId;
    const link = '/' + req.params.link;
    try {
        const article = await articleModel.getArticleByLink(link);
        if (!article || article.isEnabled != 1 || article.menuIsEnabled != 1) {
            throw new Error("Bài viết không tồn tại")
        }
        console.log(article)
        await userRoleService.checkUserHavePermission(userId, article.role, [USER_ROLE, ADMIN_ROLE])
        const articles = await articleModel.getArticleByMenuId(article.menu_id);
        articles.forEach(a => {
            a.content = ''
            if (a.id == article.id) {
                a.isCurrent = true;
            }
        })
        const result = {
            menu: article.menu_name,
            menu_link: article.menu_link,
            content: article.content,
            link: article.link,
            sibling: articles
        }
        res.status(200).json(response.successResponse(result, "success"));
    } catch (error) {
        log.writeErrorLog(error.message)
        res.status(200).json(response.errorResponse(error.message));
    }
}

//người bình thường chỉ được xem các bài đc hiển thị
articleController.getArticleById = async (req, res) => {
    const { userId, id } = req.body
    try {
        const article = await articleModel.getArticleById(id);
        if (!article || article.isEnabled != 1 || article.menuIsEnabled != 1) {
            throw new Error("Bài viết không tồn tại")
        }
        await userRoleService.checkUserHavePermission(userId, article.role, [USER_ROLE, ADMIN_ROLE])
        const articles = await articleModel.getArticleByMenuId(article.menu_id);
        articles.forEach(a => {
            a.content = ''
            if (a.id == article.id) {
                a.isCurrent = true;
            }
        })
        const result = {
            menu: article.name,
            content: article.content,
            link: article.link,
            sibling: articles
        }
        res.status(200).json(response.successResponse(result, "success"));
    } catch (error) {
        log.writeErrorLog(error.message)
        res.status(200).json(response.errorResponse(error.message));
    }
}

// admin có thể get tất cả các bài bị ẩn
articleController.adminGetArticleById = async (req, res) => {
    try {
        const articles = await articleModel.getArticleById(req.params.id);
        if (!articles) {
            throw new Error("Bài viết không tồn tại")
        }
        res.status(200).json(response.successResponse(articles, "success"));
    } catch (error) {
        log.writeErrorLog(error.message)
        res.status(200).json(response.errorResponse(error.message));
    }
}
articleController.handleCkeditor = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            throw new Error('No image file uploaded');
        }

        const address_file = `/${articleStoragePath}/${file.filename}`;
        const callback_function = req.query.CKEditorFuncNum;
        const response = `<script>window.parent.CKEDITOR.tools.callFunction('${callback_function}', '${address_file}');</script>`;
        return res.status(201).send(response);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
// admin ẩn, hiện bài viết
articleController.toggleEnabledArticles = async (req, res) => {
    try {
        const result = await articleModel.toggleEnabledArticle(req.params.id);
        res.status(200).json(response.successResponse(result, "OK"));
    } catch (error) {
        log.writeErrorLog(error.message)
        res.status(200).json(response.errorResponse(error.message));
    }
};



module.exports = articleController;