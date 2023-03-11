const { pool } = require("../configs/database");

const menuModel = {};

menuModel.getMenu = async () => {
  const query = "SELECT * FROM menu";
  try {
    const [rows, fields] = await pool.query(query)
    return rows
  } catch (err) {
    throw err
  }
};

menuModel.addMenu = async (menu, transaction) => {
  const query = "INSERT INTO menu (name, link, description, parent_id) VALUE(?,?,?,?)";
  try {
    const [rows, fields] = await transaction.query(query, [menu.name, menu.link, menu?.description, menu?.parentId])
    return rows.insertId
  } catch (err) {
    throw err
  }
};

menuModel.updateMenuById = async (menu, transaction) => {
  const query = "UPDATE menu SET name =?, link =?,description =?, parent_id =? WHERE id = ?";
  try {
    const result = await transaction.execute(query, [menu.name, menu.link, menu.description, menu.parentId || null, menu.id])
    return result.affectedRows > 0;
  } catch (err) {
    throw err
  }
};
module.exports = menuModel;
