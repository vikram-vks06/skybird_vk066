import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import Client from '@/models/Client';
import { sendEmail, resetPasswordEmailTemplate } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();
    const client = await Client.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!client) {
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    client.resetToken = resetToken;
    client.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await client.save();

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:4028';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email.toLowerCase())}`;

    try {
      await sendEmail({
        to: email,
        subject: 'Reset your Sky Birds password',
        html: resetPasswordEmailTemplate(client.name, resetUrl),
      });
    } catch {
      // Email sending failed
    }

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
