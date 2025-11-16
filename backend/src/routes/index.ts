import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { DriverController } from '../controllers/DriverController';
import { RequestController } from '../controllers/RequestController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Auth routes
router.post('/auth/signup', AuthController.signup);
router.post('/auth/login', AuthController.login);
router.get('/auth/profile', authenticateToken, AuthController.getProfile);

// Driver routes
router.post('/drivers/profile', authenticateToken, DriverController.createProfile);
router.patch('/drivers/profile', authenticateToken, DriverController.updateProfile);
router.get('/drivers/search', DriverController.searchDrivers);
router.patch('/drivers/availability', authenticateToken, DriverController.toggleAvailability);

// Request routes
router.post('/requests', authenticateToken, RequestController.createRequest);
router.patch('/requests/:id/accept', authenticateToken, RequestController.acceptRequest);
router.patch('/requests/:id/reject', authenticateToken, RequestController.rejectRequest);
router.get('/requests', authenticateToken, RequestController.getMyRequests);

export default router;
