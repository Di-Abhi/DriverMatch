import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { UserRoutes } from './routes/userRoutes';
import { DriverRoutes } from './routes/driverRoutes';
import { BookingRoutes } from './routes/bookingRoutes';
import { CloudinaryConfig } from './config/cloudinary';

dotenv.config();

class Server {
  private app = express();
  private port = process.env.PORT || 5000;

  constructor() {
    this.initializeMiddlewares();
    this.initializeRoutes();
    CloudinaryConfig.initialize();
  }

  private initializeMiddlewares() {
    this.app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
    this.app.use(express.json());
  }

  private initializeRoutes() {
    const userRoutes = new UserRoutes();
    const driverRoutes = new DriverRoutes();
    const bookingRoutes = new BookingRoutes();

    this.app.use('/api/users', userRoutes.router);
    this.app.use('/api/drivers', driverRoutes.router);
    this.app.use('/api/bookings', bookingRoutes.router);

    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

const server = new Server();
server.start();