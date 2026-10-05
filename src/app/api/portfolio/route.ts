import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { PortfolioModel } from '@/models/Portfolio';
import { SeedMarkerModel } from '@/models/SeedMarker';

const initialPortfolioList = [
  {
    id: 'port-101',
    scrizianId: 'SCR-8841',
    authorRole: 'Lead Architect',
    title: 'Lending Platform Re-architecture',
    description: 'Microservices migration for a US lending platform.',
    skills: ['Node.js', 'AWS', 'Kafka'],
    coverImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=70',
    isNdaProtected: true,
  },
  {
    id: 'port-102',
    scrizianId: 'SCR-2207',
    authorRole: 'Frontend Engineer',
    title: 'D2C Storefront on Next.js',
    description: 'Headless commerce storefront with 98 Lighthouse score.',
    skills: ['Next.js', 'Shopify', 'TypeScript'],
    coverImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70',
    isNdaProtected: false,
  },
  {
    id: 'port-103',
    scrizianId: 'SCR-3928',
    authorRole: 'Product Designer',
    title: 'B2B Analytics Design System',
    description: '120-component design system adopted by 4 product teams.',
    skills: ['Figma', 'Storybook'],
    coverImageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=70',
    isNdaProtected: false,
  },
  {
    id: 'port-104',
    scrizianId: 'SCR-4416',
    authorRole: 'Mobile Developer',
    title: 'Fitness Tracking Mobile App',
    description: 'Cross-platform app with wearable sync and offline mode.',
    skills: ['Flutter', 'Firebase'],
    coverImageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=70',
    isNdaProtected: false,
  },
  {
    id: 'port-105',
    scrizianId: 'SCR-6102',
    authorRole: 'DevOps Engineer',
    title: 'Zero-Downtime Kubernetes Platform',
    description: 'Multi-region GKE platform with GitOps deployments.',
    skills: ['GKE', 'ArgoCD', 'Terraform'],
    coverImageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=70',
    isNdaProtected: false,
  },
  {
    id: 'port-106',
    scrizianId: 'SCR-7719',
    authorRole: 'AI Engineer',
    title: 'Enterprise Document Q&A',
    description: 'RAG assistant over 2M documents with citations.',
    skills: ['Python', 'LangChain', 'Pinecone'],
    coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=70',
    isNdaProtected: true,
  },
];

export async function GET() {
  try {
    await connectToDatabase();

    const isSeeded = await SeedMarkerModel.findOne({ key: 'portfolio' });
    if (!isSeeded) {
      const existingCount = await PortfolioModel.countDocuments();
      if (existingCount === 0) {
        await PortfolioModel.insertMany(initialPortfolioList as any);
      }
      await SeedMarkerModel.create({ key: 'portfolio' });
    }

    const items = await PortfolioModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    console.error('MongoDB Portfolio GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const portId = body.id || `port-${Math.floor(100 + Math.random() * 900)}`;
    const newItem = await PortfolioModel.findOneAndUpdate(
      { id: portId },
      { ...body, id: portId },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: newItem });
  } catch (error: any) {
    console.error('MongoDB Portfolio POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Portfolio ID is required' }, { status: 400 });
    }

    await PortfolioModel.deleteOne({ id });
    return NextResponse.json({ success: true, message: 'Portfolio item deleted successfully' });
  } catch (error: any) {
    console.error('MongoDB Portfolio DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
