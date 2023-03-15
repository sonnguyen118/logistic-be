const { pool } = require('../configs/database');

const orderModel = {};

orderModel.createOrders = async (orders, connection) => {
    let query = 'INSERT INTO orders (order_code, status, created_date) VALUES ';
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        let values = `('${order.orderCode}' ,'${order.status}','${order.date}'),`
        query += values;
    }
    query = query.trim().slice(0, -1);
    query += `\n ON DUPLICATE KEY UPDATE status = VALUES(status), status = VALUES(status),  created_date = VALUES(created_date);`;
    try {
        const [rows, fields] = await connection.query(query)
        return rows.insertId
    } catch (err) {
        throw err
    }
}

orderModel.getAllOrder = async () => {
    const query = `SELECT o.id, o.order_code, o.created_date, s.id as status_id,s.status_name FROM orders o JOIN (SELECT * FROM status WHERE id != -1) s ON o.status = s.id ORDER BY o.id DESC;`;
    try {
        const [rows, fields] = await pool.query(query)
        return rows
    } catch (err) {
        throw err
    }

}

orderModel.updateOrder = async (id, status, transaction) => {
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    try {
        const result = await transaction.execute(query, [status, id])
        return result[0].affectedRows > 0;
    } catch (error) {
        throw err
    }
}

orderModel.findOrderById = async (id) => {
    const query = 'SELECT o.id, o.order_code, o.created_date, o.status as status_id, s.status_name FROM ((SELECT * FROM orders WHERE id = ?) as o JOIN status s ON o.status = s.id)';
    try {
        const [rows, fields] = await pool.execute(query, [id])
        return rows[0]
    } catch (err) {
        throw err
    }
}

orderModel.getAllOrderStatus = async () => {
    const query = 'SELECT * FROM status WHERE id != -1';
    try {
        const [rows, fields] = await pool.query(query)
        return rows
    } catch (err) {
        throw err
    }
}

// orderModel.findFlexible = async (orderCode, status) => {
//     let query = 'SELECT o.id, o.order_code, o.created_date, o.status as status_id, s.status_name FROM ( (SELECT id, order_code, status, created_date FROM orders WHERE 1=1 AND status != -1';
//     if (orderCode) {
//         query += ` AND order_code LIKE '${orderCode}%'`;
//     }
//     if (status) {
//         query += ' AND status = ' + status;
//     }
//     query += ') AS o  JOIN status s ON s.id = o.status) ORDER BY o.id DESC;'
//     try {
//         const [rows, fields] = await pool.query(query)
//         return rows
//     } catch (err) {
//         throw err
//     }
// }

orderModel.findFlexible = async (orderCode, status) => {
    const params = []
    let query = 'SELECT o.id, o.order_code, o.created_date, o.status as status_id, s.status_name FROM ( (SELECT id, order_code, status, created_date FROM orders WHERE 1=1 AND status != -1 ';
    if (orderCode) {
        query += ' AND order_code = ?';
        params.push(orderCode)
    }
    if (status) {
        query += ' AND status = ?';
        params.push(status)
    }
    query += ') AS o  JOIN status s ON s.id = o.status) ORDER BY o.id DESC;'
    try {
        const [rows, fields] = await pool.query(query, params)
        return rows
    } catch (err) {
        throw err
    }
}

orderModel.softDelete = async (id) => {
    const params = id.map(e => '?');
    const query = `UPDATE orders SET status = -1 WHERE id IN (${params})`;

    console.log(query)
    try {
        const [rows, fields] = await pool.execute(query, id)
        return rows
    } catch (err) {
        throw err
    }
}
module.exports = orderModel;