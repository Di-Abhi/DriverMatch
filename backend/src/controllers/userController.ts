// src/controllers/UserController.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

type AuthRequest = Request & { user: { userId: string } };

class UserController {
  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true
        }
      });

      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json({ user });
    } catch (err: any) {
      console.error('getProfile error', err);
      return res.status(500).json({ error: 'Failed to fetch profile', details: err?.message });
    }
  };

  updateProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user.userId;
      const { name, phone } = req.body;

      const updateData: any = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true
        }
      });

      return res.json({ user, message: 'Profile updated' });
    } catch (err: any) {
      console.error('updateProfile error', err);
      return res.status(500).json({ error: 'Failed to update profile', details: err?.message });
    }
  };

  getUserRequests = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user.userId;

      const requests = await prisma.request.findMany({
        where: { userId },
        include: {
          user: {
            select: { id: true, name: true, phone: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return res.json({ requests });
    } catch (err: any) {
      console.error('getUserRequests error', err);
      return res.status(500).json({ error: 'Failed to fetch requests', details: err?.message });
    }
  };
}

export default new UserController();
