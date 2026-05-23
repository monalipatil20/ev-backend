const LandingContent = require('../models/LandingContent');
const ChargingStation = require('../models/ChargingStation');
const Fleet = require('../models/Fleet');
const Dealership = require('../modules/dealership/dealership.model');
const CafeOrder = require('../models/CafeOrder');
const ServiceRequest = require('../models/ServiceRequest');

const LANDING_KEYS = [
  'featured-stations',
  'latest-analytics',
  'ev-offers',
  'dealership-highlights',
  'franchise-banners',
  'testimonials',
  'charging-statistics',
];

const getLandingData = async (req, res, next) => {
  try {
    const [sections, featuredStations, analyticsSnapshot] = await Promise.all([
      LandingContent.find({ key: { $in: LANDING_KEYS }, isPublished: true }),
      ChargingStation.find().sort({ rating: -1 }).limit(6),
      Promise.all([
        ChargingStation.countDocuments(),
        Fleet.countDocuments(),
        Dealership.countDocuments(),
        CafeOrder.countDocuments(),
        ServiceRequest.countDocuments(),
      ]),
    ]);

    const [totalStations, totalFleets, totalDealers, totalCafeOrders, totalServices] = analyticsSnapshot;

    return res.status(200).json({
      success: true,
      message: 'Landing data fetched successfully',
      data: {
        featuredStations,
        latestAnalytics: {
          totalStations,
          totalFleets,
          totalDealers,
          totalCafeOrders,
          totalServices,
        },
        contentSections: sections,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const upsertLandingSection = async (req, res, next) => {
  try {
    const { key, title, content, isPublished } = req.body;

    const section = await LandingContent.findOneAndUpdate(
      { key },
      {
        key,
        title,
        content,
        isPublished: isPublished !== undefined ? isPublished : true,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({ success: true, message: 'Landing section saved successfully', data: section });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getLandingData,
  upsertLandingSection,
};
