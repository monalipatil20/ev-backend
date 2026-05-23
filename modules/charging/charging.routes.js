const express = require('express');
const chargingController = require('./charging.controller');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/charging/add-station
 * @desc    Add charging station
 * @access  Private
 */
router.post('/add-station', authMiddleware, chargingController.addChargingStation);

/**
 * @route   GET /api/charging/stations
 * @desc    Get all charging stations
 * @access  Public
 */
router.get('/stations', chargingController.getAllStations);

/**
 * @route   GET /api/charging/station/:stationId
 * @desc    Get charging station details
 * @access  Public
 */
router.get('/station/:stationId', chargingController.getStationDetails);

/**
 * @route   POST /api/charging/book-slot
 * @desc    Book charging slot
 * @access  Private
 */
router.post('/book-slot', authMiddleware, chargingController.bookChargingSlot);

/**
 * @route   PUT /api/charging/station/:stationId
 * @desc    Update charging station
 * @access  Private
 */
router.put('/station/:stationId', authMiddleware, chargingController.updateStation);

module.exports = router;
