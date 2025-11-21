import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { AuthMiddleware } from '../middleware/auth';

export class UserRoutes {
  router = Router();
  private controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Public routes
    this.router.post('/register', this.controller.register.bind(this.controller));
    
    // Protected routes
    this.router.get('/profile', AuthMiddleware.verifyToken, this.controller.getProfile.bind(this.controller));
    this.router.put('/profile', AuthMiddleware.verifyToken, this.controller.updateProfile.bind(this.controller));
    this.router.post('/logout', AuthMiddleware.verifyToken, this.controller.logoutUser.bind(this.controller));
  }
}