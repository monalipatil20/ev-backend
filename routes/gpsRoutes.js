// GPS routes for location updates and live vehicle tracking endpoints.
const express = require('express');

const gpsController = require('../controllers/gpsController');

const router = express.Router();

router.post('/update-location', gpsController.updateLocation);
router.get('/live-location/:vehicleId', gpsController.getLiveLocation);
router.get('/all-vehicles', gpsController.getAllVehiclesLiveLocations);

module.exports = router;
