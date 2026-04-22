import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { auth } from '@/lib/auth';
import Client from '@/models/Client';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.role || !['admin', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const clients = await Client.find()
      .select('-password -verificationToken -tokenExpiry -resetToken -resetTokenExpiry')
      .sort({ createdAt: -1 });
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Clients fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
