// Service controller for CRUD operations on EV service requests.
const mongoose = require('mongoose');
const ServiceRequest = require('../models/ServiceRequest');
const ApiError = require('../utils/ApiError');

const createServiceRequest = async (req, res, next) => {
  try {
    const { customerName, vehicleNumber, issue, serviceDate, status } = req.body;

    if (!customerName || !vehicleNumber || !issue || !serviceDate) {
      throw new ApiError(
        400,
        'customerName, vehicleNumber, issue, and serviceDate are required',
        'MISSING_FIELDS'
      );
    }

    const serviceRequest = await ServiceRequest.create({
      customerName,
      vehicleNumber,
      issue,
      serviceDate,
      status,
    });

    return res.status(201).json({
      success: true,
      message: 'Service request created successfully',
      data: serviceRequest,
    });
  } catch (error) {
    return next(error);
  }
};

const getServiceRequests = async (req, res, next) => {
  try {
    const requests = await ServiceRequest.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Service requests fetched successfully',
      data: requests,
    });
  } catch (error) {
    return next(error);
  }
};

const getServiceRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid service request ID', 'INVALID_ID');
    }

    const serviceRequest = await ServiceRequest.findById(id);

    if (!serviceRequest) {
      throw new ApiError(404, 'Service request not found', 'SERVICE_REQUEST_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Service request fetched successfully',
      data: serviceRequest,
    });
  } catch (error) {
    return next(error);
  }
};

const updateServiceRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid service request ID', 'INVALID_ID');
    }

    const updates = {};
    ['customerName', 'vehicleNumber', 'issue', 'serviceDate', 'status'].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const serviceRequest = await ServiceRequest.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!serviceRequest) {
      throw new ApiError(404, 'Service request not found', 'SERVICE_REQUEST_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Service request updated successfully',
      data: serviceRequest,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteServiceRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid service request ID', 'INVALID_ID');
    }

    const serviceRequest = await ServiceRequest.findByIdAndDelete(id);

    if (!serviceRequest) {
      throw new ApiError(404, 'Service request not found', 'SERVICE_REQUEST_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Service request deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
  updateServiceRequest,
  deleteServiceRequest,
};