import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { driverProfileSchema, driverProfileUpdateSchema } from '../validation/schemas';
import { DriverController } from '../controllers/DriverController';
import { validateRequest } from '../validation/validateRequest';

const router = Router();

router.post('/profile', authenticateToken,validateRequest(driverProfileSchema), DriverController.createProfile);
router.patch('/profile', authenticateToken,validateRequest(driverProfileUpdateSchema), DriverController.updateProfile);
router.get('/search', DriverController.searchDrivers);
router.patch('/availability', authenticateToken, DriverController.toggleAvailability);

export default router;