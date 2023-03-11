const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const fileConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
  // host: "localhost",
  // port: "3306",
  // user: "nhcrik91_admin",
  // password: "sonnguyen995",
  // database: "nhcrik91_dienmaytoancau",
}
const pool = mysql.createPool(fileConfig);

module.exports = { pool, fileConfig };
