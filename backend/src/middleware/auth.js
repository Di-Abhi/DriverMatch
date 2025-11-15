const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function signToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/** Express middleware: verify JWT from cookie and attach user payload on req.user */
function authMiddleware(req, res, next) {
  const token = req.cookies.authToken;
  
  if (!token) return res.status(401).json({ error: 'Authorization missing' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/** role: 'DRIVER' or 'USER' or 'ADMIN' */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (req.user.role !== role && req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

module.exports = {
  authMiddleware,
  requireRole,
  signToken
};