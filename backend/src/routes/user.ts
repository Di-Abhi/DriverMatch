import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/auth";
import * as userController from "../controllers/userController";

const router = Router();

router.get('/profile', authMiddleware, requireRole('USER'), userController.getProfile);
router.put('/profile', authMiddleware, requireRole('USER'), userController.updateProfile);
router.get('/requests', authMiddleware, requireRole('USER'), userController.getUserRequests);

export default router;