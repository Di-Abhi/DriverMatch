const prisma = require('../lib/prisma');

/**
 * Create a request (USER)
 * returns created request and matched drivers (simple match)
 */
async function createRequest(req, res) {
  try {
    const userId = req.user.userId;
    const { vehicleType, minExperience, pickupAddress, time, notes } = req.body;

    const requestData = {
      userId,
      vehicleType: vehicleType || null,
      minExperience: minExperience ? Number(minExperience) : null,
      pickupAddress: pickupAddress || null,
      time: time ? new Date(time) : null,
      notes: notes || null,
      status: 'OPEN'
    };

    const request = await prisma.request.create({ data: requestData });

    // Simple matching: online drivers with vehicleType and experience
    const where = {
      role: 'DRIVER',
      isOnline: true,
      vehicleType: vehicleType || undefined,
      experienceYears: minExperience ? { gte: Number(minExperience) } : undefined
    };

    const drivers = await prisma.user.findMany({
      where,
      take: 20,
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

    res.json({ request, matchedDrivers: drivers.slice(0, 10) });
  } catch (err) {
    console.error('createRequest error', err);
    res.status(500).json({ error: 'Failed to create request' });
  }
}

/**
 * User selects a driver for a request -> sets selectedDriverId + status PENDING
 */
async function selectDriver(req, res) {
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
    res.json({ ok: true, message: 'Driver contacted' });
  } catch (err) {
    console.error('selectDriver error', err);
    res.status(500).json({ error: 'Failed to select driver' });
  }
}

/**
 * Get request details (if accepted, include driver details)
 */
async function getRequest(req, res) {
  try {
    const requestId = req.params.id;
    const request = await prisma.request.findUnique({ where: { id: requestId } });
    if (!request) return res.status(404).json({ error: 'Request not found' });

    if (request.status === 'ACCEPTED') {
      const driver = await prisma.user.findUnique({
        where: { id: request.selectedDriverId },
        select: {
          id: true, name: true, phone: true, email: true, vehicleType: true, vehicleModel: true, vehicleNumber: true, licenseUrl: true
        }
      });
      return res.json({ request, driver });
    }
    return res.json({ request });
  } catch (err) {
    console.error('getRequest error', err);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
}

module.exports = {
  createRequest,
  selectDriver,
  getRequest
};
