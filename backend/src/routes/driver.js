const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const driverController = require('../controllers/driverController');

// Get driver profile
router.get('/profile', authMiddleware, requireRole('DRIVER'), driverController.getProfile);

// Update driver profile
router.put('/profile', authMiddleware, requireRole('DRIVER'), driverController.updateProfile);

// Get assigned requests for driver
router.get('/assigned-requests', authMiddleware, requireRole('DRIVER'), driverController.getAssignedRequests);

// Driver responds to request
router.post('/:id/driver-response', authMiddleware, requireRole('DRIVER'), driverController.respondToRequest);

// Toggle driver online/offline
router.post('/toggle-online', authMiddleware, requireRole('DRIVER'), driverController.toggleOnline);

// Search drivers (public)
router.get('/search', driverController.searchDrivers);

module.exports = router;