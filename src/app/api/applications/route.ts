import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ApplicationModel } from '@/models/Application';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDatabase();
    const apps = await ApplicationModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: apps });
  } catch (error: any) {
    console.error('MongoDB Applications GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const appId = body.id || `app-${Math.floor(1000 + Math.random() * 9000)}`;
    const application = await ApplicationModel.create({
      id: appId,
      jobId: body.jobId || 'general-application',
      jobTitle: body.jobTitle || 'General Application',
      applicantName: body.applicantName || 'Anonymous Applicant',
      applicantEmail: body.applicantEmail,
      applicantPhone: body.applicantPhone || 'N/A',
      scrizianId: body.scrizianId || 'N/A',
      resumeUrl: body.resumeUrl || 'N/A',
      status: body.status || 'Received',
    });

    return NextResponse.json({ success: true, data: application });
  } catch (error: any) {
    console.error('MongoDB Application POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Application ID is required' }, { status: 400 });
    }

    await ApplicationModel.deleteOne({ id });
    return NextResponse.json({ success: true, message: 'Application deleted successfully' });
  } catch (error: any) {
    console.error('MongoDB Application DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
