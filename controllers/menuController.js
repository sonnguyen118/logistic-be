const menuModel = require("../models/menuModel");
const response = require("../utils/response");
const { fileConfig } = require('../configs/database');
const mysql = require('mysql2/promise');

const pool = mysql.createPool(fileConfig)
const menuController = {};

menuController.getMenu = async (req, res) => {
  try {
    const menu = await menuModel.getMenu();
    res.status(200).json(response.successResponse(menu, "OK"));
  } catch (error) {
    res.status(200).json(response.errorResponse(error.message));
  }
};

menuController.addMenu = async (req, res) => {
  const connection = await pool.getConnection();
  console.log(req.body)
  try {
    await connection.beginTransaction();
    const insertId = await menuModel.addMenu(req.body, connection);
    await connection.commit();
    res.status(200).json(response.successResponse(insertId, "OK"));
  } catch (error) {
    console.log(error.messsage);
    await connection.rollback();
    res.status(200).json(response.errorResponse(error.message));
  } finally {
    connection.release();
  }
};

menuController.updateMenu = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const insertId = await menuModel.updateMenuById(req.body, connection);
    await connection.commit();
    res.status(200).json(response.successResponse(insertId, "OK"));
  } catch (error) {
    await connection.rollback();
    res.status(200).json(response.errorResponse(error.message));
  } finally {
    connection.release();

  }
};

module.exports = menuController;
