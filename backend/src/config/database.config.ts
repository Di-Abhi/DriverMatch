import { PrismaClient } from '@prisma/client';

export class Database {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient();
    }
    return Database.instance;
  }

  static async connect(): Promise<void> {
    await Database.getInstance().$connect();
    console.log('✅ Database connected');
  }

  static async disconnect(): Promise<void> {
    await Database.getInstance().$disconnect();
  }
}