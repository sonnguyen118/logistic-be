const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const response = require("../utils/response");
const userModel = require("../models/userModel");
const log = require("../utils/log");
dotenv.config();



const authMiddleware = {};

authMiddleware.authenticateRequest = async (req, res, next) => {
  try {
    let token = req.headers['authorization'];
    if (token) {
      token = token.replace('Bearer', '').trim();
    }
    // const token = req.cookies.access_token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    req.user = decoded;
    const isActive = await userModel.isActiveUser(req.user.id);
    if (!isActive) {
      log.writeErrorLog("Tài khoản chưa được kích hoạt")
      return res.status(200).json(response.errorResponse("Tài khoản chưa được kích hoạt"));
    }
    next();
  } catch (err) {
    log.writeErrorLog(err.message)
    res.status(403).json(response.errorResponse(err.message));
  }
};

authMiddleware.authorize = async (req, res, next) => {
  try {
    const result = await userModel.getUserRoleById(req.user.id);

    if (result?.role != process.env.ADMIN_ROLE) {
      log.writeErrorLog("Lỗi phân quyền")
      return res.status(401).json(response.errorResponse("Lỗi phân quyền"));
    }
    next();
  } catch (err) {
    log.writeErrorLog(err?.message)
    res.status(401).json(response.errorResponse(err.message));
  }
};

module.exports = authMiddleware;
