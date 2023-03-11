const { pool } = require("../configs/database");

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
  article.isEnabled = true;
  try {
    const [rows, fields] = await transaction.execute(query, [article.title, article.link, article.menu_id, article?.content, article?.description, article.isEnabled, article?.tag])
    return rows.insertId
  } catch (err) {
    throw err
  }
};

articleModel.updateArticleById = async (article, transaction) => {
  const query = "UPDATE articles SET title =?, link =?,menu_id =?, content =?, description=?, isEnabled =?, tag =?   WHERE id = ?";
  try {
    const result = await transaction.execute(query, [article.title, article.link, article.menu_id, article.content, article?.description, article.isEnabled, article?.tag, article.id])
    console.log(result)
    return result[0].affectedRows > 0;
  } catch (err) {
    throw err
  }
};

module.exports = articleModel;
