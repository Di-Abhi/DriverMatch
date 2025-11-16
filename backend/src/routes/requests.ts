import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/auth";
import * as requestController from "../controllers/requestController";

const router = Router();


router.post('/', authMiddleware, requireRole('USER'), requestController.createRequest);
router.post('/:id/select', authMiddleware, requireRole('USER'), requestController.selectDriver);
router.get('/:id', authMiddleware, requestController.getRequest);

export default router;
