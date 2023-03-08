const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

authService = {};

const PASSWORD_LENGTH = 6;
authService.validateRegister = async (user) => {
  if (user.email) {
    const _user = await userModel.getUserByEmail(user.email);
    if (_user) {
      throw new Error("email đã tồn tại");
    }
  } else {
    throw new Error("email không được phép trống");
  }
  if (user.password) {
    if (user.password.length < PASSWORD_LENGTH) {
      throw new Error(
        `password không được phép nhỏ hơn ${PASSWORD_LENGTH} kí tự`
      );
    }
  } else {
    throw new Error("password không được phép trống");
  }
  if (user.password != user.rePassword) {
    throw new Error("rePassword phải trùng với password");
  }
  if (!user.firstName) {
    throw new Error("firstName không được phép trống");
  }
  if (!user.lastName) {
    throw new Error("lastName không được phép trống");
  }
};
authService.validateLoginForm = async (email, password) => {
  const user = await userModel.getUserByEmail(email);
  if (user) {
    if (user.confirmCode != 1) {
      throw new Error("Tài khoản chưa được kích hoạt");
    }
  } else {
    throw new Error("Email không tồn tại");
  }
  const isPasswordValid = bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Mật khẩu không chính xác");
  }
  return user;
};
authService.validateToken = async (token) => {
  if (!token) {
    throw new Error("Không tìm thấy token");
  }
  const isValidToken = jwt.verify(token, process.env.ACCESS_TOKEN);
  if (!isValidToken) {
    throw new Error("Token không hợp lệ");
  }
};

authService.createUrlVerifyUser = async (hostPrefix, verifyCode) => {
  return hostPrefix + "/api/auth/verify/" + verifyCode;
};

module.exports = authService;
