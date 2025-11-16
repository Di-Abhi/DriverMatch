import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;


export function signToken(user: { id: string; role: string }) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.authToken;

  if (!token)
    return res.status(401).json({ error: "Authorization missing" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      userId: string;
      role: string;
    };

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ error: "Not authenticated" });

    if (req.user.role !== role)
      return res.status(403).json({ error: "Forbidden" });

    next();
  };
}
