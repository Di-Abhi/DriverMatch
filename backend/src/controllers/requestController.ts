import { Request, Response } from 'express';
import prisma from '../lib/prisma';

type AuthRequest = Request & { user: { userId: string } };

class RequestController {
  createRequest = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user.userId;
      const { vehicleType, minExperience, pickupAddress, time, notes } = req.body;

      const requestData: any = {
        userId,
        vehicleType: vehicleType || null,
        minExperience: minExperience ? Number(minExperience) : null,
        pickupAddress: pickupAddress || null,
        time: time ? new Date(time) : null,
        notes: notes || null,
        status: 'OPEN'
      };

      const request = await prisma.request.create({ data: requestData });

      const where: any = {
        role: 'DRIVER',
        isOnline: true,
        // set undefined when filter not provided so Prisma ignores it
        vehicleType: vehicleType || undefined,
        experienceYears: minExperience ? { gte: Number(minExperience) } : undefined
      };

      const drivers = await prisma.user.findMany({
        where,
        take: 10,
        select: {
          id: true,
          name: true,
          vehicleType: true,
          vehicleModel: true,
          experienceYears: true,
          licenseUrl: true,
          rating: true,
          isOnline: true
        }
      });

      return res.json({ request, matchedDrivers: drivers });
    } catch (err: any) {
      console.error('createRequest error', err);
      return res.status(500).json({ error: 'Failed to create request', details: err?.message });
    }
  };

  selectDriver = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user.userId;
      const requestId = req.params.id;
      const { driverId } = req.body;

      const request = await prisma.request.findUnique({ where: { id: requestId } });
      if (!request) return res.status(404).json({ error: 'Request not found' });
      if (request.userId !== userId) return res.status(403).json({ error: 'Not your request' });
      if (request.status !== 'OPEN') return res.status(400).json({ error: 'Request not open' });

      await prisma.request.update({
        where: { id: requestId },
        data: { selectedDriverId: driverId, status: 'PENDING' }
      });

      // TODO: notify driver via socket/push
      return res.json({ ok: true, message: 'Driver contacted' });
    } catch (err: any) {
      console.error('selectDriver error', err);
      return res.status(500).json({ error: 'Failed to select driver', details: err?.message });
    }
  };

  getRequest = async (req: Request, res: Response) => {
    try {
      const requestId = req.params.id;
      const request = await prisma.request.findUnique({ where: { id: requestId } });
      if (!request) return res.status(404).json({ error: 'Request not found' });

      if (request.status === 'ACCEPTED' && request.selectedDriverId) {
        const driver = await prisma.user.findUnique({
          where: { id: request.selectedDriverId },
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            vehicleType: true,
            vehicleModel: true,
            vehicleNumber: true,
            licenseUrl: true
          }
        });
        return res.json({ request, driver });
      }

      return res.json({ request });
    } catch (err: any) {
      console.error('getRequest error', err);
      return res.status(500).json({ error: 'Failed to fetch request', details: err?.message });
    }
  };
}

export default new RequestController();
