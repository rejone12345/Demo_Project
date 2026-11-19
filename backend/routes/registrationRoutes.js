const express = require('express');
const { createRegistration, listRegistrations } = require('../controllers/registrationController');

const router = express.Router();

// Public: Submit student registration
router.post('/', createRegistration);

// Get registrations (for initial testing)
router.get('/', listRegistrations);

module.exports = router;
