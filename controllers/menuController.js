const menuModel = require("../models/menuModel");
const response = require("../utils/response");

const menuController = {};

menuController.getMenu = async (req, res) => {
  try {
    const menu = await menuModel.getMenu();
    res.status(200).json(response.successResponse(menu, "OK"));
  } catch (error) {
    res.status(200).json(response.errorResponse(error.message));
  }
};

menuController.addMenu = async (req, res) => {
  try {
    const insertId = await menuModel.addMenu(req.body);
    res.status(200).json(response.successResponse(insertId, "OK"));
  } catch (error) {
    res.status(200).json(response.errorResponse(error.message));
  }
};

menuController.updateMenu = async (req, res) => {
  try {
    const insertId = await menuModel.updateMenuById(req.body);
    res.status(200).json(response.successResponse(insertId, "OK"));
  } catch (error) {
    res.status(200).json(response.errorResponse(error.message));
  }
};

module.exports = menuController;
