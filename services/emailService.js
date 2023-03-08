const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");

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

  const mailOptions = {
    from: EMAIL_SEVER,
    to: EMAIL_ADMIN,
    subject: "Confirmation Email",
    text: user.username + " - " + urlVerify,
  };

  const info = transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      // throw new Error(error.message);
      console.log(error.message);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = email;
