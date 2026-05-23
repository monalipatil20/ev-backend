const Fleet = require('./fleet.model');

class FleetServiceMongo {
  // Register Fleet
  async registerFleet(fleetManagerId, fleetData) {
    try {
      const fleetExists = await Fleet.findOne({
        fleetManagerId,
        registrationNumber: fleetData.registrationNumber,
      });

      if (fleetExists) {
        throw {
          status: 400,
          message: 'Fleet already registered with this registration number',
          code: 'FLEET_EXISTS',
        };
      }

      const fleet = await Fleet.create({
        fleetManagerId,
        ...fleetData,
      });

      return {
        success: true,
        message: 'Fleet registered successfully',
        data: fleet,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Fleet Details
  async getFleetDetails(fleetManagerId) {
    try {
      const fleet = await Fleet.findOne({ fleetManagerId }).populate('fleetManagerId');
      
      if (!fleet) {
        throw {
          status: 404,
          message: 'Fleet not found',
          code: 'FLEET_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Fleet details retrieved successfully',
        data: fleet,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get All Fleets (Admin)
  async getAllFleets(filters = {}) {
    try {
      const query = {};
      if (filters.status) query.status = filters.status;
      if (filters.isVerified !== undefined) query.isVerified = filters.isVerified;

      const fleets = await Fleet.find(query).populate('fleetManagerId');

      return {
        success: true,
        message: 'Fleets retrieved successfully',
        data: fleets,
      };
    } catch (error) {
      throw error;
    }
  }

  // Update Fleet
  async updateFleet(fleetManagerId, updateData) {
    try {
      const fleet = await Fleet.findOneAndUpdate(
        { fleetManagerId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!fleet) {
        throw {
          status: 404,
          message: 'Fleet not found',
          code: 'FLEET_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Fleet updated successfully',
        data: fleet,
      };
    } catch (error) {
      throw error;
    }
  }

  // Verify Fleet (Admin)
  async verifyFleet(fleetId) {
    try {
      const fleet = await Fleet.findByIdAndUpdate(
        fleetId,
        { isVerified: true, status: 'approved' },
        { new: true }
      );

      if (!fleet) {
        throw {
          status: 404,
          message: 'Fleet not found',
          code: 'FLEET_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Fleet verified successfully',
        data: fleet,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FleetServiceMongo();
