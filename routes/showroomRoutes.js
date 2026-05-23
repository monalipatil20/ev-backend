// Showroom routes for managing vehicles and test-drive bookings.
const express = require('express');

const showroomController = require('../controllers/showroomController');

const router = express.Router();

router.get('/', showroomController.getVehicles);
router.post('/book-test-drive', showroomController.bookTestDrive);
router.get('/bookings', showroomController.getTestDriveBookings);
router.get('/:id', showroomController.getVehicleById);
router.post('/', showroomController.createVehicle);
router.put('/:id', showroomController.updateVehicle);
router.delete('/:id', showroomController.deleteVehicle);

module.exports = router;