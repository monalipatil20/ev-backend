const express = require('express');
const showroomController = require('./showroom.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

const router = express.Router();

/**
 * @route   POST /api/showroom/add-vehicle
 * @desc    Add vehicle to showroom
 * @access  Private
 */
router.post(
  '/add-vehicle',
  authMiddleware,
  upload.array('images', 5),
  showroomController.addVehicle
);

/**
 * @route   GET /api/showroom/vehicles
 * @desc    Get all vehicles
 * @access  Public
 */
router.get('/vehicles', showroomController.getAllVehicles);

/**
 * @route   GET /api/showroom/vehicle/:vehicleId
 * @desc    Get vehicle details
 * @access  Public
 */
router.get('/vehicle/:vehicleId', showroomController.getVehicleDetails);

/**
 * @route   PUT /api/showroom/vehicle/:vehicleId
 * @desc    Update vehicle
 * @access  Private
 */
router.put('/vehicle/:vehicleId', authMiddleware, showroomController.updateVehicle);

/**
 * @route   DELETE /api/showroom/vehicle/:vehicleId
 * @desc    Delete vehicle
 * @access  Private
 */
router.delete('/vehicle/:vehicleId', authMiddleware, showroomController.deleteVehicle);

module.exports = router;
