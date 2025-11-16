import { Router } from "express";
import upload from "../middleware/upload";
import { authMiddleware } from "../middleware/auth";
import * as authController from "../controllers/authController";

const router = Router();

router.post('/signup', upload.single('licensePhoto'), authController.signup);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);

export default router;