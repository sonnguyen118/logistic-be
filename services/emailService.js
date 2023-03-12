const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");
const emailTemplate = require("../configs/emailTemplate");

dotenv.config();

const SERVICE_GMAIL = "gmail";
const EMAIL_SEVER = "canh3108@gmail.com";
const PASSWORD_EMAIL_SEVER = "nofsuhfvylpgrhpp";
const EMAIL_ADMIN = "canhtx95@gmail.com";
const email = {};

email.sendEmailVerifyToAdmin = async (_user, _urlVerify) => {
  const user = await _user;
  const urlVerify = await _urlVerify;
  // Generate confirmation token
  const transporter = nodemailer.createTransport({
    service: SERVICE_GMAIL,
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
    subject: "Xác thực tài khoản Viet-Sino logistic",
    html: emailTemplate(formattedDate, user, urlVerify),
  };

  const info = transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error.message);
    } else {
      console.log("Email sent: " + info.response);
      console.log("Email: " + urlVerify);
    }
  });
};

module.exports = email;
