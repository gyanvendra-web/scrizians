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

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    // Auto-seed default Super Admin if not present
    const adminExists = await UserModel.findOne({ role: 'admin' });
    if (!adminExists) {
      await UserModel.create(initialUsersList[0] as any);
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
