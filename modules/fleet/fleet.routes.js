const express = require('express');
const fleetController = require('./fleet.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

const router = express.Router();

/**
 * @route   POST /api/fleet/register
 * @desc    Register a new fleet
 * @access  Private
 */
router.post(
  '/register',
  authMiddleware,
  upload.fields([
    { name: 'registrationDoc', maxCount: 1 },
    { name: 'gstDoc', maxCount: 1 },
  ]),
  fleetController.registerFleet
);

/**
 * @route   GET /api/fleet/details
 * @desc    Get fleet details
 * @access  Private
 */
router.get('/details', authMiddleware, fleetController.getFleetDetails);

/**
 * @route   GET /api/fleet
 * @desc    Get all fleets (Admin)
 * @access  Private
 */
router.get('/', authMiddleware, fleetController.getAllFleets);

/**
 * @route   PUT /api/fleet/update
 * @desc    Update fleet
 * @access  Private
 */
router.put('/update', authMiddleware, fleetController.updateFleet);

/**
 * @route   PUT /api/fleet/verify/:fleetId
 * @desc    Verify fleet (Admin)
 * @access  Private
 */
router.put('/verify/:fleetId', authMiddleware, fleetController.verifyFleet);

module.exports = router;
