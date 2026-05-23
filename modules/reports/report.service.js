const Report = require('./report.model');
const Fleet = require('../fleet/fleet.model');
const Payment = require('../payments/payment.model');
const Service = require('../service-center/service.model');
const ChargingStation = require('../charging/charging.model');

class ReportService {
  // Generate Fleet Report
  async generateFleetReport(userId, dateRange) {
    try {
      const fleets = await Fleet.find({ fleetManagerId: userId });
      const totalVehicles = fleets.reduce((sum, f) => sum + f.totalVehicles, 0);
      const totalDrivers = fleets.reduce((sum, f) => sum + f.totalDrivers, 0);

      const report = await Report.create({
        reportType: 'fleet',
        generatedBy: userId,
        reportTitle: `Fleet Management Report - ${new Date().toDateString()}`,
        reportData: fleets,
        startDate: dateRange?.startDate,
        endDate: dateRange?.endDate,
        totalRecords: fleets.length,
        summary: {
          totalFleets: fleets.length,
          totalVehicles,
          totalDrivers,
        },
      });

      return {
        success: true,
        message: 'Fleet report generated successfully',
        data: report,
      };
    } catch (error) {
      throw error;
    }
  }

  // Generate Revenue Report
  async generateRevenueReport(dateRange) {
    try {
      const query = { status: 'success' };
      if (dateRange?.startDate && dateRange?.endDate) {
        query.createdAt = {
          $gte: new Date(dateRange.startDate),
          $lte: new Date(dateRange.endDate),
        };
      }

      const payments = await Payment.find(query);
      const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
      const revenueByType = {};

      payments.forEach(p => {
        if (!revenueByType[p.paymentType]) {
          revenueByType[p.paymentType] = 0;
        }
        revenueByType[p.paymentType] += p.amount;
      });

      const report = await Report.create({
        reportType: 'revenue',
        reportTitle: `Revenue Report - ${new Date().toDateString()}`,
        reportData: payments,
        startDate: dateRange?.startDate,
        endDate: dateRange?.endDate,
        totalRecords: payments.length,
        summary: {
          totalRevenue,
          revenueByType,
          totalTransactions: payments.length,
        },
      });

      return {
        success: true,
        message: 'Revenue report generated successfully',
        data: report,
      };
    } catch (error) {
      throw error;
    }
  }

  // Generate Service Report
  async generateServiceReport(dateRange) {
    try {
      const query = {};
      if (dateRange?.startDate && dateRange?.endDate) {
        query.createdAt = {
          $gte: new Date(dateRange.startDate),
          $lte: new Date(dateRange.endDate),
        };
      }

      const services = await Service.find(query);
      const completedServices = services.filter(s => s.status === 'completed').length;
      const pendingServices = services.filter(s => s.status === 'pending').length;

      const report = await Report.create({
        reportType: 'service',
        reportTitle: `Service Report - ${new Date().toDateString()}`,
        reportData: services,
        startDate: dateRange?.startDate,
        endDate: dateRange?.endDate,
        totalRecords: services.length,
        summary: {
          totalServices: services.length,
          completedServices,
          pendingServices,
          inProgressServices: services.filter(s => s.status === 'in-progress').length,
        },
      });

      return {
        success: true,
        message: 'Service report generated successfully',
        data: report,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get All Reports
  async getAllReports(filters = {}) {
    try {
      const query = {};
      if (filters.reportType) query.reportType = filters.reportType;
      if (filters.status) query.status = filters.status;

      const reports = await Report.find(query)
        .populate('generatedBy', 'fullName email')
        .sort({ createdAt: -1 });

      return {
        success: true,
        message: 'Reports retrieved successfully',
        data: reports,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Report Details
  async getReportDetails(reportId) {
    try {
      const report = await Report.findById(reportId).populate('generatedBy');

      if (!report) {
        throw {
          status: 404,
          message: 'Report not found',
          code: 'REPORT_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Report retrieved successfully',
        data: report,
      };
    } catch (error) {
      throw error;
    }
  }

  // Update Report Status
  async updateReportStatus(reportId, status) {
    try {
      const report = await Report.findByIdAndUpdate(
        reportId,
        { status },
        { new: true }
      );

      if (!report) {
        throw {
          status: 404,
          message: 'Report not found',
          code: 'REPORT_NOT_FOUND',
        };
      }

      return {
        success: true,
        message: 'Report status updated successfully',
        data: report,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ReportService();
