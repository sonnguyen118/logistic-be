const userModel = require("../models/userModel");
const response = require("../utils/response");

const userController = {};

userController.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(200).json({ message: "Something went wrong" });
  }
};

userController.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // res.json(user);
    res.status(200).json(response.successResponse(user, "success"));
  } catch (err) {
    res.status(200).json({ message: "Something went wrong" });
  }
};

userController.updateUserInfo = async (req, res) => {
  try {
    const user = await userModel.updateUserInfo(req.body);
    res.status(200).json(response.successResponse(user, "success"));
  } catch (err) {
    res.status(200).json(response.errorResponse(err.message));
  }
};

module.exports = userController;
