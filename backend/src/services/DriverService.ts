import { prisma } from '../config/database';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

interface CreateDriverData {
  clerkId: string;
  name: string;
  email: string;
  phone: string;
  licenseNo: string;
  licenseFile: Express.Multer.File;
}

export class DriverService {
  async createDriver(data: CreateDriverData) {
    const existingDriver = await prisma.driver.findFirst({
      where: {
        OR: [
          { clerkId: data.clerkId },
          { email: data.email },
          { licenseNo: data.licenseNo }
        ]
      }
    });

    if (existingDriver) {
      if (fs.existsSync(data.licenseFile.path)) {
        fs.unlinkSync(data.licenseFile.path);
      }
      throw new Error('Driver already exists with this clerkId, email, or license number');
    }

    // Upload to cloudinary
    const uploadResult = await cloudinary.uploader.upload(data.licenseFile.path, {
      folder: 'driver_licenses',
      resource_type: 'image'
    });

    // Clean up local file after upload
    if (fs.existsSync(data.licenseFile.path)) {
      fs.unlinkSync(data.licenseFile.path);
    }

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

  async getAllDrivers(availableOnly: boolean = true) {
    const where = availableOnly ? { available: true } : {};
    return await prisma.driver.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  async getDriverById(id: string) {
    return await prisma.driver.findUnique({
      where: { id }
    });
  }

  async getDriverByEmail(email: string) {
    return await prisma.driver.findUnique({
      where: { email }
    });
  }

  async updateDriverAvailability(clerkId: string, available: boolean) {
    return await prisma.driver.update({
      where: { clerkId },
      data: { available }
    });
  }

  async updateDriver(clerkId: string, data: Partial<Omit<CreateDriverData, 'licenseFile'>>) {
    return await prisma.driver.update({
      where: { clerkId },
      data
    });
  }

  async deleteDriver(clerkId: string) {
    return await prisma.driver.delete({
      where: { clerkId }
    });
  }
}