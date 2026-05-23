const express = require('express');
const driverController = require('../controllers/driverController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, driverController.getDrivers);
router.get('/:id', protect, driverController.getDriverById);
router.post('/', protect, authorizeRoles('admin', 'fleet_manager'), driverController.createDriver);
router.put('/:id', protect, authorizeRoles('admin', 'fleet_manager'), driverController.updateDriver);
router.put('/:id/assign', protect, authorizeRoles('admin', 'fleet_manager'), driverController.assignDriverToVehicle);
router.put('/:id/kyc', protect, authorizeRoles('admin', 'fleet_manager'), driverController.completeDriverKyc);
router.delete('/:id', protect, authorizeRoles('admin', 'fleet_manager'), driverController.deleteDriver);

module.exports = router;
