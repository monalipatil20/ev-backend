const express = require('express');
const paymentController = require('./payment.controller');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/payments/create
 * @desc    Create a payment
 * @access  Private
 */
router.post('/create', authMiddleware, paymentController.createPayment);

/**
 * @route   POST /api/payments/verify/:transactionId
 * @desc    Verify payment
 * @access  Private
 */
router.post('/verify/:transactionId', authMiddleware, paymentController.verifyPayment);

/**
 * @route   GET /api/payments/history
 * @desc    Get payment history
 * @access  Private
 */
router.get('/history', authMiddleware, paymentController.getPaymentHistory);

/**
 * @route   GET /api/payments/:paymentId
 * @desc    Get payment details
 * @access  Private
 */
router.get('/:paymentId', authMiddleware, paymentController.getPaymentDetails);

/**
 * @route   GET /api/payments/report
 * @desc    Get transactions report (Admin)
 * @access  Private
 */
router.get('/report/transactions', authMiddleware, paymentController.getTransactionsReport);

module.exports = router;
