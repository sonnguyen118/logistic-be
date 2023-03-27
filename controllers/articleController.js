const articleModel = require("../models/articleModel");
const response = require("../utils/response");
const mysql = require("mysql2/promise");
const { fileConfig } = require("../configs/database");
const userRoleService = require("../services/userRoleServices");
const log = require("../utils/log");
const path = require('path');

const dotenv = require("dotenv");

dotenv.config();
const USER_ROLE = process.env.USER_ROLE;
const ADMIN_ROLE = process.env.ADMIN_ROLE;
const articleStoragePath = process.env.ARTICLE_IMAGES_STORAGE_PATH;
const pool = mysql.createPool(fileConfig);

const articleController = {};
articleController.getArticles = async (req, res) => {
  try {
    const articles = await articleModel.getArticles();
    res.status(200).json(response.successResponse(articles, "success"));
  } catch (error) {
    log.writeErrorLog(error.message);
    res.status(200).json(response.errorResponse(error.message));
  }
};

articleController.addArticle = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const findArticleByLink = await articleModel.getArticleByLink(req.body.link, connection);
    if (findArticleByLink) {
      throw new Error('Link bài viết đã tồn tại')
    }
    const insertId = await articleModel.addArticle(req.body, connection);
    await connection.commit();
    res.status(200).json(response.successResponse(insertId, "OK"));
  } catch (error) {
    log.writeErrorLog(error.message);
    res.status(200).json(response.errorResponse(error.message));
  } finally {
    connection.release();
  }
};

articleController.updateArticle = async (req, res) => {
  const connection = await pool.getConnection();
  const { id, link } = req.body
  try {
    await connection.beginTransaction();
    const article = await articleModel.getArticleByLink(link)
    if (article && (article.link == link && id != article.id)) {
      throw new Error('Link bài viết đã tồn tại')
    }
    const isSuccess = await articleModel.updateArticleById(
      req.body,
      connection
    );
    await connection.commit();
    res.status(200).json(response.successResponse(isSuccess, "OK"));
  } catch (error) {
    log.writeErrorLog(error.message);
    res.status(200).json(response.errorResponse(error.message));
  } finally {
    connection.release();
  }
};
// chỉ được xem các bài đc hiển thị

articleController.getArticleByLink = async (req, res) => {
  let userId = req.body.userId;
  userId = !userId ? null : userId;
  const link = "/" + req.params.link;
  try {
    const article = await articleModel.getArticleByLink(link);
    if (!article || article.isEnabled != 1 || article.menuIsEnabled != 1) {
      throw new Error("Bài viết không tồn tại");
    }
    await userRoleService.checkUserHavePermission(userId, article.roleMenu, [
      USER_ROLE,
      ADMIN_ROLE,
    ]);
    const articles = await articleModel.getArticleByMenuId(article.menu_id);
    const sibling = [];
    for (const a of articles) {
      a.content = "";
      if (a.isEnabled == 0) {
        continue;
      }
      if (a.id == article.id) {
        a.isCurrent = true;
      }
      sibling.push(a);
    }
    const result = {
      id: article.id,
      description: article.description,
      tag: article.tag,
      menu: article.menu_name,
      menu_id: article.menu_id,
      menu_link: article.menu_link,
      content: article.content,
      link: article.link,
      sibling: sibling,
    };
    res.status(200).json(response.successResponse(result, "success"));
  } catch (error) {
    log.writeErrorLog(error.message);
    res.status(200).json(response.errorResponse(error.message));
  }
};

