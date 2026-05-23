const Payment = require('./payment.model');

class PaymentService {
  // Generate Invoice Number
  generateInvoiceNumber() {
    return `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  // Create Payment
  async createPayment(userId, paymentData) {
    try {
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const invoiceNumber = this.generateInvoiceNumber();

      const payment = await Payment.create({
        userId,
        transactionId,
        invoiceNumber,
        ...paymentData,
      });

      return {
        success: true,
        message: 'Payment created successfully',
        data: {
          paymentId: payment._id,
          transactionId: payment.transactionId,
          invoiceNumber: payment.invoiceNumber,
          amount: payment.amount,
          status: payment.status,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Verify Payment
  async verifyPayment(transactionId, paymentData) {
    try {
      // In production, verify with payment gateway (Razorpay, Stripe, etc.)
      const payment = await Payment.findOne({ transactionId });

      if (!payment) {
        throw {
          status: 404,
          message: 'Payment not found',
          code: 'PAYMENT_NOT_FOUND',
        };
      }

      payment.status = paymentData.status || 'success';
      payment.receiptUrl = paymentData.receiptUrl;
      await payment.save();

      return {
        success: true,
        message: 'Payment verified successfully',
        data: payment,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Payment History
  async getPaymentHistory(userId) {
    try {
      const payments = await Payment.find({ userId }).sort({ createdAt: -1 });

      return {
        success: true,
        message: 'Payment history retrieved successfully',
        data: payments,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Payment Details
  async getPaymentDetails(paymentId) {
    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        throw {
          status: 404,
          message: 'Payment not found',
          code: 'PAYMENT_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Payment details retrieved successfully',
        data: payment,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Transactions Report (Admin)
  async getTransactionsReport(filters = {}) {
    try {
      const query = {};
      if (filters.startDate && filters.endDate) {
        query.createdAt = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate),
        };
      }
      if (filters.status) query.status = filters.status;
      if (filters.paymentType) query.paymentType = filters.paymentType;

      const payments = await Payment.find(query)
        .populate('userId', 'fullName email')
        .sort({ createdAt: -1 });

      const totalAmount = payments.reduce((sum, p) => (p.status === 'success' ? sum + p.amount : sum), 0);

      return {
        success: true,
        message: 'Transactions report retrieved successfully',
        data: {
          totalTransactions: payments.length,
          successfulTransactions: payments.filter(p => p.status === 'success').length,
          failedTransactions: payments.filter(p => p.status === 'failed').length,
          totalAmount,
          transactions: payments,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PaymentService();
