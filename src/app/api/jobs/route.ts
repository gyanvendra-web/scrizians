import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { JobModel } from '@/models/Job';
import { initialJobsList } from '@/utils/dataSync';

import { SeedMarkerModel } from '@/models/SeedMarker';

export async function GET() {
  try {
    await connectToDatabase();

    const isSeeded = await SeedMarkerModel.findOne({ key: 'jobs' });
    if (!isSeeded) {
      const existingCount = await JobModel.countDocuments();
      if (existingCount === 0) {
        await JobModel.insertMany(initialJobsList as any);
      }
      await SeedMarkerModel.create({ key: 'jobs' });
    }

    const jobs = await JobModel.find();
    return NextResponse.json({ success: true, data: jobs });
  } catch (error: any) {
    console.error('MongoDB Jobs Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const jobId = body.id || `job-${Date.now()}`;
    const jobObj = {
      ...body,
      id: jobId,
      slug: body.slug || jobId
    };

    const updated = await JobModel.findOneAndUpdate(
      { id: jobId },
      jobObj,
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('MongoDB Job Save Error:', error);
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

    await JobModel.deleteOne({ $or: [{ id: id }, { slug: id }] });
    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error: any) {
    console.error('MongoDB Delete Job Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
