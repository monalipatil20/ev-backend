const express = require('express');
const landingController = require('../controllers/landingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', landingController.getLandingData);
router.put('/content', protect, authorizeRoles('admin'), landingController.upsertLandingSection);

module.exports = router;
