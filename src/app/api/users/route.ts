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
];

async function ensureSeeded() {
  try {
    const adminExists = await UserModel.findOne({ role: 'admin' });
    if (!adminExists) {
      await UserModel.create(initialUsersList[0] as any);
      console.log('✅ Auto-seeded default Super Admin account');
    }
  } catch (e) {
    console.warn('Auto-seed check skipped/failed:', e);
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      if (body.password) existingUser.password = body.password;
      existingUser.role = body.role || existingUser.role;
      if (body.scrizianId) existingUser.scrizianId = body.scrizianId;
      if (body.company !== undefined) existingUser.company = body.company;
      if (body.phone !== undefined) existingUser.phone = body.phone;
      if (body.title !== undefined) existingUser.title = body.title;
      if (body.bio !== undefined) existingUser.bio = body.bio;
      if (body.skills !== undefined) existingUser.skills = body.skills;
      if (body.experience !== undefined) existingUser.experience = body.experience;
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
      phone: body.phone || '',
      title: body.title || '',
      bio: body.bio || '',
      skills: body.skills || '',
      experience: body.experience || '',
    });

    console.log(`✅ Registered new user in MongoDB Atlas: ${newUser.email} (${newUser.role})`);

    return NextResponse.json({ success: true, data: newUser, message: 'Account created successfully in database' });
  } catch (error: any) {
    console.error('MongoDB User POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
