require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ Error: MONGO_URI is missing in .env');
    process.exit(1);
  }

  console.log(`⏳ Connecting to MongoDB Atlas...`);
  await mongoose.connect(mongoUri);
  console.log(`✅ Connected to MongoDB Atlas.`);

  console.log(`Checking admin account for: ${email}`);
  const existing = await Admin.findOne({ email });

  if (existing) {
    console.log(`ℹ️ Admin account already exists for ${email}. No action needed.`);
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
      role: 'admin',
    });
    console.log(`✅ Initial admin account created successfully in MongoDB Atlas!`);
    console.log(`Email: ${newAdmin.email}`);
    console.log(`Password: ${password}`);
  }

  await mongoose.disconnect();
  console.log(`🔌 Disconnected from MongoDB Atlas.`);
}

seedAdmin().catch((err) => {
  console.error('❌ Failed to seed admin in MongoDB:', err);
  process.exit(1);
});
