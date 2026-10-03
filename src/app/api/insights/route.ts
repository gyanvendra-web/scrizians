import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { InsightModel } from '@/models/Insight';
import { initialArticlesList } from '@/utils/dataSync';

import { SeedMarkerModel } from '@/models/SeedMarker';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Check if collection was ever seeded
    const isSeeded = await SeedMarkerModel.findOne({ key: 'insights' });
    if (!isSeeded) {
      const existingCount = await InsightModel.countDocuments();
      if (existingCount === 0) {
        await InsightModel.insertMany(initialArticlesList as any);
      }
      await SeedMarkerModel.create({ key: 'insights' });
    }

    const insights = await InsightModel.find();
    return NextResponse.json({ success: true, data: insights });
  } catch (error: any) {
    console.error('MongoDB Insights Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const insightId = body.id || `art-${Date.now()}`;
    const insightObj = {
      ...body,
      id: insightId,
      coverImageUrl: body.coverImageUrl || body.image || '/images/logo.png',
      image: body.coverImageUrl || body.image || '/images/logo.png'
    };

    const updated = await InsightModel.findOneAndUpdate(
      { id: insightId },
      insightObj,
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('MongoDB Insight Save Error:', error);
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

    await InsightModel.deleteOne({ id: id });
    return NextResponse.json({ success: true, message: 'Insight deleted successfully' });
  } catch (error: any) {
    console.error('MongoDB Delete Insight Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
