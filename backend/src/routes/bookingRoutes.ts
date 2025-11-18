import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { AuthMiddleware } from '../middleware/auth';

export class BookingRoutes {
  router = Router();
  controller = new BookingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/request', AuthMiddleware.verifyToken, this.controller.createRequest.bind(this.controller));
    this.router.get('/user/:userId', AuthMiddleware.verifyToken, this.controller.getUserRequests.bind(this.controller));
    this.router.get('/driver/:driverId', AuthMiddleware.verifyToken, this.controller.getDriverRequests.bind(this.controller));
    this.router.patch('/:requestId/status', AuthMiddleware.verifyToken, this.controller.updateRequestStatus.bind(this.controller));
    this.router.get('/:requestId', AuthMiddleware.verifyToken, this.controller.getRequestDetails.bind(this.controller));
  }
}