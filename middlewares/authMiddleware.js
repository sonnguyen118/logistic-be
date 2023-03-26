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
    const userId = req.user.id
    const permissionId = req.body.permissionId
    const result = await userModel.getUserRoleById(userId);
    const isAdmin = result?.role == process.env.ADMIN_ROLE;
    const isUser = result?.role == process.env.USER_ROLE;
    req.user.isAdmin = isAdmin;
    if (!isAdmin) {
      if (isUser) {
        const permissions = await userModel.getUserPermissionById(userId);
        if (permissionId) {
          if (!permissions.some(p => p.id == permissionId)) {
            throw new Error('Bạn chưa được cấp quyền thực hiện hành động này')
          }
        } else {
          // trường hợp upload file thì permissionId sẽ = undefined 
          if (permissions.length == 0) return res.status(401).json(response.errorResponse("Lỗi phân quyền"));
          else req.user.permissions = permissions
        }
      }
    }
    next();
  } catch (err) {
    log.writeErrorLog(err?.message)
    res.status(401).json(response.errorResponse(err.message));
  }
};

authMiddleware.authorizeUploadFile = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      const permissionId = req.body.permissionId;
      const userPermissions = req.user.permissions;
      if (!userPermissions.some(p => p.id == permissionId)) {
        throw new Error('Bạn chưa được cấp quyền thực hiện hành động này')
      }
    }
    next();
  } catch (err) {
    log.writeErrorLog(err?.message)
    res.status(401).json(response.errorResponse(err.message));
  }
};
module.exports = authMiddleware;
