import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { uploadBufferToCloudinary } from '../utils/cloudinary';
import { signToken } from '../middleware/auth';

type MulterRequest = Request & {
  file?: Express.Multer.File;
};

class AuthController {
  // POST /signup
  signup = async (req: MulterRequest, res: Response) => {
    try {
      const {
        name,
        email,
        password,
        phone,
        role,
        experienceYears,
        workType,
        licenseNo,
        vehicleType,
        vehicleModel,
        vehicleNumber
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'name,email,password required' });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ error: 'Email already registered' });

      const passwordHash = await bcrypt.hash(password, 10);

      const createData: any = {
        name,
        email,
        passwordHash,
        phone: phone || null,
        role: (role && String(role).toUpperCase() === 'DRIVER') ? 'DRIVER' : 'USER',
      };

      if (createData.role === 'DRIVER') {
        if (experienceYears) createData.experienceYears = Number(experienceYears);
        if (workType) createData.workType = String(workType).toUpperCase() === 'PARTTIME' ? 'PARTTIME' : 'FULLTIME';
        if (licenseNo) createData.licenseNo = licenseNo;
        if (vehicleType) createData.vehicleType = vehicleType;
        if (vehicleModel) createData.vehicleModel = vehicleModel;
        if (vehicleNumber) createData.vehicleNumber = vehicleNumber;

        if (req.file && req.file.buffer) {
          const result = await uploadBufferToCloudinary(req.file.buffer, 'drivematch/licenses');
          createData.licenseUrl = result.secure_url;
        }
      }

      const user = await prisma.user.create({ data: createData });

      const token = signToken(user);
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      const { passwordHash: _, ...safeUser } = user as any;
      res.json({ user: safeUser });
    } catch (err: any) {
      console.error('signup error', err);
      res.status(500).json({ error: 'Signup failed', details: err?.message });
    }
  };

  // POST /login
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'email and password required' });

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });

      const ok = await bcrypt.compare(password, (user as any).passwordHash);
      if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

      const token = signToken(user);
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      const { passwordHash: _, ...safeUser } = user as any;
      res.json({ user: safeUser });
    } catch (err) {
      console.error('login error', err);
      res.status(500).json({ error: 'Login failed' });
    }
  };

  logout = async (_req: Request, res: Response) => {
    try {
      res.clearCookie('authToken');
      res.json({ ok: true, message: 'Logged out' });
    } catch (err) {
      console.error('logout error', err);
      res.status(500).json({ error: 'Logout failed' });
    }
  };
}

export default new AuthController();
