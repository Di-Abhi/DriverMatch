const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/profile', authMiddleware, requireRole('USER'), userController.getProfile);
router.put('/profile', authMiddleware, requireRole('USER'), userController.updateProfile);
router.get('/requests', authMiddleware, requireRole('USER'), userController.getUserRequests);

module.exports = router;