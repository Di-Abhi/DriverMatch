import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';

export class BookingController {
  private bookingService = new BookingService();

  async createRequest(req: Request, res: Response) {
    try {
      const { userId, driverId, period } = req.body;

      // Validate required fields
      if (!userId || !driverId || !period) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['userId', 'driverId', 'period']
        });
      }

      // Validate period
      const validPeriods = ['hourly', 'daily', 'weekly', 'monthly'];
      if (!validPeriods.includes(period.toLowerCase())) {
        return res.status(400).json({ 
          error: `Invalid period. Must be one of: ${validPeriods.join(', ')}`
        });
      }

      const request = await this.bookingService.createBookingRequest({
        userId,
        driverId,
        period: period.toLowerCase()
      });
      
      res.status(201).json({ success: true, data: request });
    } catch (error) {
      console.error('Create booking request error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('not available') || error.message.includes('pending request')) {
          return res.status(400).json({ error: error.message });
        }
      }
      
      res.status(500).json({ error: 'Failed to create booking request' });
    }
  }

  async getUserRequests(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const requests = await this.bookingService.getRequestsByUserId(userId);
      res.json({ success: true, data: requests });
    } catch (error) {
      console.error('Get user requests error:', error);
      res.status(500).json({ error: 'Failed to get user requests' });
    }
  }

  async getDriverRequests(req: Request, res: Response) {
    try {
      const { driverId } = req.params;
      
      if (!driverId) {
        return res.status(400).json({ error: 'Driver ID is required' });
      }

      const requests = await this.bookingService.getRequestsByDriverId(driverId);
      res.json({ success: true, data: requests });
    } catch (error) {
      console.error('Get driver requests error:', error);
      res.status(500).json({ error: 'Failed to get driver requests' });
    }
  }

  async updateRequestStatus(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      const { status } = req.body;
      
      if (!requestId) {
        return res.status(400).json({ error: 'Request ID is required' });
      }

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const request = await this.bookingService.updateRequestStatus(requestId, status);
      res.json({ success: true, data: request });
    } catch (error) {
      console.error('Update request status error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('Invalid status')) {
          return res.status(400).json({ error: error.message });
        }
      }
      
      res.status(500).json({ error: 'Failed to update request status' });
    }
  }

  async getRequestDetails(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      
      if (!requestId) {
        return res.status(400).json({ error: 'Request ID is required' });
      }

      const request = await this.bookingService.getRequestById(requestId);
      
      if (!request) {
        return res.status(404).json({ error: 'Booking request not found' });
      }

      res.json({ success: true, data: request });
    } catch (error) {
      console.error('Get request details error:', error);
      res.status(500).json({ error: 'Failed to get request details' });
    }
  }

  async cancelRequest(req: Request, res: Response) {
    try {
      const { requestId } = req.params;
      const userId = req.auth?.userId || req.body.userId;
      
      if (!requestId) {
        return res.status(400).json({ error: 'Request ID is required' });
      }

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const request = await this.bookingService.cancelRequest(requestId, userId);
      res.json({ success: true, data: request });
    } catch (error) {
      console.error('Cancel request error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('only cancel')) {
          return res.status(403).json({ error: error.message });
        }
      }
      
      res.status(500).json({ error: 'Failed to cancel request' });
    }
  }
}