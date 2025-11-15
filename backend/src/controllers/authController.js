const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');
const { uploadBufferToCloudinary } = require('../utils/cloudinary');
const { signToken } = require('../middleware/auth');

async function signup(req, res) {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      experienceYears,
      workType,
      licenseNo,
      vehicleType,
      vehicleModel,
      vehicleNumber
    } = req.body;

    if (!name || !email || !password) return res.status(400).json({ error: 'name,email,password required' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);

    const createData = {
      name,
      email,
      passwordHash,
      phone: phone || null,
      role: (role && role.toUpperCase() === 'DRIVER') ? 'DRIVER' : 'USER',
    };

    if (createData.role === 'DRIVER') {
      if (experienceYears) createData.experienceYears = Number(experienceYears);
      if (workType) createData.workType = workType.toUpperCase() === 'PARTTIME' ? 'PARTTIME' : 'FULLTIME';
      if (licenseNo) createData.licenseNo = licenseNo;
      if (vehicleType) createData.vehicleType = vehicleType;
      if (vehicleModel) createData.vehicleModel = vehicleModel;
      if (vehicleNumber) createData.vehicleNumber = vehicleNumber;

      if (req.file && req.file.buffer) {
        const result = await uploadBufferToCloudinary(req.file.buffer, 'drivematch/licenses');
        createData.licenseUrl = result.secure_url;
      }
    }

    const user = await prisma.user.create({ data: createData });

    const token = signToken(user);
    
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const safeUser = { ...user, passwordHash: undefined };
    res.json({ user: safeUser });
  } catch (err) {
    console.error('signup error', err);
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = signToken(user);
    

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const safeUser = { ...user, passwordHash: undefined };
    res.json({ user: safeUser });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'Login failed' });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie('authToken');
    res.json({ ok: true, message: 'Logged out' });
  } catch (err) {
    console.error('logout error', err);
    res.status(500).json({ error: 'Logout failed' });
  }
}

module.exports = {
  signup,
  login,
  logout
};