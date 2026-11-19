const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { registrations: [], admins: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data || '{"registrations":[],"admins":[]}');
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { registrations: [], admins: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

module.exports = {
  getRegistrations() {
    return readDb().registrations;
  },
  saveRegistration(reg) {
    const db = readDb();
    db.registrations.unshift(reg);
    writeDb(db);
    return reg;
  },
  updateRegistration(id, updateData) {
    const db = readDb();
    const index = db.registrations.findIndex(r => r.registrationId === id || r.id === id);
    if (index === -1) return null;
    db.registrations[index] = { ...db.registrations[index], ...updateData, updatedAt: new Date() };
    writeDb(db);
    return db.registrations[index];
  },
  deleteRegistration(id) {
    const db = readDb();
    const index = db.registrations.findIndex(r => r.registrationId === id || r.id === id);
    if (index === -1) return false;
    db.registrations.splice(index, 1);
    writeDb(db);
    return true;
  },
  getAdmins() {
    return readDb().admins;
  },
  findAdminByEmail(email) {
    if (!email) return null;
    return readDb().admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  },
  saveAdmin(admin) {
    const db = readDb();
    db.admins.push(admin);
    writeDb(db);
    return admin;
  }
};
