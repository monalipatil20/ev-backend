const mongoose = require('mongoose');
const Driver = require('../models/Driver');
const Fleet = require('../models/Fleet');
const ApiError = require('../utils/ApiError');

const createDriver = async (req, res, next) => {
  try {
    const payload = req.body;

    const driver = await Driver.create({
      vehicleId: payload.vehicleId || null,
      driverName: payload.driverName,
      mobileNumber: payload.mobileNumber,
      aadhaar: payload.aadhaar,
      license: payload.license,
      bankDetails: payload.bankDetails,
      emergencyContact: payload.emergencyContact,
      shift: payload.shift,
      shiftDuration: payload.shiftDuration,
      kycStatus: payload.kycStatus,
      verificationStatus: payload.verificationStatus,
      kycDocuments: payload.kycDocuments,
    });

    if (driver.vehicleId) {
      await Fleet.findByIdAndUpdate(driver.vehicleId, {
        $addToSet: { driverIds: driver._id },
      });
    }

    return res.status(201).json({ success: true, message: 'Driver created successfully', data: driver });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError(409, 'Duplicate Aadhaar or license', 'DUPLICATE_DRIVER_KYC'));
    }
    return next(error);
  }
};

const getDrivers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.vehicleId) {
      filter.vehicleId = req.query.vehicleId;
    }

    const drivers = await Driver.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: 'Drivers fetched successfully', data: drivers });
  } catch (error) {
    return next(error);
  }
};

const getDriverById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid driver ID', 'INVALID_ID');
    }

    const driver = await Driver.findById(id);
    if (!driver) {
      throw new ApiError(404, 'Driver not found', 'DRIVER_NOT_FOUND');
    }

    return res.status(200).json({ success: true, message: 'Driver fetched successfully', data: driver });
  } catch (error) {
    return next(error);
  }
};

const updateDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid driver ID', 'INVALID_ID');
    }

    const driver = await Driver.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!driver) {
      throw new ApiError(404, 'Driver not found', 'DRIVER_NOT_FOUND');
    }

    return res.status(200).json({ success: true, message: 'Driver updated successfully', data: driver });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError(409, 'Duplicate Aadhaar or license', 'DUPLICATE_DRIVER_KYC'));
    }
    return next(error);
  }
};

const assignDriverToVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { vehicleId, shift, shiftDuration } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(vehicleId)) {
      throw new ApiError(400, 'Invalid driver or vehicle ID', 'INVALID_ID');
    }

    const driver = await Driver.findByIdAndUpdate(
      id,
      {
        vehicleId,
        shift,
        shiftDuration,
      },
      { new: true, runValidators: true }
    );

    if (!driver) {
      throw new ApiError(404, 'Driver not found', 'DRIVER_NOT_FOUND');
    }

    await Fleet.findByIdAndUpdate(vehicleId, {
      $addToSet: { driverIds: driver._id },
      $set: {
        driverName: driver.driverName,
      },
    });

    return res.status(200).json({ success: true, message: 'Driver assigned successfully', data: driver });
  } catch (error) {
    return next(error);
  }
};

const completeDriverKyc = async (req, res, next) => {
  try {
    const { id } = req.params;

    const driver = await Driver.findByIdAndUpdate(
      id,
      {
        kycDocuments: req.body.kycDocuments || {},
        kycStatus: 'verified',
        verificationStatus: 'verified',
      },
      { new: true, runValidators: true }
    );

    if (!driver) {
      throw new ApiError(404, 'Driver not found', 'DRIVER_NOT_FOUND');
    }

    return res.status(200).json({ success: true, message: 'Driver KYC updated successfully', data: driver });
  } catch (error) {
    return next(error);
  }
};

const deleteDriver = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid driver ID', 'INVALID_ID');
    }

    const driver = await Driver.findByIdAndDelete(id);
    if (!driver) {
      throw new ApiError(404, 'Driver not found', 'DRIVER_NOT_FOUND');
    }

    if (driver.vehicleId) {
      await Fleet.findByIdAndUpdate(driver.vehicleId, {
        $pull: { driverIds: driver._id },
      });
    }

    return res.status(200).json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  assignDriverToVehicle,
  completeDriverKyc,
  deleteDriver,
};
