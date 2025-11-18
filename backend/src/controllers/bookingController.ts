import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';

export class BookingController {
  private bookingService = new BookingService();

  async createRequest(req: Request, res: Response) {
    try {
      const { userId, driverId, period } = req.body;
      const request = await this.bookingService.createBookingRequest({
        userId,
        driverId,
        period
      });
      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create booking request' });
    }
  }

  async getUserRequests(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const requests = await this.bookingService.getRequestsByUserId(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user requests' });
    }
  }

  async getDriverRequests(req: Request, res: Response) {
    try {
      const { driverId } = req.params;
      const requests = await this.bookingService.getRequestsByDriverId(driverId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get driver requests' });
    }
  }

  async updateRequestStatus(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      const { status } = req.body;
      const request = await this.bookingService.updateRequestStatus(requestId, status);
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update request status' });
    }
  }

  async getRequestDetails(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      const request = await this.bookingService.getRequestById(requestId);
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get request details' });
    }
  }
}