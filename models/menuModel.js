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

menuModel.addMenu = async (menu) => {
  const query =
    "INSERT INTO menu(name,path,description,parent_id) VALUE(?,?,?,?)";
  return new Promise((resolve, reject) => {
    db.query(query, [menu.name, menu.parentId, menu.description, menu.parentId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.insertId);
      }
    });
  });
};

menuModel.updateMenuById = async (menu) => {
  const result = null;
  const query =
    "UPDATE menu SET name =?, path =?,description =?, parent_id =? WHERE id = ?";
  try {
    result = await db.query(query, [
      menu.name,
      menu.path,
      menu.description,
      menu.parentId,
      menu.id,
    ]);
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = menuModel;
