import { PrismaClient } from '@prisma/client';

// Singleton pattern for PrismaClient to prevent multiple instances
class DatabaseConfig {
  private static instance: PrismaClient | null = null;

  static getInstance(): PrismaClient {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' 
          ? ['query', 'error', 'warn'] 
          : ['error'],
      });
    }
    return DatabaseConfig.instance;
  }

  static async disconnect(): Promise<void> {
    if (DatabaseConfig.instance) {
      await DatabaseConfig.instance.$disconnect();
      DatabaseConfig.instance = null;
    }
  }
}

// Export singleton instance
export const prisma = DatabaseConfig.getInstance();
export { DatabaseConfig };