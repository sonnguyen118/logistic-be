const userModel = require("../models/userModel");
const response = require("../utils/response");
const { fileConfig } = require('../configs/database');
const mysql = require('mysql2/promise');

const pool = mysql.createPool(fileConfig)
const userController = {};

userController.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(response.successResponse(users, "success"));
  } catch (err) {
    res.status(200).json({ message: "Something went wrong" });
  }
};

userController.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(response.successResponse(user, "success"));
  } catch (err) {
    res.status(200).json(response.errorResponse(err.message));
  }
};

userController.updateUserInfo = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const user = await userModel.updateUserInfo(req.body, connection);
    await connection.rollback();
    res.status(200).json(response.successResponse(user, "success"));
  } catch (err) {
    connection.release();
    res.status(200).json(response.errorResponse(err.message));
  } finally {
    connection.release();
  }
};

module.exports = userController;
