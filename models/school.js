const db=require("../config/db");
const addSchool = (name, address, latitude, longitude, callback) => {
    const query = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;
    
    db.query(query, [name, address, latitude, longitude], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results.insertId);
    });
  };
  const getAllSchools = (callback) => {
    const query = `SELECT * FROM schools`;
  
    db.query(query, (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  };
  
  // Exporting functions to be used in controllers
  module.exports = {
    addSchool,
    getAllSchools,
  };