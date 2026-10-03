import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TalentModel } from '@/models/Talent';
import { initialTalentList } from '@/utils/dataSync';

import { SeedMarkerModel } from '@/models/SeedMarker';

export async function GET() {
  try {
    await connectToDatabase();

    const isSeeded = await SeedMarkerModel.findOne({ key: 'talent' });
    if (!isSeeded) {
      const existingCount = await TalentModel.countDocuments();
      if (existingCount === 0) {
        await TalentModel.insertMany(initialTalentList as any);
      }
      await SeedMarkerModel.create({ key: 'talent' });
    }

    const talents = await TalentModel.find();
    return NextResponse.json({ success: true, data: talents });
  } catch (error: any) {
    console.error('MongoDB Talent Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const talentId = body.id || body.scrizianId || `SCR-${Math.floor(1000 + Math.random() * 9000)}`;
    const talentObj = {
      ...body,
      id: talentId,
      scrizianId: talentId,
      avatarText: talentId.replace(/[^0-9]/g, '').slice(-2) || '00'
    };

    const updated = await TalentModel.findOneAndUpdate(
      { $or: [{ id: talentId }, { scrizianId: talentId }] },
      talentObj,
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('MongoDB Talent Save Error:', error);
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

    await TalentModel.deleteOne({ $or: [{ id: id }, { scrizianId: id }] });
    return NextResponse.json({ success: true, message: 'Talent deleted successfully' });
  } catch (error: any) {
    console.error('MongoDB Delete Talent Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
