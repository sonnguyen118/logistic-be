const { pool } = require("../configs/database");
const avoidUndefined = require("../utils/handleUndefinedValue");

const menuModel = {};

menuModel.getTextContentByName = async (names) => {
  const params = names.map(e => '?');
  const query = `SELECT * FROM manager WHERE name IN (${params})`;
  try {
    const [rows, fields] = await pool.query(query, names)
    return rows
  } catch (err) {
    throw err
  }
};

menuModel.addTextContent = async (textContent, transaction) => {
  const query = "INSERT INTO manager (name, content, description) VALUE(?,?,?)";
  try {
    const params = [textContent.name, textContent.content, textContent.description]
    avoidUndefined(params)
    const [rows, fields] = await transaction.execute(query, params)
    return rows.insertId
  } catch (err) {
    throw err
  }
};

menuModel.updateTextContentByName = async (textContent, transaction) => {
  const query = "UPDATE manager SET content =?, description =? WHERE name = ?";
  try {
    const params = [textContent.content, textContent.description, textContent.name]
    avoidUndefined(params)
    const [rows, fields] = await transaction.execute(query, params)
    return rows.insertId
  } catch (err) {
    throw err
  }
};


module.exports = menuModel;
