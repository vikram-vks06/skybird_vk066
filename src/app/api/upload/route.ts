import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedImage } from '@/lib/upload';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'booking';
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    // Save file to /public/assets/upload/booking
    const url = await saveUploadedImage(file, type.toString());
    return NextResponse.json({ url });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
