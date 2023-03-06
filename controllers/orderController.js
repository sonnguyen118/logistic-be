const orderModel = require('../models/orderModel');
const response = require('../utils/response');

const xlsx = require('xlsx');

orderController = {}

function convertStatusStringToValue(statusString) {
    switch (statusString.toLowerCase()) {
        case 'đã nhập kho trung quốc':
            return 1;
        case 'đang về kho việt nam':
            return 2;
        case 'đã nhập kho việt nam':
            return 3;
        case 'đã trả khách':
            return 4;
        default: 0
    }
}
function readOrdersDataFromFileExcel(req, res) {
    const buffer = req.file.buffer;
    const workbook = xlsx.read(buffer, { type: 'buffer', cellDates: true });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const title = data[0];

    if (title[0] !== 'NGÀY' || title[1] !== 'MÃ VẬN ĐƠN' || title[2] !== 'TRẠNG THÁI') {
        throw new Error('dữ liệu file không đúng thứ tự NGÀY - MÃ VẬN ĐƠN - TRẠNG THÁI')
    }
    let rows = []
    let orderCodes = []
    for (i = 1; i < data.length; i++) {
        const row = data[i];
        let orderCode = row[1];
        if (!orderCode) {
            break;
        }
        let status = convertStatusStringToValue(row[2]);
        if (status === 0) {
            continue
        }
        //+ thêm 8 giờ
        let originalDate = new Date(row[0]);
        let inreaseOriginalDate = new Date(originalDate.getTime() + 8 * 60 * 60 * 1000);
        const date = inreaseOriginalDate.toISOString().substring(0, 19).replaceAll('T', ' ');
        rows.push({ date, orderCode, status })
        orderCodes.push(orderCode)
    }
    return rows;
}

orderController.uploadOrdersFromExcelFile = async (req, res) => {
    try {
        const rows = readOrdersDataFromFileExcel(req, res)
        const orders = await orderModel.createOrders(rows);
        res.status(200).json(response.successResponse(orders, "success"));
    } catch (err) {
        res.status(500).json(response.errorResponse(err.message));
    }

}

orderController.getAll = async (req, res) => {
    try {
        const orders = await orderModel.getAllOrder();
        res.status(200).json(response.successResponse(orders, "success"));
    } catch (err) {
        res.status(500).json(response.errorResponse('Something went wrong'));
    }
}

orderController.updateOrder = async (req, res) => {
    try {
        const orders = await orderModel.updateOrder(req, res);
        res.status(200).json(response.successResponse(null, "success"));
    } catch (err) {
        res.status(500).json(response.errorResponse('Something went wrong'));
    }
}

orderController.findOrderByOrderCode = async (req, res) => {
    try {
        const order = await orderModel.findOrderByOrderCode(req.params.orderCode);
        res.status(200).json(response.successResponse(order, "success"));
    } catch (err) {
        res.status(500).json(response.errorResponse('Something went wrong'));
    }
}


module.exports = orderController;
