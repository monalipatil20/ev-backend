// Fleet controller for CRUD operations on fleet vehicles.
const mongoose = require('mongoose');
const Fleet = require('../models/Fleet');
const ApiError = require('../utils/ApiError');

const createFleet = async (req, res, next) => {
  try {
    const { vehicleName, vehicleNumber, batteryStatus, location, driverName, status } = req.body;

    if (!vehicleName || !vehicleNumber || batteryStatus === undefined || !location || !driverName) {
      throw new ApiError(
        400,
        'vehicleName, vehicleNumber, batteryStatus, location, and driverName are required',
        'MISSING_FIELDS'
      );
    }

    const fleetVehicle = await Fleet.create({
      vehicleName,
      vehicleNumber,
      batteryStatus,
      location,
      driverName,
      status,
    });

    return res.status(201).json({
      success: true,
      message: 'Fleet vehicle created successfully',
      data: fleetVehicle,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllFleet = async (req, res, next) => {
  try {
    const fleet = await Fleet.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Fleet vehicles fetched successfully',
      data: fleet,
    });
  } catch (error) {
    return next(error);
  }
};

const getFleetById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid fleet ID', 'INVALID_ID');
    }

    const fleetVehicle = await Fleet.findById(id);

    if (!fleetVehicle) {
      throw new ApiError(404, 'Fleet vehicle not found', 'FLEET_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Fleet vehicle fetched successfully',
      data: fleetVehicle,
    });
  } catch (error) {
    return next(error);
  }
};

const updateFleet = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid fleet ID', 'INVALID_ID');
    }

    const updates = {};
    ['vehicleName', 'vehicleNumber', 'batteryStatus', 'location', 'driverName', 'status'].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const fleetVehicle = await Fleet.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!fleetVehicle) {
      throw new ApiError(404, 'Fleet vehicle not found', 'FLEET_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Fleet vehicle updated successfully',
      data: fleetVehicle,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteFleet = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid fleet ID', 'INVALID_ID');
    }

    const fleetVehicle = await Fleet.findByIdAndDelete(id);

    if (!fleetVehicle) {
      throw new ApiError(404, 'Fleet vehicle not found', 'FLEET_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Fleet vehicle deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createFleet,
  getAllFleet,
  getFleetById,
  updateFleet,
  deleteFleet,
};