const {
  initializeGpsSocket,
  emitVehicleLocationUpdate,
  emitChargingStatusUpdate,
  emitAdminNotification,
  emitTripUpdate,
  emitLiveAnalytics,
} = require('../socket/gpsSocket');

module.exports = {
  initializeGpsSocket,
  emitVehicleLocationUpdate,
  emitChargingStatusUpdate,
  emitAdminNotification,
  emitTripUpdate,
  emitLiveAnalytics,
};
