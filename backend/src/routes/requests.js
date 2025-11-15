const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const requestController = require('../controllers/requestController');

// Create request (USER)
router.post('/', authMiddleware, requireRole('USER'), requestController.createRequest);

// Select driver for request (USER)
router.post('/:id/select', authMiddleware, requireRole('USER'), requestController.selectDriver);

// Get request (role-based)
router.get('/:id', authMiddleware, requestController.getRequest);

module.exports = router;
