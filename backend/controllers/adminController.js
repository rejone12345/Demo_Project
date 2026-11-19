const mongoose = require('mongoose');
const Registration = require('../models/Registration');

// GET /api/admin/dashboard/stats
async function getDashboardStats(req, res) {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ status: 'Pending' }),
      Registration.countDocuments({ status: 'Approved' }),
      Registration.countDocuments({ status: 'Rejected' }),
    ]);

    res.json({
      total,
      pending,
      approved,
      rejected,
    });
  } catch (err) {
    console.error('Stats fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
}

// GET /api/admin/registrations (with search, filter, pagination)
async function getAdminRegistrations(req, res) {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const query = {};

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Search by student name, phone, or reference ID
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { studentName: regex },
        { phone: regex },
        { registrationId: regex },
        { email: regex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const [total, registrations] = await Promise.all([
      Registration.countDocuments(query),
      Registration.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    ]);

    res.json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      registrations,
    });
  } catch (err) {
    console.error('Registrations fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
}

// Helper to find by MongoDB ObjectId or registrationId
function findQuery(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { registrationId: id }] };
  }
  return { registrationId: id };
}

// GET /api/admin/registrations/:id
async function getRegistrationById(req, res) {
  try {
    const found = await Registration.findOne(findQuery(req.params.id));
    if (!found) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json(found);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registration' });
  }
}

// PUT /api/admin/registrations/:id
async function updateRegistrationDetails(req, res) {
  try {
    const updated = await Registration.findOneAndUpdate(
      findQuery(req.params.id),
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json({ message: 'Registration updated successfully', registration: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update registration' });
  }
}

// PATCH /api/admin/registrations/:id/status
async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be Pending, Approved, or Rejected.' });
    }

    const updated = await Registration.findOneAndUpdate(
      findQuery(req.params.id),
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json({ message: `Registration ${status.toLowerCase()} successfully`, registration: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
}

// DELETE /api/admin/registrations/:id
async function removeRegistration(req, res) {
  try {
    const deleted = await Registration.findOneAndDelete(findQuery(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json({ message: 'Registration deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete registration' });
  }
}

// GET /api/admin/registrations/export (CSV)
async function exportCSV(req, res) {
  try {
    const list = await Registration.find().sort({ createdAt: -1 });
    const headers = [
      'Registration ID',
      'Student Name',
      "Father's Name",
      "Mother's Name",
      'Phone',
      'Email',
      'Gender',
      'Address',
      'Status',
      'Submitted At',
    ];

    const rows = list.map((r) => [
      `"${r.registrationId || ''}"`,
      `"${(r.studentName || '').replace(/"/g, '""')}"`,
      `"${(r.fatherName || '').replace(/"/g, '""')}"`,
      `"${(r.motherName || '').replace(/"/g, '""')}"`,
      `"${r.phone || ''}"`,
      `"${r.email || ''}"`,
      `"${r.gender || ''}"`,
      `"${(r.address || '').replace(/"/g, '""')}"`,
      `"${r.status || ''}"`,
      `"${r.createdAt ? new Date(r.createdAt).toISOString() : ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="student_registrations.csv"');
    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export registrations to CSV' });
  }
}

module.exports = {
  getDashboardStats,
  getAdminRegistrations,
  getRegistrationById,
  updateRegistrationDetails,
  updateStatus,
  removeRegistration,
  exportCSV,
};
