import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {

  static async signup(req: Request, res: Response) {
    try {
      const { email, name, phone, password, type } = req.body;

      if (!email || !name || !password || !type) {
        return res.status(400).json({ success: false, message: 'Email, name, password, and type are required' });
      }

      const user = await AuthService.signup({ email, name, phone, password, type });
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const user = await AuthService.login(email, password);
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      res.status(501).json({ success: false, message: 'Not implemented' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
