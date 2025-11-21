
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { UserRoutes } from './routes/userRoutes';
import { DriverRoutes } from './routes/driverRoutes';
import { BookingRoutes } from './routes/bookingRoutes';
import { CloudinaryConfig } from './config/cloudinary';
import { DatabaseConfig } from './config/database';

// Load environment variables
dotenv.config();

class Server {
  private app = express();
  private port = process.env.PORT || 5000;

  constructor() {
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeExternalServices();
  }

  private initializeMiddlewares() {
    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Parse JSON bodies
    this.app.use(express.json());
    
    // Parse URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true }));
    
    // Parse cookies
    this.app.use(cookieParser());

    // Request logging in development
    if (process.env.NODE_ENV === 'development') {
      this.app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
      });
    }
  }

  private initializeRoutes() {
    const userRoutes = new UserRoutes();
    const driverRoutes = new DriverRoutes();
    const bookingRoutes = new BookingRoutes();

    // API routes
    this.app.use('/api/users', userRoutes.router);
    this.app.use('/api/drivers', driverRoutes.router);
    this.app.use('/api/bookings', bookingRoutes.router);

    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  private initializeErrorHandling() {
    // Global error handler
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Unhandled error:', err);
      
      // Handle multer errors
      if (err.name === 'MulterError') {
        return res.status(400).json({ error: `File upload error: ${err.message}` });
      }
      
      res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : err.message 
      });
    });
  }

  private initializeExternalServices() {
    // Initialize Cloudinary
    CloudinaryConfig.initialize();
    
    // Verify database connection
    DatabaseConfig.getInstance().$connect()
      .then(() => console.log('Database connected successfully'))
      .catch((err) => console.error('Database connection error:', err));
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }

  // Graceful shutdown
  public async shutdown() {
    console.log('Shutting down server...');
    await DatabaseConfig.disconnect();
    process.exit(0);
  }
}

const server = new Server();
server.start();