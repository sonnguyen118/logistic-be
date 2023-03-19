const userModel = require("../models/userModel");
const authServices = require("../services/authServices");
const emailService = require("../services/emailService");
const response = require("../utils/response");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const succeedAfterVerify = require("../template/succeedAfterVerify");
const account_verified_template = require("../template/account_verified_template");
const log = require("../utils/log");
const { fileConfig } = require("../configs/database");

dotenv.config();

const pool = mysql.createPool(fileConfig);

const authController = {};
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET_KEY;
const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;

authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authServices.validateLoginForm(email, password);
    var token = jwt.sign({ id: user.id }, ACCESS_TOKEN);
    log.writeLog("LOGGED IN SUCCESS")
    res.status(200).json(
      response.successResponse(
        {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.first_name,
          lastName: user.last_name,
          token: token,
        },
        "LOGGED IN SUCCESS"
      )
    );
  } catch (err) {
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  }
};

authController.register = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // const { email, phone, password, rePassword, firstName, lastName } = req.body
    const user = {
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      rePassword: req.body.rePassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    await authServices.validateRegister(user);
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    // create verify code
    const verifyCode = crypto.randomBytes(20).toString("hex");
    const hostPrefix = `${req.protocol}://${req.get("host")}`;
    const urlVerify = await authServices.createUrlVerifyUser(
      hostPrefix,
      verifyCode
    );
    user.password = hashedPassword;
    user.verifyCode = verifyCode;

    //save user
    const insertId = await userModel.createUser(user, connection);
    // create token
    var token = jwt.sign({ id: insertId }, ACCESS_TOKEN);
    res.cookie(ACCESS_TOKEN_KEY, token, {
      maxAge: 24 * 60 * 60 * 1000,
    });
    //send confirm email to admin
    emailService.sendEmailVerifyToAdmin(user, urlVerify);
    await connection.commit();
    res.status(200)
      .json(response.successResponse(
        { id: insertId, email: user.email, phone: user.phone, firstName: user.firstName, lastName: user.lastName, token: token }, "success"
      )
      );
  } catch (err) {
    await connection.rollback();
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  } finally {
    connection.release();
  }
};

authController.verifyRegister = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const verifyCode = req.params.verifyCode;
    let htmlAfterVerify = account_verified_template;
    const user = await userModel.getUserByVerifyCode(verifyCode, connection);
    if (user) {
      const result = await userModel.updateVerifyCode(user.id, connection);
      if (result) {
        htmlAfterVerify = succeedAfterVerify
      }
    }
    res.status(200).send(htmlAfterVerify);
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  } finally {
    connection.release();
  }
};

authController.sendRetrievalPasswordRequest = async (req, res) => {
  const connection = await pool.getConnection();
  const email = req.body.email
  try {
    await connection.beginTransaction();
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      throw new Error("Email không tồn tại")
    }
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    emailService.sendRetrievalPasswordRequest(email, randomNum);
    // update user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomNum.toString(), salt);
    await userModel.updatePasswordById(user.id, hashedPassword, connection);
    const message = `Hệ thống đã gửi mật khẩu vào địa chỉ email của bạn: ${email}`
    res.status(200).json(response.successResponse(message));
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  } finally {
    connection.release();
  }
};

authController.modifyPassword = async (req, res) => {
  const connection = await pool.getConnection();
  const { userId, oldPassword, newPassword, reNewPassword } = req.body
  try {
    await connection.beginTransaction();
    await authServices.validateModifyPasswordForm(userId, oldPassword, newPassword, reNewPassword);
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    // console.log
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const result = await userModel.updatePasswordById(userId, hashedPassword, connection);
    res.status(200).json(response.successResponse(result, 'Đổi mật khẩu thành công'));
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  } finally {
    connection.release();
  }
};

module.exports = authController;
