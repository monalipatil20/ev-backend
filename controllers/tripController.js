const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const ApiError = require('../utils/ApiError');
const { emitTripUpdate, emitLiveAnalytics } = require('../socket/gpsSocket');

const createTrip = async (req, res, next) => {
  try {
    const trip = await Trip.create(req.body);
    emitTripUpdate({ event: 'created', data: trip });
    emitLiveAnalytics({ type: 'trip-created', tripId: String(trip._id), timestamp: new Date().toISOString() });
    return res.status(201).json({ success: true, message: 'Trip created successfully', data: trip });
  } catch (error) {
    return next(error);
  }
};

const getTrips = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.vehicleId) filter.vehicleId = req.query.vehicleId;
    if (req.query.driverId) filter.driverId = req.query.driverId;
    if (req.query.status) filter.status = req.query.status;

    const trips = await Trip.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: 'Trips fetched successfully', data: trips });
  } catch (error) {
    return next(error);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid trip ID', 'INVALID_ID');
    }

    const trip = await Trip.findById(id);
    if (!trip) {
      throw new ApiError(404, 'Trip not found', 'TRIP_NOT_FOUND');
    }

    return res.status(200).json({ success: true, message: 'Trip fetched successfully', data: trip });
  } catch (error) {
    return next(error);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid trip ID', 'INVALID_ID');
    }

    const trip = await Trip.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!trip) {
      throw new ApiError(404, 'Trip not found', 'TRIP_NOT_FOUND');
    }

    emitTripUpdate({ event: 'updated', data: trip });
    return res.status(200).json({ success: true, message: 'Trip updated successfully', data: trip });
  } catch (error) {
    return next(error);
  }
};

const completeTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findByIdAndUpdate(
      id,
      {
        status: 'completed',
        completedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!trip) {
      throw new ApiError(404, 'Trip not found', 'TRIP_NOT_FOUND');
    }

    emitTripUpdate({ event: 'completed', data: trip });
    emitLiveAnalytics({ type: 'trip-completed', tripId: String(trip._id), timestamp: new Date().toISOString() });

    return res.status(200).json({ success: true, message: 'Trip completed successfully', data: trip });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  completeTrip,
};
