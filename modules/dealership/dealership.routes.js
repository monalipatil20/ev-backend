const express = require('express');
const dealershipController = require('./dealership.controller');
const { protect, adminOnly } = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/dealership/apply
 * @desc    Apply for dealership/franchise
 * @access  Private
 */
router.post('/apply', protect, dealershipController.applyForDealership);

/**
 * @route   GET /api/dealership/details
 * @desc    Get dealership details
 * @access  Private
 */
router.get('/details', protect, dealershipController.getDealershipDetails);

/**
 * @route   GET /api/dealership/dashboard
 * @desc    Get dealership dashboard
 * @access  Private
 */
router.get('/dashboard', protect, dealershipController.getDashboard);

/**
 * @route   PUT /api/dealership/update
 * @desc    Update dealership
 * @access  Private
 */
router.put('/update', protect, dealershipController.updateDealership);

/**
 * @route   GET /api/dealership
 * @desc    Get all dealerships (Admin)
 * @access  Private
 */
router.get('/', protect, adminOnly, dealershipController.getAllDealerships);

module.exports = router;
