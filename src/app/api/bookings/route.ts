import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    if (['admin', 'superadmin'].includes(session.user.role)) {
      const bookings = await Booking.find().populate('clientId', 'name email company').sort({ createdAt: -1 });
      return NextResponse.json(bookings);
    }

    const bookings = await Booking.find({ clientId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    const booking = await Booking.create({
      ...data,
      clientId: session.user.id,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Booking create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
