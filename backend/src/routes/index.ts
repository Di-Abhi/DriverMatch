import { Router } from 'express';
import authRoute from './auth.route'
import driverRoute from './driver.route'
import requestRoute from './request.route'

const router = Router();

router.use('/auth',authRoute);

router.use('/drivers',driverRoute);

router.use('/requests',requestRoute)

export default router;
