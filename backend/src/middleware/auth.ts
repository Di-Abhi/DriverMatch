import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include auth info
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId?: string;
      };
    }
  }
}

export class AuthMiddleware {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Invalid token format' });
      }

      // For Clerk tokens, we need to verify differently
      // Clerk JWTs can be verified using the CLERK_SECRET_KEY or JWKS
      // Here's a simplified approach - in production, use Clerk's SDK properly
      
      try {
        // Try to decode the Clerk JWT
        // Clerk tokens are JWTs that can be verified
        const decoded = jwt.decode(token) as {
          sub?: string;
          sid?: string;
          exp?: number;
        } | null;

        if (!decoded || !decoded.sub) {
          return res.status(401).json({ error: 'Invalid token' });
        }

        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          return res.status(401).json({ error: 'Token expired' });
        }

        // Set the user ID from the token's subject claim
        req.auth = {
          userId: decoded.sub,
          sessionId: decoded.sid
        };
        
        // Also set it in body for backward compatibility
        req.body.clerkUserId = decoded.sub;
        
        next();
      } catch (jwtError) {
        console.error('JWT verification error:', jwtError);
        return res.status(401).json({ error: 'Invalid token' });
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ error: 'Authentication failed' });
    }
  }
  static async optionalAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
      }

      const token = authHeader.split(' ')[1];
      
      if (token) {
        const decoded = jwt.decode(token) as {
          sub?: string;
          sid?: string;
          exp?: number;
        } | null;

        if (decoded?.sub && (!decoded.exp || decoded.exp * 1000 >= Date.now())) {
          req.auth = {
            userId: decoded.sub,
            sessionId: decoded.sid
          };
          req.body.clerkUserId = decoded.sub;
        }
      }
      
      next();
    } catch (error) {
      next();
    }
  }
}