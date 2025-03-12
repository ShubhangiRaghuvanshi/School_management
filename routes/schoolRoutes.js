const express = require('express');
const { addSchool, listSchools } = require('../controllers/schoolController');

const router = express.Router();

// Routes for adding a school and listing schools by proximity
router.post('/addSchool', addSchool);
router.get('/listSchools', listSchools);

module.exports = router;
