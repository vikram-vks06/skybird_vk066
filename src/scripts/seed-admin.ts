// Run: npx ts-node --compiler-options '{"module":"commonjs"}' src/scripts/seed-admin.ts
// Or add to package.json: "seed:admin": "npx tsx src/scripts/seed-admin.ts"

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skybirds';

async function seedAdmin() {
  await mongoose.connect(MONGODB_URI);

  const AdminSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now },
  });

  const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

  const existing = await Admin.findOne({ email: 'admin@skybirds.in' });
  if (existing) {
    console.log('Admin already exists');
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  await Admin.create({
    name: 'Sky Birds Admin',
    email: 'admin@skybirds.in',
    password: hashedPassword,
    role: 'superadmin',
  });

  console.log('Admin created successfully!');
  console.log('Email: admin@skybirds.in');
  console.log('Password: Admin@123');
  console.log('⚠️  Change this password after first login!');

  await mongoose.disconnect();
}

seedAdmin().catch(console.error);
