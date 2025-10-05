const User = require('../models/User');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  res.json({ success: true, data: user.cart });
};

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

  const user = await User.findById(req.user._id);
  const existing = user.cart.find((item) => String(item.product) === String(productId));
  if (existing) {
    existing.quantity += quantity;
  } else {
    user.cart.push({ product: productId, quantity, priceSnapShot: product.price });
  }
  await user.save();
  res.json({ success: true, data: user.cart });
};

exports.updateCartItems = async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user._id);
  const item = user.cart.find((i) => String(i.product) === String(productId));
  if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });
  // Ensure quantity is not less than 1
  if (quantity < 1) {
    user.cart = user.cart.filter((i) => String(i.product) !== String(productId));
  } else {
    item.quantity = quantity;
  }
  await user.save();
  res.json({ success: true, data: user.cart });
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((i) => String(i.product) !== String(productId));
  await user.save();
  res.json({ success: true, data: user.cart });
};

exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, data: user.wishlist });
};

exports.toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  // FIX: Changed 'User.wishlist' to 'user.wishlist' to check the specific user's data
  const exists = user.wishlist.find((p) => String(p) === String(productId));
  if (exists) {
    user.wishlist = user.wishlist.filter((p) => String(p) !== String(productId));
  } else {
    user.wishlist.push(productId);
  }
  await user.save();
  res.json({ success: true, data: user.wishlist });
};