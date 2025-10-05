const router = require('express').Router();
// FIX: Changed updateCartItem to updateCartItems to match the controller export
const {
  getCart,
  addToCart,
  updateCartItems,
  removeFromCart,
  getWishlist,
  toggleWishlist,
} = require('../controller/cart.controller');
const { protect } = require('../middleware/auth');

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
// This is line 7, now using the correct function name
router.put('/', protect, updateCartItems);
router.delete('/:productId', protect, removeFromCart);

router.get('/wishlist', protect, getWishlist);
// FIX: Added a leading slash '/' to the path
router.post('/wishlist', protect, toggleWishlist);

module.exports = router;