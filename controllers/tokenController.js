const TokenTransaction = require('../models/TokenTransaction');

const getTokenTransactions = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user?._id;
    const filter = userId ? { userId } : {};

    const transactions = await TokenTransaction.find(filter).sort({ createdAt: -1 });
    const balance = transactions.reduce((acc, item) => {
      return item.type === 'credit' ? acc + item.tokens : acc - item.tokens;
    }, 0);

    return res.status(200).json({
      success: true,
      message: 'Token transactions fetched successfully',
      data: {
        balance,
        transactions,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const createTokenTransaction = async (req, res, next) => {
  try {
    const payload = {
      userId: req.body.userId || req.user?._id,
      type: req.body.type,
      tokens: req.body.tokens,
      reason: req.body.reason,
      module: req.body.module,
      referenceId: req.body.referenceId,
    };

    const transaction = await TokenTransaction.create(payload);
    return res.status(201).json({ success: true, message: 'Token transaction saved successfully', data: transaction });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getTokenTransactions,
  createTokenTransaction,
};
