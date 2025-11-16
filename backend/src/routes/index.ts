import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import requestRoutes from "./requests";
import driverRoutes from "./driver";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/requests", requestRoutes);
router.use("/driver", driverRoutes);

export default router;
