import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  private userService = new UserService();

  async register(req: Request, res: Response) {
    try {
      const { clerkId, name, email, phone } = req.body;

      // Validate required fields
      if (!clerkId || !name || !email || !phone) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['clerkId', 'name', 'email', 'phone']
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const user = await this.userService.createUser({ clerkId, name, email, phone });
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      console.error('User registration error:', error);
      
      // Handle Prisma unique constraint errors
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return res.status(409).json({ error: 'User with this email or clerkId already exists' });
      }
      
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const clerkUserId = req.auth?.userId || req.body.clerkUserId;
      
      if (!clerkUserId) {
        return res.status(400).json({ error: 'User ID not provided' });
      }

      const user = await this.userService.getUserByClerkId(clerkUserId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get user profile' });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const clerkUserId = req.auth?.userId || req.body.clerkUserId;
      const { name, phone } = req.body;
      
      if (!clerkUserId) {
        return res.status(400).json({ error: 'User ID not provided' });
      }

      const updateData: { name?: string; phone?: string } = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;

      const user = await this.userService.updateUser(clerkUserId, updateData);
      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  async logoutUser(req: Request, res: Response) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ error: 'Logout failed' });
    }
  }
}