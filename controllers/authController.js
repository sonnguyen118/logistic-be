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

const { fileConfig } = require("../configs/database");

dotenv.config();

const pool = mysql.createPool(fileConfig);

const authController = {};
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET_KEY;
const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY;
const USER_ROLE = process.env.USER_ROLE;

authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authServices.validateLoginForm(email, password);
    var token = jwt.sign({ id: user.id }, ACCESS_TOKEN);
    res.status(200).json(
      response.successResponse(
        {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          token: token,
        },
        "LOGGED IN SUCCESS"
      )
    );
  } catch (err) {
    res.status(200).json(response.errorResponse(err.message));
  }
};

authController.register = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const user = {
      email: req.body.email,
      password: req.body.password,
      rePassword: req.body.rePassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    await authServices.validateRegister(user);
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
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
    console.log("insertId", insertId);
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
        { id: insertId, email: user.email, firstName: user.firstName, lastName: user.lastName, token: token }, "success"
      )
      );
  } catch (err) {
    await connection.rollback();
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
    res.status(200).json(response.errorResponse(err.message));
  } finally {
    connection.release();
  }
};

module.exports = authController;
