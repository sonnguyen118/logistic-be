const orderModel = require("../models/orderModel");
const response = require("../utils/response");
const orderServices = require("../services/orderServices");

const orderController = {};

orderController.uploadOrdersFromExcelFile = async (req, res) => {
  try {
    const rows = orderServices.readOrdersDataFromFileExcel(req, res);
    const orders = await orderModel.createOrders(rows);
    res.status(200).json(response.successResponse(orders, "success"));
  } catch (err) {
    res.status(500).json(response.errorResponse(err.message));
  }
};

orderController.getAllOrder = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrder();
    res.status(200).json(response.successResponse(orders, "success"));
  } catch (err) {
    res.status(500).json(response.errorResponse("Something went wrong"));
  }
};

orderController.updateOrder = async (req, res) => {
  try {
    const id = req.body.id;
    const status = req.body.status;
    const orders = await orderModel.updateOrder(id, status);
    res.status(200).json(response.successResponse(null, "success"));
  } catch (err) {
    res.status(500).json(response.errorResponse("Something went wrong"));
  }
};

orderController.findOrderById = async (req, res) => {
  try {
    const order = await orderModel.findOrderById(req.params.id);
    res.status(200).json(response.successResponse(order, "success"));
  } catch (err) {
    res.status(500).json(response.errorResponse("Something went wrong"));
  }
};

orderController.getAllOrderStatus = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrderStatus();
    res.status(200).json(response.successResponse(orders, "success"));
  } catch (err) {
    res.status(500).json(response.errorResponse("Something went wrong"));
  }
};

module.exports = orderController;
