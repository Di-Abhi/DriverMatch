import { prisma } from '../config/database';

interface CreateBookingData {
  userId: string;
  driverId: string;
  period: string;
}

type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';

export class BookingService {
  async createBookingRequest(data: CreateBookingData) {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify driver exists and is available
    const driver = await prisma.driver.findUnique({
      where: { id: data.driverId }
    });
    
    if (!driver) {
      throw new Error('Driver not found');
    }

    if (!driver.available) {
      throw new Error('Driver is not available');
    }

    // Check for existing pending request from same user to same driver
    const existingRequest = await prisma.bookingRequest.findFirst({
      where: {
        userId: data.userId,
        driverId: data.driverId,
        status: 'pending'
      }
    });

    if (existingRequest) {
      throw new Error('You already have a pending request with this driver');
    }

    return await prisma.bookingRequest.create({
      data: {
        userId: data.userId,
        driverId: data.driverId,
        period: data.period,
        status: 'pending'
      },
      include: {
        user: true,
        driver: true
      }
    });
  }

  async getRequestsByUserId(userId: string) {
    return await prisma.bookingRequest.findMany({
      where: { userId },
      include: {
        driver: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getRequestsByDriverId(driverId: string) {
    return await prisma.bookingRequest.findMany({
      where: { driverId },
      include: {
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateRequestStatus(requestId: string, status: BookingStatus) {
    // Validate status
    const validStatuses: BookingStatus[] = ['pending', 'accepted', 'rejected', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const request = await prisma.bookingRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      throw new Error('Booking request not found');
    }

    return await prisma.bookingRequest.update({
      where: { id: requestId },
      data: { status },
      include: {
        user: true,
        driver: true
      }
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

  async cancelRequest(requestId: string, userId: string) {
    const request = await prisma.bookingRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      throw new Error('Booking request not found');
    }

    if (request.userId !== userId) {
      throw new Error('You can only cancel your own requests');
    }

    if (request.status !== 'pending') {
      throw new Error('Can only cancel pending requests');
    }

    return await prisma.bookingRequest.update({
      where: { id: requestId },
      data: { status: 'cancelled' }
    });
  }
}