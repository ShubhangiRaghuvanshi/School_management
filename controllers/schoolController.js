const schoolModel = require('../models/school');

exports.addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    
    // Log the incoming request body
    console.log("Request body for adding school:", req.body);

    // Validation check
    if (!name || !address || !latitude || !longitude) {
        console.log("Missing fields in the request body");
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Call the model function to add school
    schoolModel.addSchool(name, address, latitude, longitude, (err, schoolId) => {
        if (err) {
            console.error("Error occurred while adding school:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        console.log("School added successfully with ID:", schoolId);
        res.status(200).json({ message: 'School added successfully', id: schoolId });
    });
};

exports.listSchools = (req, res) => {
    const { userLatitude, userLongitude } = req.query;

    // Log the query parameters
    console.log("User location received:", { userLatitude, userLongitude });

    // Input validation
    if (!userLatitude || !userLongitude) {
        console.log("Missing latitude or longitude in query");
        return res.status(400).json({ error: 'User latitude and longitude are required' });
    }

    // Call the model function to get all schools
    schoolModel.getAllSchools((err, schools) => {
        if (err) {
            console.error("Error occurred while fetching schools:", err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Log the fetched schools
        console.log("Fetched schools from the database:", schools);

        // Calculate the distance for each school
        const schoolsWithDistance = schools.map(school => {
            const distance = calculateDistance(
                userLatitude, userLongitude,
                school.latitude, school.longitude
            );
            school.distance = distance;
            return school;
        });

        // Log the schools with calculated distances
        console.log("Schools with calculated distances:", schoolsWithDistance);

        // Sort the schools by distance (ascending)
        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        // Log the sorted list of schools
        console.log("Sorted schools by distance:", schoolsWithDistance);

        res.status(200).json(schoolsWithDistance);
    });
};

// Haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}
