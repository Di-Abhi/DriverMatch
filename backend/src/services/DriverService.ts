import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

export class DriverService {
  async createDriver(data: {
    clerkId: string;
    name: string;
    email: string;
    phone: string;
    licenseNo: string;
    licenseFile: Express.Multer.File;
  }) {
    const uploadResult = await cloudinary.uploader.upload(data.licenseFile.path, {
      folder: 'driver_licenses'
    });

    return await prisma.driver.create({
      data: {
        clerkId: data.clerkId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        licenseNo: data.licenseNo,
        licenseUrl: uploadResult.secure_url
      }
    });
  }

  async getDriverByClerkId(clerkId: string) {
    return await prisma.driver.findUnique({
      where: { clerkId }
    });
  }

  async getAllDrivers() {
    return await prisma.driver.findMany({
      where: { available: true }
    });
  }

  async getDriverById(id: string) {
    return await prisma.driver.findUnique({
      where: { id }
    });
  }
}