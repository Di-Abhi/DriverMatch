import { prisma } from '../config/database';

interface CreateUserData {
  clerkId: string;
  name: string;
  email: string;
  phone: string;
}

export class UserService {
  async createUser(data: CreateUserData) {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: data.clerkId },
          { email: data.email }
        ]
      }
    });

    if (existingUser) {
      // Return existing user instead of creating duplicate
      return existingUser;
    }

    return await prisma.user.create({
      data: {
        clerkId: data.clerkId,
        name: data.name,
        email: data.email,
        phone: data.phone,
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

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async updateUser(clerkId: string, data: Partial<CreateUserData>) {
    return await prisma.user.update({
      where: { clerkId },
      data
    });
  }

  async deleteUser(clerkId: string) {
    return await prisma.user.delete({
      where: { clerkId }
    });
  }
}