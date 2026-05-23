const chargingService = require('./charging.service');

class ChargingController {
  // Add Charging Station
  async addChargingStation(req, res, next) {
    try {
      const {
        stationName,
        location,
        address,
        city,
        state,
        pincode,
        totalConnectors,
        connectorTypes,
        pricePerUnit,
      } = req.body;

      if (!stationName || !location || !totalConnectors || !pricePerUnit) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields',
          code: 'MISSING_FIELDS',
        });
      }

      const stationData = {
        stationName,
        location,
        address,
        city,
        state,
        pincode,
        totalConnectors,
        availableConnectors: totalConnectors,
        connectorTypes,
        pricePerUnit,
        operatingHours: req.body.operatingHours,
        amenities: req.body.amenities,
        parkingAvailable: req.body.parkingAvailable,
        restaurantNearby: req.body.restaurantNearby,
      };

      const result = await chargingService.addChargingStation(stationData);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get All Stations
  async getAllStations(req, res, next) {
    try {
      const filters = {
        city: req.query.city,
        state: req.query.state,
      };

      const result = await chargingService.getAllStations(filters);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get Station Details
  async getStationDetails(req, res, next) {
    try {
      const { stationId } = req.params;
      const result = await chargingService.getStationDetails(stationId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Book Charging Slot
  async bookChargingSlot(req, res, next) {
    try {
      const userId = req.user.userId;
      const { stationId, estimatedTime } = req.body;

      if (!stationId) {
        return res.status(400).json({
          success: false,
          message: 'Station ID is required',
          code: 'MISSING_FIELDS',
        });
      }

      const result = await chargingService.bookChargingSlot(userId, {
        stationId,
        estimatedTime,
      });
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Update Station
  async updateStation(req, res, next) {
    try {
      const { stationId } = req.params;
      const updateData = {
        stationName: req.body.stationName,
        pricePerUnit: req.body.pricePerUnit,
        isActive: req.body.isActive,
        rating: req.body.rating,
      };

      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      const result = await chargingService.updateStation(stationId, updateData);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChargingController();
