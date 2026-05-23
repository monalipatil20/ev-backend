// Fleet routes for CRUD management of EV fleet vehicles.
const express = require('express');

const fleetController = require('../controllers/fleetController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', fleetController.getAllFleet);
router.get('/:id', fleetController.getFleetById);
router.post('/', protect, authorizeRoles('admin', 'fleet_manager'), fleetController.createFleet);
router.put('/:id', protect, authorizeRoles('admin', 'fleet_manager'), fleetController.updateFleet);
router.delete('/:id', protect, authorizeRoles('admin', 'fleet_manager'), fleetController.deleteFleet);

module.exports = router;