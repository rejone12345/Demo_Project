const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

async function authMiddleware(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey_change_me');
    const admin = await Admin.findOne({ email: payload.email }).select('-password');
    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized: Admin not found' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    console.error('Auth verification error:', err.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

module.exports = { authMiddleware };
