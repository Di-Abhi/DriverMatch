import { PrismaClient } from '@prisma/client';

export class DatabaseConfig {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new PrismaClient();
    }
    return DatabaseConfig.instance;
  }
}