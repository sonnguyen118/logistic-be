const menuModel = require("../models/menuModel");
const response = require("../utils/response");
const { fileConfig } = require('../configs/database');
const mysql = require('mysql2/promise');
const dotenv = require("dotenv");
const userRoleService = require("../services/userRoleServices");
const log = require("../utils/log");

dotenv.config();
const USER_ROLE = process.env.USER_ROLE;
const ADMIN_ROLE = process.env.ADMIN_ROLE;

const pool = mysql.createPool(fileConfig)
const menuController = {};

menuController.getMenu = async (req, res) => {
  try {
    const menu = await menuModel.getMenu();
    res.status(200).json(response.successResponse(menu, "OK"));
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

menuController.getArticlesByMenuId = async (req, res) => {
  const { userId, menuId } = req.body;
  try {
    const menu = await menuModel.getRoleMenuById(menuId);
    const roleMenu = menu.role;
    await userRoleService.checkUserHavePermission(userId, roleMenu, [USER_ROLE, ADMIN_ROLE]);
    const articles = await menuModel.getArticlesByMenuId(menuId);
    res.status(200).json(response.successResponse(articles, "OK"));
  } catch (error) {
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  }
};


module.exports = menuController;
