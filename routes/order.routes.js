const express = require('express');
const {
  protectToken,
  orderExist,
  protectOrderOwner,
} = require('../middlewares/users.middlewares');

const {
  getAllOrder,
  createOrder,
  getOrderByIdPending,
  deleteOrder,
} = require('../controllers/order.controller');

const router = express.Router();

// Apply protectedToken middleware
router.use(protectToken);

router.get('/me', getAllOrder);

router.post('/', createOrder);

router.patch('/:id', orderExist, protectOrderOwner, getOrderByIdPending);

router.delete('/:id', orderExist, protectOrderOwner, deleteOrder);

module.exports = { orderRouter: router };
