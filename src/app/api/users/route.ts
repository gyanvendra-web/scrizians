import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserModel } from '@/models/User';
import { SeedMarkerModel } from '@/models/SeedMarker';

const initialUsersList = [
  {
    id: 'admin-101',
    name: 'Scriza Super Admin',
    email: 'admin@scrizians.com',
    password: 'Admin@123456',
    role: 'admin',
    scrizianId: 'SZN-ADMIN-00001',
    company: 'Scriza Private Limited',
  },
  {
    id: 'talent-101',
    name: 'Aarav M. (Senior Architect)',
    email: 'talent@scrizians.com',
    password: 'Talent@123456',
    role: 'talent',
    scrizianId: 'SZN-DEV-00001',
    company: 'Scrizians Talent Network',
  },
  {
    id: 'client-101',
    name: 'Michael R. (VP Engineering)',
    email: 'client@scrizians.com',
    password: 'Client@123456',
    role: 'client',
    scrizianId: 'SZN-CLIENT-00001',
    company: 'CloudScale Inc (USA)',
  },
  {
    id: 'contributor-101',
    name: 'Technical Contributor Desk',
    email: 'contributor@scrizians.com',
    password: 'Contributor@123456',
    role: 'contributor',
    scrizianId: 'SZN-CONTRIB-00001',
    company: 'Scrizians Editorial Desk',
  },
  {
    id: 'candidate-101',
    name: 'Aarav Sharma (Candidate)',
    email: 'candidate@scrizians.com',
    password: 'Candidate@123456',
    role: 'candidate',
    scrizianId: 'SZN-CAND-00001',
    company: 'Candidate Pool',
  },
];

async function ensureSeeded() {
  try {
    const isSeeded = await SeedMarkerModel.findOne({ key: 'users' });
    if (!isSeeded) {
      const existingCount = await UserModel.countDocuments();
      if (existingCount === 0) {
        await UserModel.insertMany(initialUsersList as any);
      }
      await SeedMarkerModel.create({ key: 'users' });
    }
  } catch (e) {
    console.warn('Auto-seed check skipped/failed:', e);
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    await ensureSeeded();
    const users = await UserModel.find().select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error('MongoDB Users GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    await ensureSeeded();

    const body = await request.json();
    const email = body.email ? body.email.toLowerCase().trim() : '';

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email address is required' }, { status: 400 });
    }

    let existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      existingUser.name = body.name || existingUser.name;
      existingUser.password = body.password || existingUser.password;
      existingUser.role = body.role || existingUser.role;
      if (body.scrizianId) existingUser.scrizianId = body.scrizianId;
      if (body.company) existingUser.company = body.company;
      await existingUser.save();
      return NextResponse.json({ success: true, data: existingUser, message: 'User profile updated' });
    }

    const userId = body.id || `user-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newUser = await UserModel.create({
      id: userId,
      name: body.name || email.split('@')[0],
      email,
      password: body.password || 'Default@123',
      role: body.role || 'candidate',
      scrizianId: body.scrizianId || `SZN-${(body.role || 'CAND').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      company: body.company || 'Scrizians Platform',
    });

    console.log(`✅ Registered new user in MongoDB Atlas: ${newUser.email} (${newUser.role})`);

    return NextResponse.json({ success: true, data: newUser, message: 'Account created successfully in database' });
  } catch (error: any) {
    console.error('MongoDB User POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
