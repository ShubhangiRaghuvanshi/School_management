const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',  // Local machine
    user: 'root',       // Default MySQL username
    password: 'Pizzabuls@260795',       // Default password for root (empty if none set)
    database: 'school_management'  // The name of your MySQL database
  });
  db.connect((err) => {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to the database');
  });
  
  module.exports = db;
  