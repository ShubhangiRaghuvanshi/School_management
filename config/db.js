const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,  // Ensure this matches your DB configuration
  connectionLimit: 10  // Pool with a limit of 10 connections
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error getting connection:', err.stack);
    return;
  }
  console.log('Connected to the database');
  connection.release();  // Release the connection back to the pool
});

module.exports = pool.promise();  // Use promises for ease of use with async/await


  