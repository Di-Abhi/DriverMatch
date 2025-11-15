const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../middleware/auth');
const requestController = require('../controllers/requestController');


router.post('/', authMiddleware, requireRole('USER'), requestController.createRequest);
router.post('/:id/select', authMiddleware, requireRole('USER'), requestController.selectDriver);
router.get('/:id', authMiddleware, requestController.getRequest);

module.exports = router;
