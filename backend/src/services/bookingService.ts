import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BookingService {
  async createBookingRequest(data: {
    userId: string;
    driverId: string;
    period: string;
  }) {
    return await prisma.bookingRequest.create({
      data: {
        userId: data.userId,
        driverId: data.driverId,
        period: data.period,
        status: 'pending'
      }
    });
  }

  async getRequestsByUserId(userId: string) {
    return await prisma.bookingRequest.findMany({
      where: { userId },
      include: {
        driver: true
      }
    });
  }

  async getRequestsByDriverId(driverId: string) {
    return await prisma.bookingRequest.findMany({
      where: { driverId },
      include: {
        user: true
      }
    });
  }

  async updateRequestStatus(requestId: string, status: string) {
    return await prisma.bookingRequest.update({
      where: { id: requestId },
      data: { status }
    });
  }

  async getRequestById(requestId: string) {
    return await prisma.bookingRequest.findUnique({
      where: { id: requestId },
      include: {
        user: true,
        driver: true
      }
    });
  }
}