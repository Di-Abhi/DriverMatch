import { Request, Response } from 'express';
import prisma from '../lib/prisma';

type AuthRequest = Request & { user: { userId: string } };

class DriverController {
  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      const driverId = req.user.userId;

      const user = await prisma.user.findUnique({
        where: { id: driverId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          vehicleType: true,
          vehicleModel: true,
          vehicleNumber: true,
          licenseNo: true,
          licenseUrl: true,
          experienceYears: true,
          workType: true,
          rating: true,
          isOnline: true,
          createdAt: true
        }
      });

      if (!user) return res.status(404).json({ error: 'Driver not found' });
      return res.json({ user });
    } catch (err: any) {
      console.error('getProfile error', err);
      return res.status(500).json({ error: 'Failed to fetch profile', details: err?.message });
    }
  };

  updateProfile = async (req: AuthRequest, res: Response) => {
    try {
      const driverId = req.user.userId;
      const {
        name,
        phone,
        vehicleType,
        vehicleModel,
        vehicleNumber,
        licenseNo,
        experienceYears,
        workType
      } = req.body;

      const updateData: any = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (vehicleType) updateData.vehicleType = vehicleType;
      if (vehicleModel) updateData.vehicleModel = vehicleModel;
      if (vehicleNumber) updateData.vehicleNumber = vehicleNumber;
      if (licenseNo) updateData.licenseNo = licenseNo;
      if (experienceYears) updateData.experienceYears = Number(experienceYears);
      if (workType) updateData.workType = String(workType).toUpperCase() === 'PARTTIME' ? 'PARTTIME' : 'FULLTIME';

      const user = await prisma.user.update({
        where: { id: driverId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          vehicleType: true,
          vehicleModel: true,
          vehicleNumber: true,
          licenseNo: true,
          experienceYears: true,
          workType: true,
          rating: true,
          isOnline: true
        }
      });

      return res.json({ user, message: 'Profile updated' });
    } catch (err: any) {
      console.error('updateProfile error', err);
      return res.status(500).json({ error: 'Failed to update profile', details: err?.message });
    }
  };

  getAssignedRequests = async (req: AuthRequest, res: Response) => {
    try {
      const driverId = req.user.userId;

      const requests = await prisma.request.findMany({
        where: {
          selectedDriverId: driverId,
          status: { in: ['PENDING', 'ACCEPTED'] }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      const mapped = requests.map(r => ({
        id: r.id,
        userId: r.userId,
        userName: r.user?.name,
        userPhone: r.user?.phone,
        userEmail: r.user?.email,
        vehicleType: r.vehicleType,
        minExperience: r.minExperience,
        pickupAddress: r.pickupAddress,
        time: r.time,
        notes: r.notes,
        status: r.status,
        createdAt: r.createdAt
      }));

      return res.json({ requests: mapped });
    } catch (err: any) {
      console.error('getAssignedRequests error', err);
      return res.status(500).json({ error: 'Failed to fetch requests', details: err?.message });
    }
  };

  respondToRequest = async (req: AuthRequest, res: Response) => {
    try {
      const driverId = req.user.userId;
      const requestId = req.params.id;
      const { action } = req.body;

      const request = await prisma.request.findUnique({ where: { id: requestId } });
      if (!request) return res.status(404).json({ error: 'Request not found' });
      if (request.selectedDriverId !== driverId) return res.status(403).json({ error: 'Not assigned to you' });

      if (action === 'accept') {
        await prisma.request.update({ where: { id: requestId }, data: { status: 'ACCEPTED' } });
        return res.json({ ok: true, message: 'Request accepted' });
      } else if (action === 'reject') {
        await prisma.request.update({ where: { id: requestId }, data: { status: 'REJECTED', selectedDriverId: null } });
        return res.json({ ok: true, message: 'Request rejected' });
      } else {
        return res.status(400).json({ error: 'Invalid action' });
      }
    } catch (err: any) {
      console.error('respondToRequest error', err);
      return res.status(500).json({ error: 'Failed to respond to request', details: err?.message });
    }
  };

  toggleOnline = async (req: AuthRequest, res: Response) => {
    try {
      const driverId = req.user.userId;
      const { isOnline } = req.body;

      const user = await prisma.user.update({
        where: { id: driverId },
        data: { isOnline: Boolean(isOnline) },
        select: { id: true, name: true, isOnline: true }
      });

      return res.json({ user, message: `Driver is now ${user.isOnline ? 'online' : 'offline'}` });
    } catch (err: any) {
      console.error('toggleOnline error', err);
      return res.status(500).json({ error: 'Failed to toggle online status', details: err?.message });
    }
  };

  searchDrivers = async (req: Request, res: Response) => {
    try {
      const { vehicleType, minExperience } = req.query as { vehicleType?: string; minExperience?: string };

      const where: any = { role: 'DRIVER', isOnline: true };
      if (vehicleType) where.vehicleType = vehicleType;
      if (minExperience) where.experienceYears = { gte: Number(minExperience) };

      const drivers = await prisma.user.findMany({
        where,
        take: 50,
        select: {
          id: true,
          name: true,
          vehicleType: true,
          vehicleModel: true,
          experienceYears: true,
          rating: true,
          licenseUrl: true,
          isOnline: true
        },
        orderBy: { rating: 'desc' }
      });

      return res.json({ drivers });
    } catch (err: any) {
      console.error('searchDrivers error', err);
      return res.status(500).json({ error: 'Failed to search drivers', details: err?.message });
    }
  };
}

export default new DriverController();
