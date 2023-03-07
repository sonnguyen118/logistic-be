const { query } = require('express');
const db = require('../configs/database');

const userModel = {};

userModel.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users', (err, results) => {
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
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
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

userModel.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
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
  const query = 'INSERT INTO `users` (`email`, `password`, `first_name`, `last_name`, `status`,`created_date`,`role`) VALUES (?,?,?,?,?,?,?)'
  return new Promise((resolve, reject) => {
    db.query(query, [user.email, user.password, user.firstName, user.lastName, user.status, new Date(), user.role], (err, results) => {
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

module.exports = userModel;
