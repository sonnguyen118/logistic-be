const db = require("../configs/database");

const articleModel = {};

articleModel.getArticles = () => {
  const query = "SELECT * FROM articles WHERE isEnabled = true";
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

articleModel.addArticle = (article) => {
  const query = "INSERT INTO articles (title, link, menu_id, content, description, isEnabled, tag) VALUE(?,?,?,?,?,?,?)";
  article.isEnabled = true;
  return new Promise((resolve, reject) => {
    db.query(query, [article.title, article.link, article.menu_id, article.content, article.description, article.isEnabled, article.tag], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
};

articleModel.updateArticleById = (article) => {
  const query = "UPDATE articles SET title =?, link =?,menu_id =?, content =?, description=?, isEnabled =?, tag =?   WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [article.title, article.link, article.menu_id, article.content, article.description, article.isEnabled, article.tag, article.id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
};

module.exports = articleModel;
