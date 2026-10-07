import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { LeadModel } from '@/models/Lead';
import { initialLeadsList } from '@/utils/dataSync';

import { SeedMarkerModel } from '@/models/SeedMarker';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDatabase();
    const leads = await LeadModel.find();
    const sortedLeads = [...leads].sort((a: any, b: any) => {
      const getTimestamp = (item: any) => {
        if (item._id && typeof item._id === 'string' && item._id.startsWith('lead-')) {
          const num = parseInt(item._id.replace('lead-', ''), 10);
          if (!isNaN(num)) return num;
        }
        if (item.createdAt) {
          const t = new Date(item.createdAt).getTime();
          if (!isNaN(t)) return t;
        }
        return 0;
      };
      return getTimestamp(b) - getTimestamp(a);
    });
    return NextResponse.json({ success: true, data: sortedLeads });
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
      createdAt: body.createdAt || new Date().toISOString()
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
