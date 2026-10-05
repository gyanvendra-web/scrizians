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
      return NextResponse.json({
        success: false,
        error: 'Account not found in database. Please register a new account on the register page first.'
      }, { status: 404 });
    }

    if (password && user.password && user.password !== password) {
      return NextResponse.json({
        success: false,
        error: 'Incorrect password. Please try again or reset your password.'
      }, { status: 401 });
    }

    const authenticatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      scrizianId: user.scrizianId,
      company: user.company,
      phone: user.phone,
      title: user.title,
      skills: user.skills,
      experience: user.experience
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
