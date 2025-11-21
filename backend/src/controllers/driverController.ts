import { Request, Response } from 'express';
import { DriverService } from '../services/driverService';

export class DriverController {
  private driverService = new DriverService();

  async register(req: Request, res: Response) {
    try {
      const { clerkId, name, email, phone, licenseNo } = req.body;
      const licenseFile = req.file;

      // Validate required fields
      if (!clerkId || !name || !email || !phone || !licenseNo) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['clerkId', 'name', 'email', 'phone', 'licenseNo']
        });
      }

      if (!licenseFile) {
        return res.status(400).json({ error: 'License file is required' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const driver = await this.driverService.createDriver({
        clerkId,
        name,
        email,
        phone,
        licenseNo,
        licenseFile
      });

      res.status(201).json({ success: true, data: driver });
    } catch (error) {
      console.error('Driver registration error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          return res.status(409).json({ error: error.message });
        }
      }
      
      res.status(500).json({ error: 'Failed to create driver' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const clerkUserId = req.auth?.userId || req.body.clerkUserId;
      
      if (!clerkUserId) {
        return res.status(400).json({ error: 'User ID not provided' });
      }

      const driver = await this.driverService.getDriverByClerkId(clerkUserId);
      
      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      res.json({ success: true, data: driver });
    } catch (error) {
      console.error('Get driver profile error:', error);
      res.status(500).json({ error: 'Failed to get driver profile' });
    }
  }

  async getAllDrivers(req: Request, res: Response) {
    try {
      const availableOnly = req.query.available !== 'false';
      const drivers = await this.driverService.getAllDrivers(availableOnly);
      res.json({ success: true, data: drivers });
    } catch (error) {
      console.error('Get all drivers error:', error);
      res.status(500).json({ error: 'Failed to get drivers' });
    }
  }

  async getDriverById(req: Request, res: Response) {
    try {
      const { driverId } = req.params;
      
      if (!driverId) {
        return res.status(400).json({ error: 'Driver ID is required' });
      }

      const driver = await this.driverService.getDriverById(driverId);
      
      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      res.json({ success: true, data: driver });
    } catch (error) {
      console.error('Get driver by ID error:', error);
      res.status(500).json({ error: 'Failed to get driver' });
    }
  }

  async updateAvailability(req: Request, res: Response) {
    try {
      const clerkUserId = req.auth?.userId || req.body.clerkUserId;
      const { available } = req.body;
      
      if (!clerkUserId) {
        return res.status(400).json({ error: 'User ID not provided' });
      }

      if (typeof available !== 'boolean') {
        return res.status(400).json({ error: 'Available must be a boolean' });
      }

      const driver = await this.driverService.updateDriverAvailability(clerkUserId, available);
      res.json({ success: true, data: driver });
    } catch (error) {
      console.error('Update availability error:', error);
      res.status(500).json({ error: 'Failed to update availability' });
    }
  }
}