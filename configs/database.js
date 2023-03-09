const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createPool({
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
});

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
//   // host: "localhost",
//   // port: "3306",
//   // user: "nhcrik91_admin",
//   // password: "sonnguyen995",
//   // database: "nhcrik91_dienmaytoancau",
// });


// connection.connect((err) => {
//   if (err) {
//     console.log('Database connection failed: ', err);
//   } else {
//     console.log('Database connected successfully');
//   }
// });

module.exports = connection;
