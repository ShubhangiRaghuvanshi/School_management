const db = require("../config/db");

const addSchool = (name, address, latitude, longitude) => {
  const query = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;

  // Use promise to handle the insert operation
  return db.query(query, [name, address, latitude, longitude])
    .then(([results]) => results.insertId)  // Return the inserted ID
    .catch(err => {
      throw err;
    });
};

const getAllSchools = () => {
  const query = `SELECT * FROM schools`;

  return db.query(query)  // Returns a promise
    .then(([results]) => results)
    .catch(err => {
      throw err;
    });
};

module.exports = {
  addSchool,
  getAllSchools,
};
