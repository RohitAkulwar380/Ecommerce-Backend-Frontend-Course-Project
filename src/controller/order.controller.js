const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendOrderEmail } = require('../services/email.service'); // Corrected import name

exports.placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const user = await User.findById(req.user._id).populate('cart.product');
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    const items = user.cart.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      quantity: i.quantity,
      price: i.priceSnapShot,
    }));
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({ user: user._id, items, total, shippingAddress });

    await Promise.all(
      user.cart.map((i) => Product.findByIdAndUpdate(i.product._id, { $inc: { stock: -i.quantity } }))
    );

    user.cart = [];
    await user.save();

    await sendOrderEmail(user.email, order._id, total).catch(() => {});

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  // FIX: Used res.json() which correctly sends a 200 status by default
  res.json({ success: true, data: orders });
};

exports.getAllOrders = async (req, res) => {
  // FIX: Used .sort() instead of .toSorted()
  const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
  // FIX: Used res.json()
  res.json({ success: true, data: orders });
};

// ADDED: New function to get a single order
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }
  res.json({ success: true, data: order });
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
  // FIX: Used res.json()
  res.json({ success: true, data: order });
};