const Showroom = require('./showroom.model');

class ShowroomService {
  // Add Vehicle to Showroom
  async addVehicle(vehicleData) {
    try {
      const vehicle = await Showroom.create(vehicleData);

      return {
        success: true,
        message: 'Vehicle added to showroom successfully',
        data: vehicle,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get All Vehicles
  async getAllVehicles(filters = {}) {
    try {
      const query = {};
      if (filters.fuelType) query.fuelType = filters.fuelType;
      if (filters.dealershipId) query.dealershipId = filters.dealershipId;
      if (filters.minPrice && filters.maxPrice) {
        query.price = { $gte: filters.minPrice, $lte: filters.maxPrice };
      }
      if (filters.availability !== undefined) query.availability = filters.availability;

      const vehicles = await Showroom.find(query)
        .populate('dealershipId')
        .sort({ createdAt: -1 });

      return {
        success: true,
        message: 'Vehicles retrieved successfully',
        data: vehicles,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Vehicle Details
  async getVehicleDetails(vehicleId) {
    try {
      const vehicle = await Showroom.findById(vehicleId).populate('dealershipId');

      if (!vehicle) {
        throw {
          status: 404,
          message: 'Vehicle not found',
          code: 'VEHICLE_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Vehicle details retrieved successfully',
        data: vehicle,
      };
    } catch (error) {
      throw error;
    }
  }

  // Update Vehicle
  async updateVehicle(vehicleId, updateData) {
    try {
      const vehicle = await Showroom.findByIdAndUpdate(
        vehicleId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!vehicle) {
        throw {
          status: 404,
          message: 'Vehicle not found',
          code: 'VEHICLE_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Vehicle updated successfully',
        data: vehicle,
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete Vehicle
  async deleteVehicle(vehicleId) {
    try {
      const vehicle = await Showroom.findByIdAndDelete(vehicleId);

      if (!vehicle) {
        throw {
          status: 404,
          message: 'Vehicle not found',
          code: 'VEHICLE_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Vehicle deleted successfully',
        data: vehicle,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ShowroomService();
