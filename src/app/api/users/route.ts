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

export async function GET() {
  try {
    await connectToDatabase();

    const isSeeded = await SeedMarkerModel.findOne({ key: 'users' });
    if (!isSeeded) {
      const existingCount = await UserModel.countDocuments();
      if (existingCount === 0) {
        await UserModel.insertMany(initialUsersList as any);
      }
      await SeedMarkerModel.create({ key: 'users' });
    }

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
    const body = await request.json();

    const userId = body.id || `user-${Math.floor(1000 + Math.random() * 9000)}`;
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: body.email },
      { ...body, id: userId },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error('MongoDB User POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
