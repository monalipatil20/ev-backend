// Fleet routes for CRUD management of EV fleet vehicles.
const express = require('express');

const fleetController = require('../controllers/fleetController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', fleetController.getAllFleet);
router.get('/:id', fleetController.getFleetById);
router.post('/', protect, adminOnly, fleetController.createFleet);
router.put('/:id', protect, adminOnly, fleetController.updateFleet);
router.delete('/:id', protect, adminOnly, fleetController.deleteFleet);

module.exports = router;