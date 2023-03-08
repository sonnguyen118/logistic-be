const pool = require('../configs/database');
const transactionModel = require("../models/transactionModel");

const transactionController = {}

transactionController.createTransaction = async (req, res) => {
    const name = req.params.test;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const person1 = await connection.query('INSERT INTO person (name) VALUES (?)', [name]);
        const person = await connection.query('SELECT * FROM person WHERE name = ?', [name]);
        const student = await transactionModel.updateTransaction(2, name)
        await connection.commit();
        console.log('Transaction committed successfully.', student);
        res.json(person)
    } catch (error) {
        await connection.rollback();
        console.error('Transaction rolled back due to error:', error);
        res.json(error.message)

    } finally {
        connection.end();
    }
}
module.exports = transactionController;
