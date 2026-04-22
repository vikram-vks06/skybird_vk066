import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const destinations = await Destination.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(destinations);
  } catch (error) {
    console.error('Destinations fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
    const destination = await Destination.create(data);
    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error('Destination create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
