const userModel = require("../models/userModel");
const response = require("../utils/response");
const { fileConfig } = require('../configs/database');
const mysql = require('mysql2/promise');
const log = require("../utils/log");
const authServices = require("../services/authServices");
const pool = mysql.createPool(fileConfig)
const userController = {};

userController.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    users.forEach(user => user.password = null)
    res.status(200).json(response.successResponse(users, "success"));
  } catch (err) {
    log.writeErrorLog(err.message)
    res.status(200).json({ message: "Something went wrong" });
  }
};

userController.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserById(id);
    if (!user) {
      log.writeErrorLog('User not found')
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(response.successResponse(user, "success"));
  } catch (err) {
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  }
};

userController.getUserRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userModel.getUserRoleById(id);
    if (!result) {
      log.writeErrorLog('User not found')
      return res.status(404).json({ message: "User not found" });
    }
    if (result.role == undefined) {
      throw new Error("Tài khoản chưa kích hoạt")
    }
    res.status(200).json(response.successResponse(result, "success"));
  } catch (err) {
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  }
};

userController.updateUserInfo = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const _user = req.body;
    await connection.beginTransaction();
    await authServices.validateUpdateInfor(_user)
    const user = await userModel.updateUserInfo(_user, connection);
    await connection.commit();
    res.status(200).json(response.successResponse(user, "success"));
  } catch (err) {
    await connection.rollback();
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  } finally {
    connection.release();
  }
};

module.exports = userController;
