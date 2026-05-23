const Dealership = require('./dealership.model');

class DealershipService {
  // Apply for Franchise/Dealership
  async applyForDealership(userId, dealershipData) {
    try {
      const dealershipExists = await Dealership.findOne({
        userId,
        registrationNumber: dealershipData.registrationNumber,
      });

      if (dealershipExists) {
        throw {
          status: 400,
          message: 'Dealership application already exists',
          code: 'DEALERSHIP_EXISTS',
        };
      }

      const dealership = await Dealership.create({
        userId,
        ...dealershipData,
      });

      return {
        success: true,
        message: 'Dealership application submitted successfully',
        data: dealership,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Dealership Details
  async getDealershipDetails(userId) {
    try {
      const dealership = await Dealership.findOne({ userId }).populate('userId');

      if (!dealership) {
        throw {
          status: 404,
          message: 'Dealership not found',
          code: 'DEALERSHIP_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Dealership details retrieved successfully',
        data: dealership,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Dashboard Data
  async getDashboard(userId) {
    try {
      const dealership = await Dealership.findOne({ userId });

      if (!dealership) {
        throw {
          status: 404,
          message: 'Dealership not found',
          code: 'DEALERSHIP_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Dashboard data retrieved successfully',
        data: {
          businessName: dealership.businessName,
          totalInventory: dealership.totalInventory,
          totalSales: dealership.totalSales,
          commission: dealership.commission,
          isVerified: dealership.isVerified,
          status: dealership.status,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Update Dealership
  async updateDealership(userId, updateData) {
    try {
      const dealership = await Dealership.findOneAndUpdate(
        { userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!dealership) {
        throw {
          status: 404,
          message: 'Dealership not found',
          code: 'DEALERSHIP_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Dealership updated successfully',
        data: dealership,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get All Dealerships (Admin)
  async getAllDealerships(filters = {}) {
    try {
      const query = {};
      if (filters.dealershipType) query.dealershipType = filters.dealershipType;
      if (filters.status) query.status = filters.status;
      if (filters.isVerified !== undefined) query.isVerified = filters.isVerified;

      const dealerships = await Dealership.find(query).populate('userId');

      return {
        success: true,
        message: 'Dealerships retrieved successfully',
        data: dealerships,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DealershipService();
