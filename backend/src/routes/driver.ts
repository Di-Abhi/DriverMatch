import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/auth";
import * as driverController from "../controllers/driverController";

const router = Router();

router.get('/profile', authMiddleware, requireRole('DRIVER'), driverController.getProfile);
router.put('/profile', authMiddleware, requireRole('DRIVER'), driverController.updateProfile);
router.get('/assigned-requests', authMiddleware, requireRole('DRIVER'), driverController.getAssignedRequests);
router.post('/:id/driver-response', authMiddleware, requireRole('DRIVER'), driverController.respondToRequest);
router.post('/toggle-online', authMiddleware, requireRole('DRIVER'), driverController.toggleOnline);
router.get('/search', driverController.searchDrivers);

export default router;