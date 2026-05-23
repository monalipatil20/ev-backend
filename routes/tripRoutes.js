const express = require('express');
const tripController = require('../controllers/tripController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, tripController.getTrips);
router.get('/:id', protect, tripController.getTripById);
router.post('/', protect, authorizeRoles('admin', 'fleet_manager', 'user'), tripController.createTrip);
router.put('/:id', protect, authorizeRoles('admin', 'fleet_manager'), tripController.updateTrip);
router.put('/:id/complete', protect, authorizeRoles('admin', 'fleet_manager'), tripController.completeTrip);

module.exports = router;
