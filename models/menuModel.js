const { pool } = require("../configs/database");
const avoidUndefined = require("../utils/handleUndefinedValue");

const menuModel = {};

menuModel.getMenu = async () => {
  const query = "SELECT * FROM menu ORDER BY priority_id";
  try {
    const [rows, fields] = await pool.query(query)
    return rows
  } catch (err) {
    throw err
  }
};
menuModel.toggleEnabledMenu = async (id) => {
  const query = "UPDATE menu SET isEnabled = !isEnabled WHERE id = ?";
  const queryUpdateArticle = "UPDATE articles SET isEnabled = !isEnabled WHERE menu_id = ?";

  try {
    const [rows, fields] = await pool.query(query, [id])
    await pool.query(queryUpdateArticle, [id])
    return rows.affectedRows
  } catch (err) {
    throw err
  }
};

menuModel.addMenu = async (menu, transaction) => {
  const query = "INSERT INTO menu (name, link, description, parent_id) VALUE(?,?,?,?)";
  try {
    const params = [menu.name, menu.link, menu.description, menu.parentId]
    avoidUndefined(params)
    const [rows, fields] = await transaction.query(query, params)
    return rows.insertId
  } catch (err) {
    throw err
  }
};

menuModel.updateMenuById = async (menu, transaction) => {
  //Cập nhật menu và quyền các bài viết thuộc menu
  const queryUpdateMenu = "UPDATE menu SET name =?, link =?,description =?,role = ? WHERE id = ?";
  const queryUpdateArticle = "UPDATE articles SET role = ? WHERE menu_id = ?";
  try {
    const paramsUpdateMenu = [menu.name, menu.link, menu.description, menu.role, menu.id]
    avoidUndefined(paramsUpdateMenu)
    const updateMenu = await transaction.execute(queryUpdateMenu, paramsUpdateMenu)
    const paramsUpdateArticle = [menu.role, menu.id]
    avoidUndefined(paramsUpdateArticle)
    const updateArticles = await transaction.execute(queryUpdateArticle, paramsUpdateArticle)
    return updateMenu[0].affectedRows > 0;
  } catch (err) {
    throw err
  }
};

menuModel.getArticlesByMenuId = async (id) => {
  const query = "SELECT m.*, a.id as articleId,a.title,a.link,a.description,a.create_at,a.update_at, a.tag" +
    " FROM (" +
    "( SELECT * FROM `menu` WHERE id = ? AND isEnabled = 1) as m JOIN articles a ON m.id = a.menu_id );"
  try {
    const [rows, fields] = await pool.execute(query, [id])
    return rows
  } catch (err) {
    throw err
  }
};

menuModel.getRoleMenuById = async (id) => {
  const query = "SELECT role FROM menu WHERE id = ?"
  try {
    const [rows, fields] = await pool.execute(query, [id])
    return rows[0]
  } catch (err) {
    throw err
  }
};


menuModel.getRoleMenuByLink = async (link) => {
  const query = "SELECT role,id FROM menu WHERE link = ?"
  try {
    const [rows, fields] = await pool.execute(query, [link])
    return rows[0]
  } catch (err) {
    throw err
  }
};

menuModel.getMenuById = async (id) => {
  const query = "SELECT * FROM menu WHERE id = ?"
  try {
    const [rows, fields] = await pool.execute(query, [id])
    return rows[0]
  } catch (err) {
    throw err
  }
};
menuModel.getMenuByLink = async (link) => {
  const query = "SELECT * FROM menu WHERE link = ?"
  try {
    const [rows, fields] = await pool.execute(query, [link])
    return rows[0]
  } catch (err) {
    throw err
  }
};
menuModel.orderByMenu = async (firsId, secondId, transaction) => {
  const query1 = "UPDATE menu SET priority_id = -1 WHERE priority_id = ?"
  const [result1, fields1] = await transaction.execute(query1, [firsId])
  if (result1.affectedRows == 0) {
    throw new Error("Lỗi vị trí bản ghi")
  }
  const query2 = "UPDATE menu SET priority_id = ? WHERE priority_id = ?"
  const [result2, fields2] = await transaction.execute(query2, [firsId, secondId])
  if (result2.affectedRows == 0) {
    throw new Error("Lỗi vị trí bản ghi")
  }
  const query3 = "UPDATE menu SET priority_id = ? WHERE priority_id = -1"
  const [rows, fields3] = await transaction.execute(query3, [secondId])
  try {
    return rows.affectedRows > 0;
  } catch (err) {
    throw err
  }
};


module.exports = menuModel;
