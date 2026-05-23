const reportService = require('./report.service');

class ReportController {
  // Generate Fleet Report
  async generateFleetReport(req, res, next) {
    try {
      const userId = req.user.userId;
      const { startDate, endDate } = req.query;

      const result = await reportService.generateFleetReport(userId, {
        startDate,
        endDate,
      });
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Generate Revenue Report
  async generateRevenueReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      const result = await reportService.generateRevenueReport({
        startDate,
        endDate,
      });
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Generate Service Report
  async generateServiceReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      const result = await reportService.generateServiceReport({
        startDate,
        endDate,
      });
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get All Reports
  async getAllReports(req, res, next) {
    try {
      const filters = {
        reportType: req.query.reportType,
        status: req.query.status,
      };

      const result = await reportService.getAllReports(filters);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get Report Details
  async getReportDetails(req, res, next) {
    try {
      const { reportId } = req.params;
      const result = await reportService.getReportDetails(reportId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Update Report Status
  async updateReportStatus(req, res, next) {
    try {
      const { reportId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required',
          code: 'MISSING_FIELDS',
        });
      }

      const result = await reportService.updateReportStatus(reportId, status);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
