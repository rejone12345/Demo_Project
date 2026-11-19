const Registration = require('../models/Registration');

function generateRegistrationId() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `REG-${dateStr}-${randomSuffix}`;
}

const BD_PHONE_REGEX = /^(\+?88)?01[3-9]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function createRegistration(req, res) {
  try {
    const {
      studentName,
      fatherName,
      motherName,
      phone,
      email,
      dateOfBirth,
      gender,
      address,
    } = req.body;

    const errors = {};

    if (!studentName || !studentName.trim()) {
      errors.studentName = 'Student full name is required';
    }
    if (!fatherName || !fatherName.trim()) {
      errors.fatherName = "Father's name is required";
    }
    if (!motherName || !motherName.trim()) {
      errors.motherName = "Mother's name is required";
    }
    if (phone && phone.trim() && !BD_PHONE_REGEX.test(phone.trim())) {
      errors.phone = 'Please provide a valid Bangladeshi phone number (e.g., 01712345678)';
    }
    if (email && email.trim() && !EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please provide a valid email address';
    }
    if (!address || !address.trim()) {
      errors.address = 'Full address is required';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    let registrationId = generateRegistrationId();
    // Ensure uniqueness
    let exists = await Registration.findOne({ registrationId });
    while (exists) {
      registrationId = generateRegistrationId();
      exists = await Registration.findOne({ registrationId });
    }

    const newRecord = await Registration.create({
      registrationId,
      studentName: studentName.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      phone: phone ? phone.trim() : '',
      email: email ? email.trim() : '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender: gender || 'Other',
      address: address.trim(),
      status: 'Pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully!',
      registrationId: newRecord.registrationId,
      registration: {
        registrationId: newRecord.registrationId,
        studentName: newRecord.studentName,
        status: newRecord.status,
        createdAt: newRecord.createdAt,
      },
    });
  } catch (err) {
    console.error('Registration creation error:', err);
    res.status(500).json({ error: 'Server error while submitting registration' });
  }
}

async function listRegistrations(req, res) {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json({ total: registrations.length, registrations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
}

module.exports = {
  createRegistration,
  listRegistrations,
};
