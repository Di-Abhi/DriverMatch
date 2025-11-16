import { Request, Response } from 'express';
import { DriverService } from '../services/DriverService';
import { UserRepository } from '../repositories/UserRepository';

export class DriverController {
  static async createProfile(req: Request, res: Response) {
    try {
      // @ts-ignore
      const clerkId = req.auth.userId;
      const user = await UserRepository.findByClerkId(clerkId);
      if (!user) throw new Error('User not found');

      const profile = await DriverService.createProfile(user.id, req.body);
      res.status(201).json({ success: true, data: profile });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      // @ts-ignore
      const clerkId = req.auth.userId;
      const user = await UserRepository.findByClerkId(clerkId);
      if (!user) throw new Error('User not found');

      const profile = await DriverService.updateProfile(user.id, req.body);
      res.json({ success: true, data: profile });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async searchDrivers(req: Request, res: Response) {
    try {
      const drivers = await DriverService.searchDrivers(req.query);
      res.json({ success: true, data: drivers });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async toggleAvailability(req: Request, res: Response) {
    try {
      // @ts-ignore
      const clerkId = req.auth.userId;
      const user = await UserRepository.findByClerkId(clerkId);
      if (!user) throw new Error('User not found');

      const profile = await DriverService.toggleAvailability(user.id, req.body.isAvailable);
      res.json({ success: true, data: profile });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}