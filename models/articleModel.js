const { pool } = require("../configs/database");
const avoidUndefined = require("../utils/handleUndefinedValue");

const articleModel = {};

articleModel.getArticles = async () => {
  const query = "SELECT * FROM articles WHERE isEnabled = true";
  try {
    const [rows, fields] = await pool.query(query)
    return rows
  } catch (err) {
    throw err
  }
};

articleModel.addArticle = async (article, transaction) => {
  const query = "INSERT INTO articles (title, link, menu_id, content, description, isEnabled, tag) VALUE(?,?,?,?,?,?,?)";
  try {
    article.isEnabled = true;
    const params = [article.title, article.link, article.menu_id, article.content, article.description, article.isEnabled, article.tag]
    avoidUndefined(params)
    const [rows, fields] = await transaction.execute(query, params)
    return rows.insertId
  } catch (err) {
    throw err
  }
};

articleModel.updateArticleById = async (article, transaction) => {
  const query = "UPDATE articles SET title =?, link =?,menu_id =?, content =?, description=?, isEnabled =?, tag =?   WHERE id = ?";
  try {
    const params = [article.title, article.link, article.menu_id, article.content, article.description, article.isEnabled, article.tag, article.id]
    avoidUndefined(params)
    const result = await transaction.execute(query, params)
    return result[0].affectedRows > 0;
  } catch (err) {
    throw err
  }
};

articleModel.getArticleByLink = async (link) => {
  const query = "SELECT a.*, m.isEnabled as menuIsEnabled,m.name as menu_name, m.id as menu_id, m.link as menu_link FROM ((SELECT * FROM articles WHERE link = ?) a JOIN menu m ON a.menu_id = m.id)";
  try {
    const [rows, fields] = await pool.execute(query, [link])
    return rows[0]
  } catch (err) {
    throw err
  }
};

articleModel.getArticleById = async (id) => {
  const query = "SELECT a.*, m.isEnabled as menuIsEnabled,m.name as menu_name, m.id as menu_id, m.link as menu_link FROM ((SELECT * FROM articles WHERE id = ?) a JOIN menu m ON a.menu_id = m.id)";
  try {
    const [rows, fields] = await pool.execute(query, [id])
    return rows[0]
  } catch (err) {
    throw err
  }
};
articleModel.getArticleByMenuId = async (menuId) => {
  const query = "SELECT * from articles WHERE menu_id = ?";
  try {
    const [rows, fields] = await pool.execute(query, [menuId])
    return rows
  } catch (err) {
    throw err
  }
};

articleModel.toggleEnabledArticle = async (id) => {
  const query = "UPDATE articles SET isEnabled = !isEnabled WHERE id = ?";
  try {
    const [rows, fields] = await pool.query(query, [id])
    return rows.affectedRows
  } catch (err) {
    throw err
  }
};


module.exports = articleModel;
