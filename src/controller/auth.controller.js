const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ROLES } = require('../utils/roles');
const { sendWelcomeEmail } = require('../services/email.service');

function setTokenCookies(res, token) {
  const isProd = process.env.NODE_ENV === 'production'; // Safer check
  // FIX: Method is res.cookie (singular)
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing fields.' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'User with email already exists.' });

    const user = await User.create({ name, email, password, role: ROLES.USER });
    const token = user.signToken();
    setTokenCookies(res, token);

    await sendWelcomeEmail(user.email, user.name).catch(() => {});
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ success: false, message: 'Invalid password.' });
    const token = user.signToken();
    setTokenCookies(res, token);
    res.status(200).json({ // Typically 200 for login, not 201
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.me = async (req, res) => {
  // FIX: Changed 'dara' to 'data'
  res.json({ success: true, data: req.user });
};

exports.logout = async (req, res) => {
  // FIX: Method is res.clearCookie (singular)
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
};