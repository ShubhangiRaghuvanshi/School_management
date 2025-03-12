// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const schoolRoutes = require('./routes/schoolRoutes');
const db = require('./models/school');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Use school routes for handling school-related API requests
app.use('/api', schoolRoutes);



// Define port and start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
