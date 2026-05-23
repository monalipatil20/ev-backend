const express = require('express');
const reportController = require('../controllers/reportController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorizeRoles('admin', 'fleet_manager', 'dealer', 'franchise_owner', 'service_manager'), reportController.getSystemReports);

module.exports = router;
