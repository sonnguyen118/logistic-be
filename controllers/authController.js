const userModel = require("../models/userModel");
const authServices = require("../services/authServices");
const emailService = require("../services/emailService");
const response = require("../utils/response");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const successTemplate = require("../template/successTemplate");
const failedTemplate = require("../template/failedTemplate");
const log = require("../utils/log");
const { fileConfig } = require("../configs/database");

dotenv.config();

const pool = mysql.createPool(fileConfig);

const authController = {};

authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authServices.validateLoginForm(email, password);
    var accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: 30 * 60 * 60 * 24 });
    var refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_KEY_SECRET_KEY, { expiresIn: 30 * 60 * 60 * 24 });
    res.cookie(process.env.REFRESH_TOKEN_KEY, refreshToken, {
      maxAge: 30 * 60 * 60 * 24,
      httpOnly: true,
      secure: false
    });
    log.writeLog("LOGGED IN SUCCESS")
    res.status(200).json(
      response.successResponse(
        {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.first_name,
          lastName: user.last_name,
          avatar: user.avatar,
          token: accessToken,
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
    var accessToken = jwt.sign({ id: insertId }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: 30 * 60 * 60 * 24 });
    var refreshToken = jwt.sign({ id: insertId }, process.env.REFRESH_TOKEN_KEY_SECRET_KEY, { expiresIn: 30 * 60 * 60 * 24 });
    res.cookie(process.env.REFRESH_TOKEN_KEY, refreshToken, {
      maxAge: 30 * 60 * 60 * 24,
      httpOnly: true,
      secure: false
    });
    //send confirm email to admin
    emailService.sendEmailVerifyToAdmin(user, urlVerify);
    await connection.commit();
    res.status(200)
      .json(response.successResponse(
        { id: insertId, email: user.email, phone: user.phone, firstName: user.firstName, lastName: user.lastName, token: accessToken }, "success"
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
  let responseTemplate = failedTemplate.createForm('Tài khoản đã được kích hoạt !');
  try {
    await connection.beginTransaction();
    const verifyCode = req.params.verifyCode;
    if (verifyCode == 1) {
      throw new Error('Mã kích hoạt không hợp lệ')
    }
    const user = await userModel.getUserByVerifyCode(verifyCode, connection);
    if (user) {
      const result = await userModel.updateVerifyCode(user.id, connection);
      if (result) {
        responseTemplate = successTemplate.createForm('Kích hoạt thành công')
      }
    }
    res.status(200).send(responseTemplate);
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    log.writeErrorLog(err.message)
    res.status(200).send(responseTemplate);
  } finally {
    connection.release();
  }
};

authController.verifyByIds = async (req, res) => {
  const ids = req.body.ids;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await userModel.verifyUserByIds(ids, connection);
    await connection.commit();
    res.status(200).json(response.successResponse(result, "OK"));
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

authController.sendRetrievalPasswordRequest = async (req, res) => {
  const connection = await pool.getConnection();
  const email = req.body.email
  try {
    await connection.beginTransaction();
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      throw new Error("Email không tồn tại")
    }

    // create verify code
    const retrievalCode = crypto.randomBytes(20).toString("hex");
    const hostPrefix = `${req.protocol}://${req.get("host")}`;
    const randomPassword = Math.floor(Math.random() * 10000000).toString();
    const retrievalLink = await authServices.createRetrievalLink(
      hostPrefix,
      retrievalCode,
      randomPassword
    );
    // set retrieval code cho user
    emailService.sendRetrievalPasswordRequest(email, retrievalLink, randomPassword);
    await userModel.updateRetrievalCodeById(user.id, retrievalCode, connection);
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

authController.confirmRetrievePassword = async (req, res) => {
  const connection = await pool.getConnection();
  const { retrievalCode, newPassword } = req.params
  let responseTemplate = failedTemplate.createForm('Yêu cầu lấy lại mật khẩu không hợp lệ');
  try {
    if (retrievalCode.trim().length == 0) {
      throw new Error("Có lỗi xảy ra")
    }
    await connection.beginTransaction();
    const user = await userModel.getUserByRetrievalCode(retrievalCode)
    if (!user) {
      throw new Error("Không tồn tại mã lấy lại mật khẩu")
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const result = await userModel.updatePasswordById(user.id, hashedPassword, connection);
    await userModel.updateRetrievalCodeById(user.id, '', connection);
    responseTemplate = successTemplate.createForm('Bạn đã lấy lại lại mật khẩu thành công')
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    log.writeErrorLog(err.message)
  } finally {
    connection.release();
    res.status(200).send(responseTemplate);
  }
};




authController.refreshToken = async (req, res) => {

};

module.exports = authController;
