const db = require('../configs/database');
const response = require('../utils/response');

const orderModel = {};

orderModel.createOrders = (orders) => {
    let query = 'INSERT INTO orders (order_code, status, created_date) VALUES ';
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        let values = `('${order.orderCode}' ,'${order.status}','${order.date}'),`
        query += values;
    }
    query = query.trim().slice(0, -1);
    query += `\n ON DUPLICATE KEY UPDATE status = VALUES(status), status = VALUES(status),  created_date = VALUES(created_date);`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

orderModel.getAllOrder = () => {
    const query = 'SELECT * FROM orders';
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

orderModel.updateOrder = (req, res) => {
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    const id = req.body.id;
    const status = req.body.status;
    return new Promise((resolve, reject) => {
        db.query(query, [status, id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                console.log(query);
                resolve(results);
            }
        });
    });
}

orderModel.findOrderByOrderCode = (orderCode) => {
    const query = 'SELECT * FROM orders WHERE order_code = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [orderCode], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}
module.exports = orderModel;