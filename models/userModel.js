const { query } = require("express");
const { pool } = require("../configs/database");
const avoidUndefined = require("../utils/handleUndefinedValue");

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
  const query = "SELECT first_name, last_name, gender, other_name, birthday, phone, avatar, role FROM users WHERE id = ?"
  try {
    const [rows, fields] = await pool.execute(query, [id])
    return rows[0];
  } catch (err) {
    throw err
  }
};
userModel.getUserPasswordById = async (id) => {
  const query = "SELECT password FROM users WHERE id = ?"
  try {
    const [rows, fields] = await pool.execute(query, [id])
    return rows[0];
  } catch (err) {
    throw err
  }
};

userModel.getUserRoleById = async (id) => {
  try {
    const [rows, fields] = await pool.execute("SELECT role FROM users WHERE id = ?", [id])
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
  var query = "UPDATE users SET verify_code = 1 , role = 2 WHERE id = ?";
  try {
    const result = await transaction.execute(query, [id])
    return result[0].affectedRows > 0;
  } catch (err) {
    throw err
  }
};
userModel.updateRetrievalCodeById = async (id, retrievalCode, transaction) => {
  var query = "UPDATE users SET retrieval_code = ? WHERE id = ?";
  try {
    const result = await transaction.execute(query, [retrievalCode, id])
    return result[0].affectedRows > 0;
  } catch (err) {
    throw err
  }
};

userModel.createUser = async (user, connection) => {
  const query =
    "INSERT INTO `users` (`email`, `password`,`phone`, `first_name`, `last_name`, `verify_code`) VALUES (?,?,?,?,?,?)";
  try {
    const params = [user.email, user.password, user.phone, user.firstName, user.lastName, user.verifyCode]
    avoidUndefined(params)
    const [rows, fields] = await connection.execute(query, params)
    return rows.insertId;
  } catch (err) {
    throw err
  }
};

userModel.updateUserInfo = async (user, transaction) => {
  const query = `UPDATE users SET first_name = ?, last_name= ?, other_name =?, gender= ?, phone= ?, birthday= ?, avatar= ? WHERE id = ?`;
  try {
    const params = [user.firstName, user.lastName, user.otherName, user.gender, user.phone, user.birthday, user.avatar, user.id]
    avoidUndefined(params);
    const result = await transaction.execute(query, params)
    return result[0].affectedRows > 0;
  } catch (err) {
    throw err
  }
};

userModel.updatePasswordById = async (id, newPassword, transaction) => {
  var query = "UPDATE users SET password = ? WHERE id = ?";
  try {
    const result = await transaction.execute(query, [newPassword, id])
    return result[0].affectedRows > 0;
  } catch (err) {
    throw err
  }
};

userModel.getUserByRetrievalCode = async (value) => {
  var query = "SELECT id FROM users WHERE retrieval_code = ?";
  try {
    const [rows, fields] = await pool.execute(query, [value]);
    return rows[0];
  } catch (err) {
    throw err;
  }
}

userModel.verifyUserByIds = async (ids, transaction) => {
  var query = "UPDATE users SET verify_code = 1 WHERE id IN (?)";
  try {
    const result = await transaction.execute(query, ids)
    return result[0].affectedRows > 0;
  } catch (err) {
    throw err
  }
};

userModel.deleteUsers = async (ids, transaction) => {
  const query = "DELETE FROM users WHERE id IN (?)";
  try {
    const result = await transaction.execute(query, ids)
    return result[0].affectedRows > 0;
  } catch (err) {
    throw err
  }
};
module.exports = userModel;