//người bình thường chỉ được xem các bài đc hiển thị
articleController.getArticleById = async (req, res) => {
  const { userId, id } = req.body;
  try {
    const article = await articleModel.getArticleById(id);
    if (!article || article.isEnabled != 1 || article.menuIsEnabled != 1) {
      throw new Error("Bài viết không tồn tại");
    }
    await userRoleService.checkUserHavePermission(userId, article.roleMenu, [
      USER_ROLE,
      ADMIN_ROLE,
    ]);
    const articles = await articleModel.getArticleByMenuId(article.menu_id);
    const sibling = [];
    for (const a of articles) {
      a.content = "";
      if (a.isEnabled == 0) {
        continue;
      }
      if (a.id == article.id) {
        a.isCurrent = true;
      }
      sibling.push(a);
    }
    const result = {
      id: article.id,
      description: article.description,
      tag: article.tag,
      menu: article.menu_name,
      menu_id: article.menu_id,
      menu_link: article.menu_link,
      content: article.content,
      link: article.link,
      sibling: sibling,
    };
    res.status(200).json(response.successResponse(result, "success"));
  } catch (error) {
    log.writeErrorLog(error.message);
    res.status(200).json(response.errorResponse(error.message));
  }
};
articleController.findArticleByTitle = async (req, res) => {
  const { userId, title } = req.body;
  try {
    let result = [];
    const articles = await articleModel.getArticleByTitle(title);
    if (articles) {
      for (const element of articles) {
        if (element.isEnabled == 0 || element.menuIsEnabled != 1) {
          continue;
        }
        try {
          await userRoleService.checkUserHavePermission(
            userId,
            element.roleMenu,
            [USER_ROLE, ADMIN_ROLE]
          );
        } catch (error) {
          continue;
        }
        const article = {
          title: element.title,
          link: element.link,
          description: element.description,
        };
        result.push(article);
      }
    }
    res.status(200).json(response.successResponse(result, "success"));
  } catch (error) {
    log.writeErrorLog(error.message);
    res.status(200).json(response.errorResponse(error.message));
  }
};

// admin có thể get tất cả các bài bị ẩn
articleController.adminGetArticleById = async (req, res) => {
  try {
    const articles = await articleModel.getArticleById(req.params.id);
    if (!articles) {
      throw new Error("Bài viết không tồn tại");
    }
    res.status(200).json(response.successResponse(articles, "success"));
  } catch (error) {
    log.writeErrorLog(error.message);
    res.status(200).json(response.errorResponse(error.message));
  }
};

articleController.uploadImages = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      throw new Error("No image file uploaded");
    }
    const result = files.map(e => {
      return e.originalname
    })
    return res.status(200).json(response.successResponse(result, "OK"));
  } catch (error) {
    res.status(400).send(error.message);
  }
};

articleController.handleCkeditor = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      throw new Error("No image file uploaded");
    }
    const address_file = `${req.protocol}://${req.get(
      "host"
    )}/${articleStoragePath}/${file.filename}`;
    // const response = { url: address_file };
    const response = {
      fileName: file.filename,
      uploaded: 1,
      error: {
        number: 201,
        message: `A file with the same name already exists. The uploaded file was renamed to ${file.filename}.`,
      },
      url: address_file,
    };
    // const callback_function = req.query.CKEditorFuncNum;
    // const response = `<script>window.parent.CKEDITOR.tools.callFunction('${callback_function}', '${address_file}');</script>`;
    return res.status(200).json(response);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
// admin ẩn, hiện bài viết
articleController.toggleEnabledArticles = async (req, res) => {
  try {
    const result = await articleModel.toggleEnabledArticle(req.params.id);
    res.status(200).json(response.successResponse(result, "OK"));
  } catch (error) {
    log.writeErrorLog(error.message);
    res.status(200).json(response.errorResponse(error.message));
  }
};

articleController.deleteArticleById = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await articleModel.deleteArticleById(
      req.params.id,
      connection
    );
    await connection.commit();
    res.status(200).json(response.successResponse(result, "delete success"));
  } catch (error) {
    await connection.rollback();
    log.writeErrorLog(error.message);
    res.status(200).json(response.errorResponse(error.message));
  } finally {
    connection.release();
  }
};

module.exports = articleController;
