import { Router } from 'express';
import { DriverController } from '../controllers/driverController';
import { AuthMiddleware } from '../middleware/auth';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export class DriverRoutes {
  router = Router();
  controller = new DriverController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/register', upload.single('license'), this.controller.register.bind(this.controller));
    this.router.get('/profile', AuthMiddleware.verifyToken, this.controller.getProfile.bind(this.controller));
    this.router.get('/all', AuthMiddleware.verifyToken, this.controller.getAllDrivers.bind(this.controller));
  }
}
