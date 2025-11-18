import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';

export class AuthMiddleware {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const session = await clerkClient.sessions.verifySession(token, token);
      req.body.clerkUserId = session.userId;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}