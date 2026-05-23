// Service routes for managing EV service requests.
const express = require('express');

const serviceController = require('../controllers/serviceController');

const router = express.Router();

router.get('/', serviceController.getServiceRequests);
router.get('/:id', serviceController.getServiceRequestById);
router.post('/', serviceController.createServiceRequest);
router.put('/:id', serviceController.updateServiceRequest);
router.delete('/:id', serviceController.deleteServiceRequest);

module.exports = router;