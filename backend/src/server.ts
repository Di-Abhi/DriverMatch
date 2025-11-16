import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Database } from './config/database.config';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

const start = async () => {
  await Database.connect();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

start();