const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const response = require('../utils/response');

dotenv.config();

const authMiddleware = {};

authMiddleware.authenticateRequest = async (req, res, next) => {
  const token = req.cookies.access_token;
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    next();
  } catch (err) {
    return res.status(401).json(response.errorResponse('Invalid token'));
  }
};

module.exports = authMiddleware;
