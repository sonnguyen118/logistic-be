const pool = require('../configs/database');

const transactionModel = {};

transactionModel.updateTransaction = async (id, name) => {
    const query = 'UPDATE student SET name = ? WHERE id = ?';
    const student = await pool.query(query, [name, id]);
    return student;
}

module.exports = transactionModel;
