import { Request, Response } from 'express';
import { RequestService } from '../services/RequestService';
import { UserRepository } from '../repositories/UserRepository';

export class RequestController {
  static async createRequest(req: Request, res: Response) {
    try {
      // @ts-ignore
      const clerkId = req.auth.userId;
      const user = await UserRepository.findByClerkId(clerkId);
      if (!user) throw new Error('User not found');

      const request = await RequestService.createRequest({ customerId: user.id, ...req.body });
      res.status(201).json({ success: true, data: request });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async acceptRequest(req: Request, res: Response) {
    try {
      // @ts-ignore
      const clerkId = req.auth.userId;
      const user = await UserRepository.findByClerkId(clerkId);
      if (!user) throw new Error('User not found');
      if (!req.params.id) throw new Error('Request ID is required');

      const request = await RequestService.acceptRequest(req.params.id, user.id);
      res.json({ success: true, data: request });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async rejectRequest(req: Request, res: Response) {
    try {
      // @ts-ignore
      const clerkId = req.auth.userId;
      const user = await UserRepository.findByClerkId(clerkId);
      if (!user) throw new Error('User not found');
      if (!req.params.id) throw new Error('Request ID is required');

      const request = await RequestService.rejectRequest(req.params.id, user.id);
      res.json({ success: true, data: request });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getMyRequests(req: Request, res: Response) {
    try {
      // @ts-ignore
      const clerkId = req.auth.userId;
      const user = await UserRepository.findByClerkId(clerkId);
      if (!user) throw new Error('User not found');

      const requests = user.isDriver()
        ? await RequestService.getDriverRequests(user.id)
        : await RequestService.getCustomerRequests(user.id);

      res.json({ success: true, data: requests });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}