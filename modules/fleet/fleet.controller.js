const fleetService = require('./fleet.service');

class FleetController {
  // Register Fleet
  async registerFleet(req, res, next) {
    try {
      const fleetManagerId = req.user.userId;
      const { companyName, registrationNumber, gstNumber } = req.body;

      if (!companyName || !registrationNumber || !gstNumber) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields',
          code: 'MISSING_FIELDS',
        });
      }

      const fleetData = {
        companyName,
        registrationNumber,
        gstNumber,
        registrationDoc: req.files?.registrationDoc?.[0]?.filename,
        gstDoc: req.files?.gstDoc?.[0]?.filename,
      };

      const result = await fleetService.registerFleet(fleetManagerId, fleetData);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get Fleet Details
  async getFleetDetails(req, res, next) {
    try {
      const fleetManagerId = req.user.userId;
      const result = await fleetService.getFleetDetails(fleetManagerId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get All Fleets
  async getAllFleets(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        isVerified: req.query.isVerified === 'true',
      };

      const result = await fleetService.getAllFleets(filters);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Update Fleet
  async updateFleet(req, res, next) {
    try {
      const fleetManagerId = req.user.userId;
      const updateData = {
        companyName: req.body.companyName,
        gstNumber: req.body.gstNumber,
      };

      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      const result = await fleetService.updateFleet(fleetManagerId, updateData);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Verify Fleet (Admin)
  async verifyFleet(req, res, next) {
    try {
      const { fleetId } = req.params;
      const result = await fleetService.verifyFleet(fleetId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FleetController();
