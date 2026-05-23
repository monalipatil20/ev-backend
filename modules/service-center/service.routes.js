const express = require('express');
const serviceCenterController = require('./service.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');

const router = express.Router();

/**
 * @route   POST /api/service/book
 * @desc    Book a service
 * @access  Private
 */
router.post('/book', authMiddleware, serviceCenterController.bookService);

/**
 * @route   GET /api/service/history
 * @desc    Get service history
 * @access  Private
 */
router.get('/history', authMiddleware, serviceCenterController.getServiceHistory);

/**
 * @route   GET /api/service/:serviceId
 * @desc    Get service details
 * @access  Private
 */
router.get('/:serviceId', authMiddleware, serviceCenterController.getServiceDetails);

/**
 * @route   PUT /api/service/:serviceId/status
 * @desc    Update service status
 * @access  Private
 */
router.put('/:serviceId/status', authMiddleware, serviceCenterController.updateServiceStatus);

/**
 * @route   PUT /api/service/:serviceId/complete
 * @desc    Complete service
 * @access  Private
 */
router.put(
  '/:serviceId/complete',
  authMiddleware,
  upload.single('invoiceDoc'),
  serviceCenterController.completeService
);

/**
 * @route   GET /api/service
 * @desc    Get all services (Admin/Service Center)
 * @access  Private
 */
router.get('/', authMiddleware, serviceCenterController.getAllServices);

module.exports = router;
