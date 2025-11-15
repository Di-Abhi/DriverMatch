const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authMiddleware } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/signup', upload.single('licensePhoto'), authController.signup);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;