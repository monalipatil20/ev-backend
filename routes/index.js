// Single router entrypoint that keeps the API versioned and organized.
const express = require('express');

const authRoutes = require('./authRoutes');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

module.exports = router;