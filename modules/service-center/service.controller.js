const serviceCenterService = require('./service.service');

class ServiceCenterController {
  // Book Service
  async bookService(req, res, next) {
    try {
      const userId = req.user.userId;
      const { serviceCenterName, vehicleRegNumber, vehicleModel, serviceType, appointmentDate } =
        req.body;

      if (!serviceCenterName || !vehicleRegNumber || !serviceType || !appointmentDate) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields',
          code: 'MISSING_FIELDS',
        });
      }

      const serviceData = {
        serviceCenterName,
        vehicleRegNumber,
        vehicleModel,
        serviceType,
        appointmentDate,
        description: req.body.description,
        estimatedCost: req.body.estimatedCost,
      };

      const result = await serviceCenterService.bookService(userId, serviceData);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get Service History
  async getServiceHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await serviceCenterService.getServiceHistory(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get Service Details
  async getServiceDetails(req, res, next) {
    try {
      const { serviceId } = req.params;
      const result = await serviceCenterService.getServiceDetails(serviceId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Update Service Status
  async updateServiceStatus(req, res, next) {
    try {
      const { serviceId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required',
          code: 'MISSING_FIELDS',
        });
      }

      const result = await serviceCenterService.updateServiceStatus(serviceId, status);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Complete Service
  async completeService(req, res, next) {
    try {
      const { serviceId } = req.params;
      const { actualCost, partsReplaced } = req.body;

      const completionData = {
        actualCost,
        partsReplaced,
        invoiceDoc: req.files?.invoiceDoc?.[0]?.filename,
      };

      const result = await serviceCenterService.completeService(serviceId, completionData);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get All Services
  async getAllServices(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        priority: req.query.priority,
        serviceCenterId: req.query.serviceCenterId,
      };

      const result = await serviceCenterService.getAllServices(filters);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ServiceCenterController();
