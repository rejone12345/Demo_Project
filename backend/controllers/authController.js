const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'supersecretkey_change_me',
      { expiresIn: '2h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    res.json({
      message: 'Login successful',
      admin: { email: admin.email, role: admin.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
}

function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
}

function me(req, res) {
  if (!req.admin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ admin: req.admin });
}

module.exports = { login, logout, me };
