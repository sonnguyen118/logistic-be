const orderModel = require("../models/orderModel");
const response = require("../utils/response");
const orderServices = require("../services/orderServices");
const { fileConfig } = require('../configs/database');
const mysql = require('mysql2/promise');
const log = require("../utils/log");
const pool = mysql.createPool(fileConfig)

const orderController = {};

orderController.uploadOrdersFromExcelFile = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const rows = orderServices.readOrdersDataFromFileExcel(req, res);
    const orders = await orderModel.createOrders(rows, connection);
    await connection.commit()
    res.status(200).json(response.successResponse(orders, "success"));
  } catch (err) {
    log.writeErrorLog(err.message)
    await connection.rollback()
    res.status(200).json(response.errorResponse(err.message));
  } finally {
    connection.release();
  }
};

orderController.getAllOrder = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrder();
    res.status(200).json(response.successResponse(orders, "success"));
  } catch (err) {
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  }
};

orderController.updateOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const id = req.body.id;
    const status = req.body.status;
    await orderModel.updateOrder(id, status, connection);
    await connection.commit();
    res.status(200).json(response.successResponse(null, "success"));
  } catch (err) {
    await connection.rollback();
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  } finally {
    connection.release();
  }
};

orderController.findOrderById = async (req, res) => {
  try {
    const order = await orderModel.findOrderById(req.params.id);
    res.status(200).json(response.successResponse(order, "success"));
  } catch (err) {
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  }
};

orderController.getAllOrderStatus = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrderStatus();
    res.status(200).json(response.successResponse(orders, "success"));
  } catch (err) {
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  }
};

orderController.filterOrder = async (req, res) => {
  const { orderCode, status } = req.body
  try {
    const order = await orderModel.findFlexible(orderCode, status);
    res.status(200).json(response.successResponse(order, "success"));
  } catch (err) {
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  }
};
orderController.softDelete = async (req, res) => {
  try {
    const id = req.body.id
    if (!Array.isArray(id) || id.length == 0) {
      throw new Error("params is invalid")
    }
    const order = await orderModel.softDelete(id);
    res.status(200).json(response.successResponse(order, "success"));
  } catch (err) {
    log.writeErrorLog(err.message)
    res.status(200).json(response.errorResponse(err.message));
  }
};

module.exports = orderController;
