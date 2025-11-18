import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  async createUser(data: { clerkId: string; name: string; email: string; phone: string }) {
    return await prisma.user.create({
      data: {
        ...data,
        userType: 'user'
      }
    });
  }

  async getUserByClerkId(clerkId: string) {
    return await prisma.user.findUnique({
      where: { clerkId }
    });
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id }
    });
  }
}