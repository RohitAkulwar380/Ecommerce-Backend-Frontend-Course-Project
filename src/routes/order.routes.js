const router = require('express').Router();
// FIX: Only import functions that actually exist in the order controller
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controller/order.controller');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../utils/roles');

// A user places an order
router.post('/', protect, placeOrder);

// An admin gets all orders
router.get('/', protect, authorize(ROLES.ADMIN), getAllOrders);

// A user gets their own orders (using a specific path to avoid conflict)
router.get('/my-orders', protect, getMyOrders);

// Anyone with a valid token can view a specific order by its ID
router.get('/:id', protect, getOrderById);

// An admin updates an order's status
router.put('/:id', protect, authorize(ROLES.ADMIN), updateOrderStatus);

module.exports = router;