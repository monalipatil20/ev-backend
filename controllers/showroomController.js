// Showroom controller for vehicle inventory and test-drive booking.
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const TestDriveBooking = require('../models/TestDriveBooking');
const ApiError = require('../utils/ApiError');

const createVehicle = async (req, res, next) => {
  try {
    const { vehicleName, model, price, batteryRange, stock, image } = req.body;

    if (!vehicleName || !model || price === undefined || batteryRange === undefined || stock === undefined || !image) {
      throw new ApiError(
        400,
        'vehicleName, model, price, batteryRange, stock, and image are required',
        'MISSING_FIELDS'
      );
    }

    const vehicle = await Vehicle.create({
      vehicleName,
      model,
      price,
      batteryRange,
      stock,
      image,
    });

    return res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: vehicle,
    });
  } catch (error) {
    return next(error);
  }
};

const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Vehicles fetched successfully',
      data: vehicles,
    });
  } catch (error) {
    return next(error);
  }
};

const getTestDriveBookings = async (req, res, next) => {
  try {
    const bookings = await TestDriveBooking.find().populate('vehicle', 'vehicleName model price batteryRange image').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Test drive bookings fetched successfully',
      data: bookings,
    });
  } catch (error) {
    return next(error);
  }
};

const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid vehicle ID', 'INVALID_ID');
    }

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found', 'VEHICLE_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Vehicle fetched successfully',
      data: vehicle,
    });
  } catch (error) {
    return next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid vehicle ID', 'INVALID_ID');
    }

    const updates = {};
    ['vehicleName', 'model', 'price', 'batteryRange', 'stock', 'image'].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const vehicle = await Vehicle.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found', 'VEHICLE_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid vehicle ID', 'INVALID_ID');
    }

    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found', 'VEHICLE_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const bookTestDrive = async (req, res, next) => {
  try {
    const { vehicleId, customerName, phone, preferredDate, notes, status } = req.body;

    if (!vehicleId || !customerName || !phone || !preferredDate) {
      throw new ApiError(400, 'vehicleId, customerName, phone, and preferredDate are required', 'MISSING_FIELDS');
    }

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      throw new ApiError(400, 'Invalid vehicle ID', 'INVALID_ID');
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found', 'VEHICLE_NOT_FOUND');
    }

    const booking = await TestDriveBooking.create({
      vehicle: vehicle._id,
      customerName,
      phone,
      preferredDate,
      notes,
      status,
    });

    return res.status(201).json({
      success: true,
      message: 'Test drive booked successfully',
      data: booking,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getTestDriveBookings,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  bookTestDrive,
};