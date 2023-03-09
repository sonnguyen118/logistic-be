const db = require("../configs/database");

const menuModel = {};

menuModel.getMenu = () => {
  const query = "SELECT * FROM menu";
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

menuModel.addMenu = (menu) => {
  const query = "INSERT INTO menu (name, link, description, parent_id) VALUE(?,?,?,?)";
  return new Promise((resolve, reject) => {
    db.query(query, [menu.name, menu.link, menu.description, menu.parentId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
};

menuModel.updateMenuById = (menu) => {
  const query = "UPDATE menu SET name =?, link =?,description =?, parent_id =? WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [menu.name, menu.link, menu.description, menu.parentId, menu.id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
};
module.exports = menuModel;
