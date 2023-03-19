const menuModel = require("../models/menuModel");
const response = require("../utils/response");
const { fileConfig } = require('../configs/database');
const mysql = require('mysql2/promise');
const dotenv = require("dotenv");
const userRoleService = require("../services/userRoleServices");
const menuService = require("../services/menuService");

const log = require("../utils/log");

dotenv.config();
const USER_ROLE = process.env.USER_ROLE;
const ADMIN_ROLE = process.env.ADMIN_ROLE;

const pool = mysql.createPool(fileConfig)
const menuController = {};

// lấy danh sách menu
menuController.getMenu = async (req, res) => {
  try {
    const result = await menuModel.getMenu();
    const menu = result.filter(e => e.isEnabled == 1)
    menuService.arrangeMenu(menu);
    res.status(200).json(response.successResponse(menu, "OK"));
  } catch (error) {
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  }
};

// lấy danh sách menu cho admin, gồm cả những menu đã bị ẩn
menuController.getMenuForAdmin = async (req, res) => {
  try {
    const menu = await menuModel.getMenu();
    res.status(200).json(response.successResponse(menu, "OK"));
  } catch (error) {
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  }
};
// admin có thể ẩn, hiện menu
menuController.toggleEnabledMenu = async (req, res) => {
  try {
    const result = await menuModel.toggleEnabledMenu(req.params.id);
    res.status(200).json(response.successResponse(result, "OK"));
  } catch (error) {
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  }
};

menuController.addMenu = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const insertId = await menuModel.addMenu(req.body, connection);
    await connection.commit();
    res.status(200).json(response.successResponse(insertId, "OK"));
  } catch (error) {
    await connection.rollback();
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  } finally {
    connection.release();
  }
};

menuController.updateMenu = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await menuModel.updateMenuById(req.body, connection);
    await connection.commit();
    res.status(200).json(response.successResponse(result, "OK"));
  } catch (error) {
    await connection.rollback();
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  } finally {
    connection.release();
  }
};

//lấy các bài viết thuộc về menu 
menuController.getArticlesByMenuLink = async (req, res) => {
  const { userId, link } = req.body;
  try {
    const menu = await menuModel.getRoleMenuByLink(link);
    const roleMenu = menu.role;
    const menuId = menu.id;
    await userRoleService.checkUserHavePermission(userId, roleMenu, [USER_ROLE, ADMIN_ROLE]);
    const articles = await menuModel.getArticlesByMenuId(menuId);
    const result = articles.filter(e => e.isEnabled == 1 && e.articleEnabled == 1)
    res.status(200).json(response.successResponse(result, "OK"));
  } catch (error) {
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  }
};
//admin lấy tất cả các bài viết thuộc về menu, kể cả bị ẩn
menuController.adminGetArticlesByMenuId = async (req, res) => {
  const id = req.params.id;
  try {
    const articles = await menuModel.getArticlesByMenuId(id);
    res.status(200).json(response.successResponse(articles, "OK"));
  } catch (error) {
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  }
};


//hoán đổi vị trí của menu
menuController.orderByMenu = async (req, res) => {
  const { first_position, second_position } = req.body
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const menu = await menuModel.orderByMenu(first_position, second_position, connection);
    await connection.commit();
    res.status(200).json(response.successResponse(menu, "OK"));
  } catch (error) {
    await connection.rollback();
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  } finally {
    connection.release();
  }
};

menuController.getMenuById = async (req, res) => {
  const id = req.params.id;
  try {
    const menu = await menuModel.getMenuById(id);
    res.status(200).json(response.successResponse(menu, "OK"));
  } catch (error) {
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  }
};

//lấy quyền của menu
menuController.updateMenuRoleById = async (req, res) => {
  const { menuId, role } = req.body
  try {
    const menu = await menuModel.updateMenuRole(menuId, role);
    res.status(200).json(response.successResponse(menu, "OK"));
  } catch (error) {
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  }
};

// lấy menu khi người dùng vào trực tiếp bằng url
menuController.getMenuByLink = async (req, res) => {
  const link = '/' + req.params.link;
  try {
    const menu = await menuModel.getMenuByLink(link);
    res.status(200).json(response.successResponse(menu, "OK"));
  } catch (error) {
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  }
};

module.exports = menuController;
