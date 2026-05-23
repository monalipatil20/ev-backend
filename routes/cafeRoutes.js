// Cafe routes for order management.
const express = require('express');

const cafeController = require('../controllers/cafeController');

const router = express.Router();

router.get('/', cafeController.getOrders);
router.post('/', cafeController.createOrder);
router.put('/:id', cafeController.updateOrder);
router.delete('/:id', cafeController.deleteOrder);

module.exports = router;