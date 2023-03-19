const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

authService = {};

const PASSWORD_LENGTH = 6;

function validatePassword(password, rePassword) {
  if (password) {
    if (password.length < PASSWORD_LENGTH) {
      throw new Error(`Mật khẩu không được ít hơn ${PASSWORD_LENGTH} kí tự`);
    }
  } else {
    throw new Error("Mật khẩu không được phép trống");
  }
  if (password != rePassword) {
    throw new Error("Mật khẩu nhập lại không khớp");
  }
}
authService.validateRetrievalPassword = async (user) => {
  validatePassword(password, rePassword);
}

authService.validateRegister = async (user) => {
  if (user.email) {
    const _user = await userModel.getUserByEmail(user.email);
    if (_user) {
      throw new Error("Email đã tồn tại");
    }
  } else {
    throw new Error("Email không được phép trống");
  }
  if (!user.phone) {
    throw new Error("Số điện thoại không được phép trống");
  } else {
    const pattern = /^0[0-9]{9}$|^0[0-9]{8}$/
    if (!pattern.test(user.phone)) {
      throw new Error("Số điện thoại không hợp lệ");
    }
  }
  validatePassword(user.password, user.rePassword)
  if (!user.firstName) {
    throw new Error("Tên không được phép trống");
  }
  if (!user.lastName) {
    throw new Error("Họ không được phép trống");
  }
};
authService.validateLoginForm = async (email, password) => {
  const user = await userModel.getUserByEmail(email);
  if (!user) {
    throw new Error("Email không tồn tại");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
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


authService.validateUpdateInfor = async (user) => {
  const pattern = /^0[0-9]{9}$|^0[0-9]{8}$/
  if (!pattern.test(user.phone)) {
    throw new Error("Số điện thoại không hợp lệ");
  }
};
authService.validateModifyPasswordForm = async (userId, oldPassword, newPassword, reNewPassword) => {
  if (oldPassword == newPassword) {
    throw new Error('Mật khẩu mới không được trùng với mật khẩu cũ')
  }
  const user = await userModel.getUserPasswordById(userId);
  if (!user) {
    throw new Error('User not found')
  }
  else {
    console.log(user)
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Mật khẩu hiện tại không đúng");
    }
    validatePassword(newPassword, reNewPassword)
    if (newPassword != reNewPassword) {
      throw new Error('Mật khẩu mới không khớp')
    }
  }
  return user;
};
module.exports = authService;
