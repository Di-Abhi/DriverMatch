const prisma = require('../lib/prisma');

/**
 * Get driver profile with vehicle and license details
 */
async function getProfile(req, res) {
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

    res.json({ user });
  } catch (err) {
    console.error('getProfile error', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

/**
 * Update driver profile
 */
async function updateProfile(req, res) {
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

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (vehicleType) updateData.vehicleType = vehicleType;
    if (vehicleModel) updateData.vehicleModel = vehicleModel;
    if (vehicleNumber) updateData.vehicleNumber = vehicleNumber;
    if (licenseNo) updateData.licenseNo = licenseNo;
    if (experienceYears) updateData.experienceYears = Number(experienceYears);
    if (workType) updateData.workType = workType.toUpperCase() === 'PARTTIME' ? 'PARTTIME' : 'FULLTIME';

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

    res.json({ user, message: 'Profile updated' });
  } catch (err) {
    console.error('updateProfile error', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

/**
 * Get assigned requests for driver (PENDING or ACCEPTED)
 */
async function getAssignedRequests(req, res) {
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

    // Map to match frontend expectations
    const mappedRequests = requests.map(r => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.name,
      userPhone: r.user.phone,
      userEmail: r.user.email,
      vehicleType: r.vehicleType,
      minExperience: r.minExperience,
      pickupAddress: r.pickupAddress,
      time: r.time,
      notes: r.notes,
      status: r.status,
      createdAt: r.createdAt
    }));

    res.json({ requests: mappedRequests });
  } catch (err) {
    console.error('getAssignedRequests error', err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
}

/**
 * Driver responds to assigned request: accept or reject
 */
async function respondToRequest(req, res) {
  try {
    const driverId = req.user.userId;
    const requestId = req.params.id;
    const { action } = req.body; // 'accept' | 'reject'

    const request = await prisma.request.findUnique({ where: { id: requestId } });
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.selectedDriverId !== driverId) return res.status(403).json({ error: 'Not assigned to you' });

    if (action === 'accept') {
      await prisma.request.update({ 
        where: { id: requestId }, 
        data: { status: 'ACCEPTED' } 
      });
      return res.json({ ok: true, message: 'Request accepted' });
    } else if (action === 'reject') {
      await prisma.request.update({ 
        where: { id: requestId }, 
        data: { status: 'REJECTED', selectedDriverId: null } 
      });
      return res.json({ ok: true, message: 'Request rejected' });
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (err) {
    console.error('respondToRequest error', err);
    res.status(500).json({ error: 'Failed to respond to request' });
  }
}

/**
 * Toggle driver online/offline status
 */
async function toggleOnline(req, res) {
  try {
    const driverId = req.user.userId;
    const { isOnline } = req.body;

    const user = await prisma.user.update({
      where: { id: driverId },
      data: { isOnline: Boolean(isOnline) },
      select: {
        id: true,
        name: true,
        isOnline: true
      }
    });

    res.json({ user, message: `Driver is now ${user.isOnline ? 'online' : 'offline'}` });
  } catch (err) {
    console.error('toggleOnline error', err);
    res.status(500).json({ error: 'Failed to toggle online status' });
  }
}

/**
 * Search drivers (public endpoint)
 */
async function searchDrivers(req, res) {
  try {
    const { vehicleType, minExperience } = req.query;

    const where = {
      role: 'DRIVER',
      isOnline: true
    };

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

    res.json({ drivers });
  } catch (err) {
    console.error('searchDrivers error', err);
    res.status(500).json({ error: 'Failed to search drivers' });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getAssignedRequests,
  respondToRequest,
  toggleOnline,
  searchDrivers
};