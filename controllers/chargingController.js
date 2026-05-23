// Charging station controller for CRUD operations and booking management.
const mongoose = require('mongoose');
const ChargingStation = require('../models/ChargingStation');
const ChargingBooking = require('../models/ChargingBooking');
const ApiError = require('../utils/ApiError');
const EARTH_RADIUS_KM = 6371;

const toPositiveInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const toCoordinate = (value, fieldName) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new ApiError(400, `${fieldName} must be a valid number`, 'INVALID_COORDINATE');
  }

  return parsed;
};

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const calculateDistanceKm = (originLat, originLon, destinationLat, destinationLon) => {
  const latitudeDelta = toRadians(destinationLat - originLat);
  const longitudeDelta = toRadians(destinationLon - originLon);

  const a =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(toRadians(originLat)) * Math.cos(toRadians(destinationLat)) *
      Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

const buildStationResponse = (station, origin) => {
  const latitude = station.latitude ?? station.location?.coordinates?.[1];
  const longitude = station.longitude ?? station.location?.coordinates?.[0];
  const distanceKm = calculateDistanceKm(origin.latitude, origin.longitude, latitude, longitude);

  return {
    id: String(station._id),
    _id: String(station._id),
    name: station.stationName,
    stationName: station.stationName,
    location: station.address,
    address: station.address,
    latitude,
    longitude,
    coordinates: {
      latitude,
      longitude,
    },
    distance: Number(distanceKm.toFixed(2)),
    distanceKm: Number(distanceKm.toFixed(2)),
    totalConnectors: station.totalConnectors,
    availableSlots: station.availableSlots,
    chargingSpeed: station.chargingSpeed,
    rating: station.rating,
    chargerType: station.chargerType,
    status: station.status,
  };
};

const createStation = async (req, res, next) => {
  try {
    const {
      stationName,
      location,
      address,
      latitude,
      longitude,
      chargerType,
      chargingSpeed,
      totalConnectors,
      availableSlots,
      rating,
      pricePerUnit,
      status,
    } = req.body;

    const resolvedAddress = address || location;

    if (!stationName || !resolvedAddress || !chargerType || availableSlots === undefined || pricePerUnit === undefined) {
      throw new ApiError(400, 'stationName, address, chargerType, availableSlots, and pricePerUnit are required', 'MISSING_FIELDS');
    }

    if (latitude !== undefined && (Number(latitude) < -90 || Number(latitude) > 90)) {
      throw new ApiError(400, 'latitude must be between -90 and 90', 'INVALID_COORDINATE');
    }

    if (longitude !== undefined && (Number(longitude) < -180 || Number(longitude) > 180)) {
      throw new ApiError(400, 'longitude must be between -180 and 180', 'INVALID_COORDINATE');
    }

    const station = await ChargingStation.create({
      stationName,
      address: resolvedAddress,
      latitude,
      longitude,
      chargerType,
      chargingSpeed: chargingSpeed || chargerType,
      totalConnectors: totalConnectors ?? availableSlots,
      availableSlots,
      rating: rating ?? 4.5,
      pricePerUnit,
      status,
    });

    return res.status(201).json({
      success: true,
      message: 'Charging station created successfully',
      data: station,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllStations = async (req, res, next) => {
  try {
    const stations = await ChargingStation.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Charging stations fetched successfully',
      data: stations,
    });
  } catch (error) {
    return next(error);
  }
};

const getNearbyStations = async (req, res, next) => {
  try {
    const latitudeInput = req.query.latitude ?? req.query.lat;
    const longitudeInput = req.query.longitude ?? req.query.lng;
    const latitude = toCoordinate(latitudeInput, 'latitude');
    const longitude = toCoordinate(longitudeInput, 'longitude');

    if (latitude < -90 || latitude > 90) {
      throw new ApiError(400, 'latitude must be between -90 and 90', 'INVALID_COORDINATE');
    }

    if (longitude < -180 || longitude > 180) {
      throw new ApiError(400, 'longitude must be between -180 and 180', 'INVALID_COORDINATE');
    }

    const radiusKm = Math.max(1, Number(req.query.radiusKm) || 25);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

    console.log('[Charging API] Nearby search request', {
      latitude,
      longitude,
      radiusKm,
      limit,
    });

    const geoQuery = {
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusKm * 1000,
        },
      },
    };

    const geoStations = await ChargingStation.find(geoQuery).limit(limit);

    const nearbyStations = geoStations
      .map((station) => buildStationResponse(station, { latitude, longitude }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, limit);

    console.log('[Charging API] Nearby stations found', {
      count: nearbyStations.length,
      distances: nearbyStations.map((station) => station.distanceKm),
    });

    return res.status(200).json({
      success: true,
      message: 'Nearby charging stations fetched successfully',
      data: nearbyStations,
      stations: nearbyStations,
      meta: {
        origin: {
          latitude,
          longitude,
        },
        radiusKm,
        count: nearbyStations.length,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getStationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid station ID', 'INVALID_ID');
    }

    const station = await ChargingStation.findById(id);

    if (!station) {
      throw new ApiError(404, 'Charging station not found', 'STATION_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Charging station fetched successfully',
      data: station,
    });
  } catch (error) {
    return next(error);
  }
};

const updateStation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid station ID', 'INVALID_ID');
    }

    const updates = {};
    ['stationName', 'location', 'address', 'latitude', 'longitude', 'chargerType', 'chargingSpeed', 'totalConnectors', 'availableSlots', 'rating', 'pricePerUnit', 'status'].forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.location && typeof updates.location === 'string') {
      updates.address = updates.location;
      delete updates.location;
    }

    if (typeof updates.latitude === 'number' && typeof updates.longitude === 'number') {
      updates.location = {
        type: 'Point',
        coordinates: [updates.longitude, updates.latitude],
      };
    }

    const station = await ChargingStation.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!station) {
      throw new ApiError(404, 'Charging station not found', 'STATION_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Charging station updated successfully',
      data: station,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteStation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid station ID', 'INVALID_ID');
    }

    const station = await ChargingStation.findByIdAndDelete(id);

    if (!station) {
      throw new ApiError(404, 'Charging station not found', 'STATION_NOT_FOUND');
    }

    return res.status(200).json({
      success: true,
      message: 'Charging station deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const bookSlot = async (req, res, next) => {
  try {
    const { stationId, slotsBooked } = req.body;
    const requestedSlots = toPositiveInteger(slotsBooked) || 1;

    if (!stationId) {
      throw new ApiError(400, 'stationId is required', 'MISSING_FIELDS');
    }

    if (!mongoose.Types.ObjectId.isValid(stationId)) {
      throw new ApiError(400, 'Invalid station ID', 'INVALID_ID');
    }

    const station = await ChargingStation.findOneAndUpdate(
      {
        _id: stationId,
        status: 'active',
        availableSlots: { $gte: requestedSlots },
      },
      {
        $inc: { availableSlots: -requestedSlots },
      },
      { new: true }
    );

    if (!station) {
      throw new ApiError(400, 'No available slots at this station', 'NO_AVAILABLE_SLOTS');
    }

    const booking = await ChargingBooking.create({
      station: station._id,
      user: req.user?._id,
      slotsBooked: requestedSlots,
    });

    return res.status(201).json({
      success: true,
      message: 'Slot booked successfully',
      data: {
        booking,
        station,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user?.role !== 'admin') {
      filter.user = req.user?._id;
    }

    const bookings = await ChargingBooking.find(filter)
      .populate('station', 'stationName location chargerType pricePerUnit status')
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Bookings fetched successfully',
      data: bookings,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createStation,
  getAllStations,
  getNearbyStations,
  getStationById,
  updateStation,
  deleteStation,
  bookSlot,
  getBookings,
};