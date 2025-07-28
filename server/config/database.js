require('dotenv').config();
const mysql = require('mysql2/promise'); 
const fs = require('fs');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
   
    ca: fs.readFileSync('./ca.pem')
  }
});


pool.getConnection()
  .then((connection) => {
    // (" Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error(" Database connection failed:", err);
  });

module.exports = pool; 