// GPS controller for receiving and serving vehicle location data.
const VehicleLocation = require('../models/VehicleLocation');
const ApiError = require('../utils/ApiError');
const { emitVehicleLocationUpdate } = require('../socket/gpsSocket');

const parseCoordinate = (value, fieldName) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new ApiError(400, `${fieldName} must be a valid number`, 'INVALID_COORDINATE');
  }

  return parsed;
};

const normalizeIdentifier = (value, fieldName) => {
  if (typeof value !== 'string' || value.trim().length < 2) {
    throw new ApiError(400, `${fieldName} is required`, 'MISSING_FIELDS');
  }

  return value.trim();
};

const updateLocation = async (req, res, next) => {
  try {
    const vehicleId = normalizeIdentifier(req.body.vehicleId, 'vehicleId');
    const driverId = normalizeIdentifier(req.body.driverId, 'driverId');
    const latitude = parseCoordinate(req.body.latitude, 'latitude');
    const longitude = parseCoordinate(req.body.longitude, 'longitude');

    if (latitude < -90 || latitude > 90) {
      throw new ApiError(400, 'latitude must be between -90 and 90', 'INVALID_COORDINATE');
    }

    if (longitude < -180 || longitude > 180) {
      throw new ApiError(400, 'longitude must be between -180 and 180', 'INVALID_COORDINATE');
    }

    let timestamp = new Date();
    if (req.body.timestamp) {
      const parsedDate = new Date(req.body.timestamp);
      if (Number.isNaN(parsedDate.getTime())) {
        throw new ApiError(400, 'timestamp must be a valid ISO date', 'INVALID_TIMESTAMP');
      }
      timestamp = parsedDate;
    }

    const location = await VehicleLocation.create({
      vehicleId,
      driverId,
      latitude,
      longitude,
      timestamp,
    });

    emitVehicleLocationUpdate(location);

    return res.status(201).json({
      success: true,
      message: 'Vehicle location updated successfully',
      data: location,
    });
  } catch (error) {
    return next(error);
  }
};

const getLiveLocation = async (req, res, next) => {
  try {
    const vehicleId = normalizeIdentifier(req.params.vehicleId, 'vehicleId');

    const latestLocation = await VehicleLocation.findOne({ vehicleId }).sort({ timestamp: -1 });

    if (!latestLocation) {
      throw new ApiError(404, 'Live location not found for the provided vehicle', 'LOCATION_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Live location fetched successfully',
      data: latestLocation,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllVehiclesLiveLocations = async (req, res, next) => {
  try {
    const latestLocations = await VehicleLocation.aggregate([
      { $sort: { vehicleId: 1, timestamp: -1 } },
      {
        $group: {
          _id: '$vehicleId',
          latestLocation: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$latestLocation' } },
      { $sort: { timestamp: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: 'All vehicle live locations fetched successfully',
      data: latestLocations,
      count: latestLocations.length,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  updateLocation,
  getLiveLocation,
  getAllVehiclesLiveLocations,
};
