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

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    // Auto-seed default 5 portal users into MongoDB if not present
    const isSeeded = await SeedMarkerModel.findOne({ key: 'users' });
    if (!isSeeded) {
      const existingCount = await UserModel.countDocuments();
      if (existingCount === 0) {
        await UserModel.insertMany(initialUsersList as any);
      }
      await SeedMarkerModel.create({ key: 'users' });
    }

    const { email, password, role } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email address is required' }, { status: 400 });
    }

    // Query user in MongoDB
    let user = await UserModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Create user on-the-fly in MongoDB for new credentials
      const newUserId = `${role || 'user'}-${Date.now()}`;
      user = await UserModel.create({
        id: newUserId,
        name: email.split('@')[0],
        email: email.toLowerCase().trim(),
        password: password || 'Default@123',
        role: role || 'candidate',
        scrizianId: `SZN-${(role || 'USER').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }

    // Verify role or fallback
    const authenticatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      scrizianId: user.scrizianId,
      company: user.company,
    };

    const token = `token_${user.role}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      data: authenticatedUser,
      token,
      message: `Login successful for ${user.name}`,
    });
  } catch (error: any) {
    console.error('MongoDB Login Authentication Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
