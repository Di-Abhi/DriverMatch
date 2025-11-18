import { Request, Response } from 'express';
import { DriverService } from '../services/driverService';

export class DriverController {
  private driverService = new DriverService();

  async register(req: Request, res: Response) {
    try {
      const { clerkId, name, email, phone, licenseNo } = req.body;
      const licenseFile = req.file;

      if (!licenseFile) {
        return res.status(400).json({ error: 'License file is required' });
      }

      const driver = await this.driverService.createDriver({
        clerkId,
        name,
        email,
        phone,
        licenseNo,
        licenseFile
      });

      res.status(201).json(driver);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create driver' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const { clerkUserId } = req.body;
      const driver = await this.driverService.getDriverByClerkId(clerkUserId);
      res.json(driver);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get driver profile' });
    }
  }

  async getAllDrivers(req: Request, res: Response) {
    try {
      const drivers = await this.driverService.getAllDrivers();
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get drivers' });
    }
  }
}