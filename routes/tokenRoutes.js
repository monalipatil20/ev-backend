const express = require('express');
const tokenController = require('../controllers/tokenController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, tokenController.getTokenTransactions);
router.post('/', protect, authorizeRoles('admin', 'fleet_manager', 'dealer', 'franchise_owner'), tokenController.createTokenTransaction);

module.exports = router;
