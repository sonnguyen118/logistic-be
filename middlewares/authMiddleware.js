const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const response = require("../utils/response");
const userModel = require("../models/userModel");

dotenv.config();

const authMiddleware = {};

authMiddleware.authenticateRequest = async (req, res, next) => {
  const token = req.cookies.access_token;
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json(response.errorResponse("Invalid token"));
  }
};

authMiddleware.authorize = async (req, res, next) => {
  try {
    const user = await userModel.getUserById(req.user.id);
    if (user.role != process.env.ADMIN_ROLE) {
      return res.status(401).json(response.errorResponse("Lỗi phân quyền"));
    }
    next();
  } catch (err) {
    res.status(401).json(response.errorResponse(err.message));
  }
};

module.exports = authMiddleware;
