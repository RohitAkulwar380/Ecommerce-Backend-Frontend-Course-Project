const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUserRole, deleteUser } = require('../controller/user.controller');
const { protect, authorize } = require('../middleware/auth');

// All user routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Get all users
router.get('/', getUsers);

// Get user by ID
router.get('/:id', getUser);

// Update user role
router.put('/:id/role', updateUserRole);

// Delete user
router.delete('/:id', deleteUser);

module.exports = router;
