import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { auth } from '@/lib/auth';
import { saveUploadedImage } from '@/lib/upload';

export async function GET(req: NextRequest) {
  try {
    const showAll = req.nextUrl.searchParams.get('all') === '1';

    if (showAll) {
      const session = await auth();
      if (!session?.user?.role || !['admin', 'superadmin'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    await connectDB();
    const destinations = await Destination.find(showAll ? {} : { isActive: true }).sort({ order: 1, createdAt: -1 });
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

    const contentType = req.headers.get('content-type') || '';
    let data: Record<string, unknown>;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const image = formData.get('image');
      let imageUrl = String(formData.get('imageUrl') || '').trim();

      if (image instanceof File && image.size > 0) {
        imageUrl = await saveUploadedImage(image, 'destinations');
      }

      data = {
        city: String(formData.get('city') || ''),
        country: String(formData.get('country') || ''),
        tagline: String(formData.get('tagline') || ''),
        imageUrl,
        accentColor: String(formData.get('accentColor') || '#4F8BD2'),
        tag: String(formData.get('tag') || ''),
        isActive: String(formData.get('isActive') || 'true') === 'true',
        order: Number(formData.get('order') || 0),
      };
    } else {
      data = await req.json();
    }

    await connectDB();
    const destination = await Destination.create(data);
    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error('Destination create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
