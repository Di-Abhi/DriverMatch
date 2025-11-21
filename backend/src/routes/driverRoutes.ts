import { Router } from 'express';
import { DriverController } from '../controllers/driverController';
import { AuthMiddleware } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'license-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export class DriverRoutes {
  router = Router();
  private controller = new DriverController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Public routes
    this.router.post('/register', upload.single('license'), this.controller.register.bind(this.controller));
    
    // Protected routes
    this.router.get('/profile', AuthMiddleware.verifyToken, this.controller.getProfile.bind(this.controller));
    this.router.get('/all', AuthMiddleware.verifyToken, this.controller.getAllDrivers.bind(this.controller));
    this.router.get('/:driverId', AuthMiddleware.verifyToken, this.controller.getDriverById.bind(this.controller));
    this.router.patch('/availability', AuthMiddleware.verifyToken, this.controller.updateAvailability.bind(this.controller));
  }
}