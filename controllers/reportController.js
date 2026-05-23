const ChargingBooking = require('../models/ChargingBooking');
const Trip = require('../models/Trip');
const Fleet = require('../models/Fleet');
const Driver = require('../models/Driver');
const ServiceRequest = require('../models/ServiceRequest');

const getSystemReports = async (req, res, next) => {
  try {
    const [bookingCount, tripsByStatus, fleetByStatus, pendingKycDrivers, pendingServices] = await Promise.all([
      ChargingBooking.countDocuments(),
      Trip.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Fleet.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Driver.countDocuments({ kycStatus: { $ne: 'verified' } }),
      ServiceRequest.countDocuments({ status: { $in: ['pending', 'scheduled', 'in_progress'] } }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Reports fetched successfully',
      data: {
        bookingCount,
        tripsByStatus,
        fleetByStatus,
        pendingKycDrivers,
        pendingServices,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getSystemReports,
};
