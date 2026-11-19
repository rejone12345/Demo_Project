const express = require('express');
const { login, logout, me } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/auth/me', authMiddleware, me);

module.exports = router;
