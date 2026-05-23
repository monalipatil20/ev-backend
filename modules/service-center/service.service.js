const Service = require('./service.model');

class ServiceCenterService {
  // Book Service
  async bookService(userId, serviceData) {
    try {
      const service = await Service.create({
        userId,
        ...serviceData,
      });

      return {
        success: true,
        message: 'Service booked successfully',
        data: service,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Service History
  async getServiceHistory(userId) {
    try {
      const services = await Service.find({ userId })
        .populate('userId')
        .sort({ createdAt: -1 });

      return {
        success: true,
        message: 'Service history retrieved successfully',
        data: services,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Service Details
  async getServiceDetails(serviceId) {
    try {
      const service = await Service.findById(serviceId).populate('userId');

      if (!service) {
        throw {
          status: 404,
          message: 'Service booking not found',
          code: 'SERVICE_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Service details retrieved successfully',
        data: service,
      };
    } catch (error) {
      throw error;
    }
  }

  // Update Service Status
  async updateServiceStatus(serviceId, status) {
    try {
      const service = await Service.findByIdAndUpdate(
        serviceId,
        { status },
        { new: true }
      );

      if (!service) {
        throw {
          status: 404,
          message: 'Service booking not found',
          code: 'SERVICE_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Service status updated successfully',
        data: service,
      };
    } catch (error) {
      throw error;
    }
  }

  // Complete Service
  async completeService(serviceId, completionData) {
    try {
      const updateData = {
        status: 'completed',
        actualCost: completionData.actualCost,
        partsReplaced: completionData.partsReplaced,
        invoiceDoc: completionData.invoiceDoc,
      };

      const service = await Service.findByIdAndUpdate(serviceId, updateData, {
        new: true,
      });

      if (!service) {
        throw {
          status: 404,
          message: 'Service booking not found',
          code: 'SERVICE_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Service completed successfully',
        data: service,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get All Services (Admin/Service Center)
  async getAllServices(filters = {}) {
    try {
      const query = {};
      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;
      if (filters.serviceCenterId) query.serviceCenterId = filters.serviceCenterId;

      const services = await Service.find(query)
        .populate('userId')
        .sort({ appointmentDate: 1 });

      return {
        success: true,
        message: 'Services retrieved successfully',
        data: services,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ServiceCenterService();
