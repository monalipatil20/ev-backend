const paymentService = require('./payment.service');

class PaymentController {
  // Create Payment
  async createPayment(req, res, next) {
    try {
      const userId = req.user.userId;
      const { amount, paymentMethod, paymentType, referenceId, orderDetails } = req.body;

      if (!amount || !paymentMethod || !paymentType) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields',
          code: 'MISSING_FIELDS',
        });
      }

      const paymentData = {
        amount,
        paymentMethod,
        paymentType,
        referenceId,
        orderDetails,
      };

      const result = await paymentService.createPayment(userId, paymentData);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Verify Payment
  async verifyPayment(req, res, next) {
    try {
      const { transactionId } = req.params;
      const { status, receiptUrl } = req.body;

      if (!transactionId) {
        return res.status(400).json({
          success: false,
          message: 'Transaction ID is required',
          code: 'MISSING_FIELDS',
        });
      }

      const result = await paymentService.verifyPayment(transactionId, {
        status,
        receiptUrl,
      });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get Payment History
  async getPaymentHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await paymentService.getPaymentHistory(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get Payment Details
  async getPaymentDetails(req, res, next) {
    try {
      const { paymentId } = req.params;
      const result = await paymentService.getPaymentDetails(paymentId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get Transactions Report (Admin)
  async getTransactionsReport(req, res, next) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        status: req.query.status,
        paymentType: req.query.paymentType,
      };

      const result = await paymentService.getTransactionsReport(filters);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
