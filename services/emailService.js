const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");
const emailTemplate = require("../template/emailTemplate");
const emailRetrievePasswordTemplate = require("../template/emailRetrievePassword");
const log = require("../utils/log");

dotenv.config();

const SERVICE_MAIL = "gmail";
const EMAIL_SEVER = process.env.EMAIL_MAY_CHU;
const PASSWORD_EMAIL_SEVER = process.env.MK_EMAIL_MAY_CHU;
const EMAIL_ADMIN = process.env.EMAIL_ADMIN;
const email = {};

email.sendEmailVerifyToAdmin = async (_user, _urlVerify) => {
  const user = await _user;
  const urlVerify = await _urlVerify;
  // Generate confirmation token
  const transporter = nodemailer.createTransport({
    service: SERVICE_MAIL,
    auth: {
      user: EMAIL_SEVER,
      pass: PASSWORD_EMAIL_SEVER,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // thêm thông tin thời gian khi gửi
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  const formattedDate = date.toLocaleDateString("vi-VN", options);
  // template html email

  const mailOptions = {
    from: EMAIL_SEVER,
    to: EMAIL_ADMIN,
    subject: "Xác thực tài khoản SinoViet Logistics",
    html: emailTemplate(formattedDate, user, urlVerify),
  };

  const info = transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      log.writeErrorLog(error.message)
      throw new Error("Có lỗi trong quá trình gửi email, mời bạn quay lại sau")
    } else {
      log.writeLog("Email sent: " + info.response)
      log.writeLog("Email veify code: " + urlVerify);
    }
  });
};

email.sendRetrievalPasswordRequest = async (_email, _link, _password) => {
  const email = await _email;
  const link = await _link;
  const password = await _password;


  // Generate confirmation token
  const transporter = nodemailer.createTransport({
    service: SERVICE_MAIL,
    auth: {
      user: EMAIL_SEVER,
      pass: PASSWORD_EMAIL_SEVER,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // thêm thông tin thời gian khi gửi
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  const formattedDate = date.toLocaleDateString("vi-VN", options);
  // template html email

  const mailOptions = {
    from: EMAIL_SEVER,
    to: email,
    subject: "Yêu cầu cấp lại mật khẩu tài khoản SinoViet Logistics",
    html: emailRetrievePasswordTemplate(link, password),
  };

  const info = transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      log.writeErrorLog(error.message)
      throw new Error("Có lỗi trong quá trình gửi email, mời bạn quay lại sau")
    } else {
      log.writeLog("Email sent: " + info.response)
      log.writeLog("Email veify code: " + urlVerify);
    }
  });
};


module.exports = email;
