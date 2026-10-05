import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { AuditLogModel } from '@/models/AuditLog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDatabase();
    const logs = await AuditLogModel.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    console.error('MongoDB Audit Logs GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const logId = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const log = await AuditLogModel.create({
      id: logId,
      action: body.action || 'SYSTEM_EVENT',
      category: body.category || 'General',
      actorEmail: body.actorEmail || 'system@scrizians.com',
      details: body.details || 'System event triggered',
      ipAddress: body.ipAddress || '127.0.0.1',
    });

    return NextResponse.json({ success: true, data: log });
  } catch (error: any) {
    console.error('MongoDB Audit Log POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
