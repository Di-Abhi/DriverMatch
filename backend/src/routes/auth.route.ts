import { Router } from 'express';
import { validateRequest } from '../validation/validateRequest';
import { loginSchema, signupSchema } from '../validation/schemas';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/signup',validateRequest(signupSchema), AuthController.signup);
router.post('/login',validateRequest(loginSchema), AuthController.login);
router.get('/profile', authenticateToken, AuthController.getProfile);

export default router;