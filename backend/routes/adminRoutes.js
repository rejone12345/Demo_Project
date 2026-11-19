const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getAdminRegistrations,
  getRegistrationById,
  updateRegistrationDetails,
  updateStatus,
  removeRegistration,
  exportCSV
} = require('../controllers/adminController');

const router = express.Router();

// Protect all admin routes with auth middleware
router.use(authMiddleware);

// Dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

// Export CSV
router.get('/registrations/export', exportCSV);

// Registrations CRUD & search & pagination
router.get('/registrations', getAdminRegistrations);
router.get('/registrations/:id', getRegistrationById);
router.put('/registrations/:id', updateRegistrationDetails);
router.patch('/registrations/:id/status', updateStatus);
router.delete('/registrations/:id', removeRegistration);

module.exports = router;
