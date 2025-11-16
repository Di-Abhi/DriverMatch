import { Router } from "express"
import { authenticateToken } from "../middlewares/auth";
import { createRequestSchema } from "../validation/schemas";
import { validateRequest } from "../validation/validateRequest";
import { RequestController } from "../controllers/RequestController";

const router = Router();

router.post('/', authenticateToken,validateRequest(createRequestSchema), RequestController.createRequest);
router.patch('/:id/accept', authenticateToken, RequestController.acceptRequest);
router.patch('/:id/reject', authenticateToken, RequestController.rejectRequest);
router.get('/', authenticateToken, RequestController.getMyRequests);

export default router;