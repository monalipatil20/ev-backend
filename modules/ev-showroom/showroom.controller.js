const showroomService = require('./showroom.service');

class ShowroomController {
  // Add Vehicle
  async addVehicle(req, res, next) {
    try {
      const { vehicleName, model, year, price, fuelType, transmission } = req.body;

      if (!vehicleName || !model || !year || !price || !fuelType) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields',
          code: 'MISSING_FIELDS',
        });
      }

      const vehicleData = {
        vehicleName,
        model,
        year,
        price,
        fuelType,
        transmission,
        batteryCapacity: req.body.batteryCapacity,
        range: req.body.range,
        chargingTime: req.body.chargingTime,
        description: req.body.description,
        color: req.body.color,
        mileage: req.body.mileage,
        features: req.body.features,
        dealershipId: req.body.dealershipId,
        images: req.files ? req.files.map(file => file.filename) : [],
      };

      const result = await showroomService.addVehicle(vehicleData);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get All Vehicles
  async getAllVehicles(req, res, next) {
    try {
      const filters = {
        fuelType: req.query.fuelType,
        dealershipId: req.query.dealershipId,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        availability: req.query.availability === 'true',
      };

      const result = await showroomService.getAllVehicles(filters);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get Vehicle Details
  async getVehicleDetails(req, res, next) {
    try {
      const { vehicleId } = req.params;
      const result = await showroomService.getVehicleDetails(vehicleId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Update Vehicle
  async updateVehicle(req, res, next) {
    try {
      const { vehicleId } = req.params;
      const updateData = {
        vehicleName: req.body.vehicleName,
        price: req.body.price,
        availability: req.body.availability,
        description: req.body.description,
      };

      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      const result = await showroomService.updateVehicle(vehicleId, updateData);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Delete Vehicle
  async deleteVehicle(req, res, next) {
    try {
      const { vehicleId } = req.params;
      const result = await showroomService.deleteVehicle(vehicleId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ShowroomController();
