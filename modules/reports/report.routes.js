const express = require('express');
const reportController = require('./report.controller');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/reports/fleet
 * @desc    Generate fleet report
 * @access  Private
 */
router.get('/fleet', authMiddleware, reportController.generateFleetReport);

/**
 * @route   GET /api/reports/revenue
 * @desc    Generate revenue report
 * @access  Private
 */
router.get('/revenue', authMiddleware, reportController.generateRevenueReport);

/**
 * @route   GET /api/reports/service
 * @desc    Generate service report
 * @access  Private
 */
router.get('/service', authMiddleware, reportController.generateServiceReport);

/**
 * @route   GET /api/reports
 * @desc    Get all reports
 * @access  Private
 */
router.get('/', authMiddleware, reportController.getAllReports);

/**
 * @route   GET /api/reports/:reportId
 * @desc    Get report details
 * @access  Private
 */
router.get('/:reportId', authMiddleware, reportController.getReportDetails);

/**
 * @route   PUT /api/reports/:reportId/status
 * @desc    Update report status
 * @access  Private
 */
router.put('/:reportId/status', authMiddleware, reportController.updateReportStatus);

module.exports = router;
