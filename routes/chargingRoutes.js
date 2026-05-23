// Charging station routes for CRUD and booking APIs.
const express = require('express');

const chargingController = require('../controllers/chargingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', chargingController.getAllStations);
router.get('/nearby', chargingController.getNearbyStations);
router.get('/bookings', protect, chargingController.getBookings);
router.get('/:id', chargingController.getStationById);
router.post('/', protect, adminOnly, chargingController.createStation);
router.put('/:id', protect, adminOnly, chargingController.updateStation);
router.delete('/:id', protect, adminOnly, chargingController.deleteStation);
router.post('/book-slot', protect, chargingController.bookSlot);

module.exports = router;