const ChargingBooking = require('../models/ChargingBooking');
const Fleet = require('../models/Fleet');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const CafeOrder = require('../models/CafeOrder');
const ServiceRequest = require('../models/ServiceRequest');

async function getEcosystemSnapshot() {
  const [
    chargingSessions,
    vehicles,
    drivers,
    trips,
    cafeOrders,
    serviceRequests,
  ] = await Promise.all([
    ChargingBooking.countDocuments(),
    Fleet.countDocuments(),
    Driver.countDocuments(),
    Trip.countDocuments(),
    CafeOrder.countDocuments(),
    ServiceRequest.countDocuments(),
  ]);

  return {
    chargingSessions,
    vehicles,
    drivers,
    trips,
    cafeOrders,
    serviceRequests,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = {
  getEcosystemSnapshot,
};
