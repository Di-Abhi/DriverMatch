const prisma = require('../lib/prisma');

/**
 * Get user profile
 */
async function getProfile(req, res) {
  try {
    const userId = req.user.userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
        // updatedAt: true
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (err) {
    console.error('getProfile error', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

/**
 * Update user profile
 */
async function updateProfile(req, res) {
  try {
    const userId = req.user.userId;
    const { name, phone } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
        // updatedAt: true
      }
    });

    res.json({ user, message: 'Profile updated' });
  } catch (err) {
    console.error('updateProfile error', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

/**
 * Get user requests
 */
async function getUserRequests(req, res) {
  try {
    const userId = req.user.userId;

    const requests = await prisma.request.findMany({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, phone: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ requests });
  } catch (err) {
    console.error('getUserRequests error', err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getUserRequests
};