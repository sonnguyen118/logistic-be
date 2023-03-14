const managerModel = require("../models/managerModel");
const response = require("../utils/response");
const { fileConfig } = require('../configs/database');
const mysql = require('mysql2/promise');
const dotenv = require("dotenv");
const log = require("../utils/log");

dotenv.config();

const pool = mysql.createPool(fileConfig)
const managerController = {};

managerController.getTextByName = async (req, res) => {
  try {
    let names = req.body.names
    if (!Array.isArray(names) || names.length == 0) {
      throw new Error("params is invalid")
    }
    const content = await managerModel.getTextContentByName(names);
    res.status(200).json(response.successResponse(content, "OK"));
  } catch (error) {
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  }
};

managerController.addText = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const content = await managerModel.addTextContent(req.body, connection);
    await connection.commit();
    res.status(200).json(response.successResponse(content, "OK"));
  } catch (error) {
    await connection.rollback();
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  } finally {
    connection.release();
  }
};

managerController.updateText = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const content = await managerModel.updateTextContentByName(req.body, connection);
    await connection.commit();
    res.status(200).json(response.successResponse(content, "OK"));
  } catch (error) {
    await connection.rollback();
    log.writeErrorLog(error.message)
    res.status(200).json(response.errorResponse(error.message));
  } finally {
    connection.release();
  }
};



module.exports = managerController;
