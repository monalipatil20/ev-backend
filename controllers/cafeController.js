// Cafe controller for managing cafe orders.
const mongoose = require('mongoose');
const CafeOrder = require('../models/CafeOrder');
const ApiError = require('../utils/ApiError');

const createOrder = async (req, res, next) => {
  try {
    const { customerName, items, amount, paymentStatus, orderStatus } = req.body;

    if (!customerName || !items || amount === undefined) {
      throw new ApiError(400, 'customerName, items, and amount are required', 'MISSING_FIELDS');
    }

    const order = await CafeOrder.create({
      customerName,
      items,
      amount,
      paymentStatus,
      orderStatus,
    });

    return res.status(201).json({
      success: true,
      message: 'Cafe order created successfully',
      data: order,
    });
  } catch (error) {
    return next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await CafeOrder.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Cafe orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid order ID', 'INVALID_ID');
    }

    const updates = {};
    ['customerName', 'items', 'amount', 'paymentStatus', 'orderStatus'].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const order = await CafeOrder.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      throw new ApiError(404, 'Cafe order not found', 'ORDER_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Cafe order updated successfully',
      data: order,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid order ID', 'INVALID_ID');
    }

    const order = await CafeOrder.findByIdAndDelete(id);

    if (!order) {
      throw new ApiError(404, 'Cafe order not found', 'ORDER_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Cafe order deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
};