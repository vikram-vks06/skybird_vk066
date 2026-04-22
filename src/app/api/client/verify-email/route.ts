import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Client from '@/models/Client';

export async function POST(req: NextRequest) {
  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return NextResponse.json({ error: 'Token and email are required' }, { status: 400 });
    }

    await connectDB();

    const client = await Client.findOne({
      email: email.toLowerCase(),
      verificationToken: token,
      tokenExpiry: { $gt: new Date() },
    });

    if (!client) {
      return NextResponse.json({ error: 'Invalid or expired verification link' }, { status: 400 });
    }

    client.isVerified = true;
    client.verificationToken = null;
    client.tokenExpiry = null;
    await client.save();

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
