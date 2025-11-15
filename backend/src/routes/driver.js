const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const driverController = require('../controllers/driverController');

router.get('/profile', authMiddleware, requireRole('DRIVER'), driverController.getProfile);
router.put('/profile', authMiddleware, requireRole('DRIVER'), driverController.updateProfile);
router.get('/assigned-requests', authMiddleware, requireRole('DRIVER'), driverController.getAssignedRequests);
router.post('/:id/driver-response', authMiddleware, requireRole('DRIVER'), driverController.respondToRequest);
router.post('/toggle-online', authMiddleware, requireRole('DRIVER'), driverController.toggleOnline);
router.get('/search', driverController.searchDrivers);

module.exports = router;