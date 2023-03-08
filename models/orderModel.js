const db = require('../configs/database');

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
    const query = 'SELECT *, DATE_FORMAT(created_date, \'%Y-%m-%d\') AS created_date_formatted FROM orders';
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

orderModel.updateOrder = (id, status) => {
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
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

orderModel.findOrderById = (id) => {
    const query = 'SELECT * FROM orders WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

orderModel.getAllOrderStatus = () => {
    const query = 'SELECT * FROM status';
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

module.exports = orderModel;