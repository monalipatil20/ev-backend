// Dedicated health route for load balancers and quick API checks.
const express = require('express');

const { getHealthStatus } = require('../controllers/healthController');

const router = express.Router();

router.get('/', getHealthStatus);

module.exports = router;