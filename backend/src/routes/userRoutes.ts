import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { AuthMiddleware } from '../middleware/auth';

export class UserRoutes {
  router = Router();
  controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/register', this.controller.register.bind(this.controller));
    this.router.get('/profile', AuthMiddleware.verifyToken, this.controller.getProfile.bind(this.controller));
    this.router.post('/logout',AuthMiddleware.verifyToken,this.controller.logoutUser)
  }
}
