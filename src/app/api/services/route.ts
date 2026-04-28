import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Service from '@/models/Service';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(services);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Services fetch error:', error.message, error.stack);
      return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    } else {
      console.error('Services fetch error:', error);
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || !['admin', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();
    const service = await Service.create(data);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Service create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
