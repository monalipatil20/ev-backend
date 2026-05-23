const User = require('../models/User');
const ChargingStation = require('../models/ChargingStation');
const ChargingBooking = require('../models/ChargingBooking');
const Fleet = require('../models/Fleet');
const Driver = require('../models/Driver');
const CafeOrder = require('../models/CafeOrder');
const Dealership = require('../modules/dealership/dealership.model');
const TokenTransaction = require('../models/TokenTransaction');
const Trip = require('../models/Trip');

const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      chargingSessions,
      activeFleets,
      totalDrivers,
      pendingApprovals,
      activeTrips,
      tokenTxCount,
      totalCafeRevenue,
    ] = await Promise.all([
      User.countDocuments(),
      ChargingBooking.countDocuments(),
      Fleet.countDocuments({ status: { $ne: 'inactive' } }),
      Driver.countDocuments({ isActive: true }),
      Dealership.countDocuments({ status: 'pending' }),
      Trip.countDocuments({ status: 'ongoing' }),
      TokenTransaction.countDocuments(),
      CafeOrder.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    const chargingAnalytics = await ChargingStation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Admin dashboard fetched successfully',
      data: {
        totalUsers,
        chargingSessions,
        revenue: totalCafeRevenue[0]?.total || 0,
        pendingApprovals,
        activeFleets,
        totalDrivers,
        activeTrips,
        tokenAnalytics: {
          transactions: tokenTxCount,
        },
        chargingAnalytics,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAdminDashboard,
};
