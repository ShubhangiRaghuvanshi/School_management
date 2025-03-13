const mysql = require('mysql2');
require('dotenv').config();

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { 
    rejectUnauthorized: false  // Fix self-signed certificate issue
  }
});

// Function to add a school
exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Log the incoming request body
  console.log("Request body for adding school:", req.body);

  // Validation check
  if (!name || !address || !latitude || !longitude) {
    console.log("Missing fields in the request body");
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert school into the database
    const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    const values = [name, address, latitude, longitude];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('❌ Error occurred while adding school:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Log the success and return the response
      console.log('✅ School added successfully with ID:', result.insertId);
      res.status(200).json({ message: 'School added successfully', id: result.insertId });
    });

  } catch (err) {
    console.error('❌ Error occurred while adding school:', err);
    return res.status(500).json({ error: 'Database error' });
  }
};

// Function to list all schools
exports.listSchools = async (req, res) => {
  const { userLatitude, userLongitude } = req.query;

  // Log the query parameters
  console.log("User location received:", { userLatitude, userLongitude });

  // Input validation
  if (!userLatitude || !userLongitude) {
    console.log("Missing latitude or longitude in query");
    return res.status(400).json({ error: 'User latitude and longitude are required' });
  }

  try {
    // Get all schools from the database
    const sql = 'SELECT * FROM schools';

    connection.query(sql, (err, results) => {
      if (err) {
        console.error("❌ Error occurred while fetching schools:", err);
        return res.status(500).json({ error: 'Database error' });
      }

      // Log the fetched schools
      console.log("✅ Fetched schools from the database:", results);

      // Calculate the distance for each school
      const schoolsWithDistance = results.map(school => {
        const distance = calculateDistance(
          userLatitude, userLongitude,
          school.latitude, school.longitude
        );
        school.distance = distance;
        return school;
      });

      // Sort schools by distance
      schoolsWithDistance.sort((a, b) => a.distance - b.distance);

      // Return sorted schools with distances
      console.log("✅ Sorted schools by distance:", schoolsWithDistance);
      res.status(200).json(schoolsWithDistance);
    });

  } catch (err) {
    console.error("❌ Error occurred while fetching schools:", err);
    return res.status(500).json({ error: 'Database error' });
  }
};

// Haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;  // Distance in km
}
