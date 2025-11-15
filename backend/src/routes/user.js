const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Get user profile
router.get('/profile', authMiddleware, requireRole('USER'), userController.getProfile);

// Update user profile
router.put('/profile', authMiddleware, requireRole('USER'), userController.updateProfile);

// Get user requests
router.get('/requests', authMiddleware, requireRole('USER'), userController.getUserRequests);

module.exports = router;