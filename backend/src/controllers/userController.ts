import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  private userService = new UserService();

  async register(req: Request, res: Response) {
    try {
      const { clerkId, name, email, phone } = req.body;
      const user = await this.userService.createUser({ clerkId, name, email, phone });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const { clerkUserId } = req.body;
      const user = await this.userService.getUserByClerkId(clerkUserId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user profile' });
    }
  }

  async logoutUser(req: Request, res: Response) {
    try {
      res.clearCookie('token');
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ error: 'Logout failed' });
    }
  }
}