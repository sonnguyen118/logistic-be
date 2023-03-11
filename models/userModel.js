const { query } = require("express");
const { pool } = require("../configs/database");

const userModel = {};

userModel.getAllUsers = async () => {
  const query = 'SELECT * FROM users';
  try {
    const [rows, fields] = await pool.query(query)
    return rows
  } catch (err) {
    throw err
  }
};

userModel.getUserById = async (id) => {
  const query = "SELECT first_name, last_name, gender, birthday, phone, avatar FROM users WHERE id = ?"
  try {
    const [rows, fields] = await pool.execute(query, [id])
    return rows[0];
  } catch (err) {
    throw err
  }
};

userModel.getUserRoleById = async (id) => {
  try {
    const [rows, fields] = await pool.execute("SELECT id,role FROM users WHERE id = ?", [id])
    return rows[0];
  }
  catch (err) {
    throw err
  }
};
userModel.isActiveUser = async (id) => {
  try {
    const [rows, fields] = await pool.execute("SELECT id, verify_code FROM users WHERE id = ? AND verify_code = ?", [id, 1])
    return rows[0]?.verify_code == 1;
  }
  catch (err) {
    throw err
  }
};

userModel.getUserByEmail = async (email) => {
  try {
    const [rows, fields] = await pool.execute("SELECT * FROM users WHERE email = ?", [email])
    return rows[0];
  } catch (e) {
    throw e;
  }
};
userModel.getUserByVerifyCode = async (value) => {
  var query = "SELECT * FROM users WHERE verify_code = ?";
  try {
    const [rows, fields] = await pool.execute(query, [value]);
    return rows[0];
  } catch (err) {
    throw err;
  }
}

userModel.updateVerifyCode = async (id, transaction) => {
  var query = "UPDATE users SET verify_code = 1 WHERE id = ?";
  try {
    const result = await transaction.execute(query, [id])
    return result.affectedRows > 0;
  } catch (err) {
    throw err
  }
};

userModel.createUser = async (user, connection) => {
  const query =
    "INSERT INTO `users` (`email`, `password`, `first_name`, `last_name`, `verify_code`,`role`) VALUES (?,?,?,?,?,?)";
  try {
    const [rows, fields] = await connection.execute(query, [user.email, user.password, user.firstName, user.lastName, user.verifyCode, user.role])
    return rows.insertId;
  } catch (err) {
    throw err
  }
};

userModel.updateUserInfo = async (user, transaction) => {
  const query = `UPDATE users SET first_name = ?, last_name= ?, gender= ?, phone= ?, birthday= ?, avatar= ? WHERE id = ?`;
  try {
    const result = await transaction.execute(query, [user.firstName, user.lastName, user.gender, user.phone, user.birthday, user.avatar, user.id])
    return result.affectedRows > 0;
  } catch (error) {
    throw err
  }
};

module.exports = userModel;
