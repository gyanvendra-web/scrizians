import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { LeadModel } from '@/models/Lead';
import { initialLeadsList } from '@/utils/dataSync';

import { SeedMarkerModel } from '@/models/SeedMarker';

export async function GET() {
  try {
    await connectToDatabase();
    const leads = await LeadModel.find();
    return NextResponse.json({ success: true, data: leads });
  } catch (error: any) {
    console.error('MongoDB Leads Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const leadId = body._id || body.id || `lead-${Date.now()}`;
    const newLead = {
      _id: leadId,
      name: body.name || 'Anonymous Inquiry',
      email: body.email || 'contact@client.com',
      phone: body.phone || '+1 (555) 000-0000',
      company: body.company || 'Enterprise Client',
      serviceRequested: body.serviceRequested || 'Talent Requirement Inquiry',
      scrizianIdReferenced: body.scrizianIdReferenced || 'N/A',
      stage: body.stage || 'New Inbound Lead',
      message: body.message || 'Inbound request submitted via website.',
      createdAt: body.createdAt || new Date().toISOString().split('T')[0]
    };

    const created = await LeadModel.create(newLead);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error('MongoDB Create Lead Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await LeadModel.deleteOne({ $or: [{ _id: id }, { id: id }] });
    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error: any) {
    console.error('MongoDB Delete Lead Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
