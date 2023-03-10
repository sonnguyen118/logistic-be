const { query } = require("express");
const db = require("../configs/database");

const userModel = {};

userModel.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

userModel.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT first_name, last_name, gender, birthday, phone, avatar FROM users WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length === 0) {
            resolve(null);
          } else {
            resolve(results[0]);
          }
        }
      }
    );
  });
};

userModel.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        // console.log(results)
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0]);
        }
      }
    });
  });
};
userModel.getUserByVerifyCode = (value) => {
  var query = "SELECT * FROM users WHERE verify_code = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [value], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0]);
        }
      }
    });
  });
};

userModel.updateVerifyCode = (id) => {
  var query = "UPDATE users SET verify_code = 1 WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0]);
        }
      }
    });
  });
};

userModel.createUser = (user) => {
  const query =
    "INSERT INTO `users` (`email`, `password`, `first_name`, `last_name`, `verify_code`,`created_date`,`role`) VALUES (?,?,?,?,?,?,?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.verifyCode,
        new Date(),
        user.role,
      ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.insertId);
        }
      }
    );
  });
};

userModel.updateUserInfo = (user) => {
  const query = `UPDATE users SET first_name = ?, last_name= ?, gender= ?, phone= ?, birthday= ?, avatar= ? WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        user.firstName,
        user.lastName,
        user.gender,
        user.phone,
        user.birthday,
        user.avatar,
        user.id,
      ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.insertId);
        }
      }
    );
  });
};

module.exports = userModel;
