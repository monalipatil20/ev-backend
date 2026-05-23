const dealershipService = require('./dealership.service');

class DealershipController {
  // Apply for Dealership/Franchise
  async applyForDealership(req, res, next) {
    try {
      const userId = req.user.userId;
      const {
        businessName,
        dealershipType,
        registrationNumber,
        gstNumber,
        licensingNumber,
        address,
        city,
        state,
        pincode,
      } = req.body;

      if (!businessName || !dealershipType || !registrationNumber || !gstNumber) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields',
          code: 'MISSING_FIELDS',
        });
      }

      const dealershipData = {
        businessName,
        dealershipType,
        registrationNumber,
        gstNumber,
        licensingNumber,
        address,
        city,
        state,
        pincode,
      };

      const result = await dealershipService.applyForDealership(userId, dealershipData);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get Dealership Details
  async getDealershipDetails(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await dealershipService.getDealershipDetails(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get Dashboard
  async getDashboard(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await dealershipService.getDashboard(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Update Dealership
  async updateDealership(req, res, next) {
    try {
      const userId = req.user.userId;
      const updateData = {
        businessName: req.body.businessName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
      };

      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      const result = await dealershipService.updateDealership(userId, updateData);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get All Dealerships (Admin)
  async getAllDealerships(req, res, next) {
    try {
      const filters = {
        dealershipType: req.query.dealershipType,
        status: req.query.status,
        isVerified: req.query.isVerified === 'true',
      };

      const result = await dealershipService.getAllDealerships(filters);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DealershipController();
