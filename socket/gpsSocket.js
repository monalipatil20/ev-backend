// Socket.IO live GPS gateway for receiving and broadcasting vehicle locations.
const { Server } = require('socket.io');
const VehicleLocation = require('../models/VehicleLocation');

let ioInstance = null;

const normalizeIdentifier = (value) => {
  return typeof value === 'string' && value.trim().length >= 2 ? value.trim() : null;
};

const parseCoordinate = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toLivePayload = (doc) => ({
  id: String(doc._id),
  vehicleId: doc.vehicleId,
  driverId: doc.driverId,
  latitude: doc.latitude,
  longitude: doc.longitude,
  timestamp: doc.timestamp,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const emitVehicleLocationUpdate = (locationDocument) => {
  if (!ioInstance || !locationDocument) {
    return;
  }

  const payload = toLivePayload(locationDocument);

  ioInstance.emit('gps:vehicle-location-updated', payload);
  ioInstance.to(`vehicle:${payload.vehicleId}`).emit('gps:vehicle-location-updated', payload);
};

const getAllLatestVehicleLocations = async () => {
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

  return latestLocations.map((doc) => ({
    id: String(doc._id),
    vehicleId: doc.vehicleId,
    driverId: doc.driverId,
    latitude: doc.latitude,
    longitude: doc.longitude,
    timestamp: doc.timestamp,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));
};

const initializeGpsSocket = (httpServer, corsOptions) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: corsOptions.origin,
      credentials: true,
    },
  });

  ioInstance.on('connection', async (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    try {
      const latestLocations = await getAllLatestVehicleLocations();
      socket.emit('gps:vehicles-bootstrap', {
        success: true,
        data: latestLocations,
      });
    } catch (error) {
      socket.emit('gps:error', {
        success: false,
        message: `Unable to load bootstrap locations: ${error.message}`,
      });
    }

    socket.on('gps:subscribe-vehicle', (vehicleId) => {
      const normalizedVehicleId = normalizeIdentifier(vehicleId);
      if (!normalizedVehicleId) {
        return;
      }

      socket.join(`vehicle:${normalizedVehicleId}`);
    });

    socket.on('gps:update-location', async (payload, ack) => {
      try {
        const vehicleId = normalizeIdentifier(payload?.vehicleId);
        const driverId = normalizeIdentifier(payload?.driverId);
        const latitude = parseCoordinate(payload?.latitude);
        const longitude = parseCoordinate(payload?.longitude);

        if (!vehicleId || !driverId || latitude === null || longitude === null) {
          throw new Error('vehicleId, driverId, latitude, and longitude are required');
        }

        if (latitude < -90 || latitude > 90) {
          throw new Error('latitude must be between -90 and 90');
        }

        if (longitude < -180 || longitude > 180) {
          throw new Error('longitude must be between -180 and 180');
        }

        const timestamp = payload?.timestamp ? new Date(payload.timestamp) : new Date();
        if (Number.isNaN(timestamp.getTime())) {
          throw new Error('timestamp must be a valid ISO date');
        }

        const locationDocument = await VehicleLocation.create({
          vehicleId,
          driverId,
          latitude,
          longitude,
          timestamp,
        });

        emitVehicleLocationUpdate(locationDocument);

        if (typeof ack === 'function') {
          ack({
            success: true,
            message: 'Live location received',
            data: toLivePayload(locationDocument),
          });
        }
      } catch (error) {
        if (typeof ack === 'function') {
          ack({
            success: false,
            message: error.message,
          });
        }

        socket.emit('gps:error', {
          success: false,
          message: error.message,
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

module.exports = {
  initializeGpsSocket,
  emitVehicleLocationUpdate,
};
