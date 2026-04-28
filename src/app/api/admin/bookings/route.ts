import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Client from '@/models/Client';
import Booking from '@/models/Booking';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role || !['admin', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    // Find or create client by email
    let client = await Client.findOne({ email: data.email });
    if (!client) {
      client = await Client.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: Math.random().toString(36).slice(-8), // random password
        isVerified: true,
      });
    }

    // Create booking
    const booking = await Booking.create({
      clientId: client._id,
      destination: data.destination,
      travelDate: new Date(), // TODO: add travelDate to form
      returnDate: new Date(), // TODO: add returnDate to form
      travelers: data.members,
      services: data.bookingTypes,
      totalAmount: data.bookingAmount,
      notes: data.description,
      status: 'pending',
      paymentStatus: 'pending',
      attachments: data.attachments || [],
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Admin booking create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
