import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
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
    const testimonials = await Testimonial.find(showAll ? {} : { isActive: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Testimonials fetch error:', error);
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
        imageUrl = await saveUploadedImage(image, 'testimonials');
      }

      data = {
        name: String(formData.get('name') || ''),
        role: String(formData.get('role') || ''),
        company: String(formData.get('company') || ''),
        quote: String(formData.get('quote') || ''),
        imageUrl,
        accentColor: String(formData.get('accentColor') || '#4F8BD2'),
        isActive: String(formData.get('isActive') || 'true') === 'true',
        order: Number(formData.get('order') || 0),
      };
    } else {
      data = await req.json();
    }

    await connectDB();
    const testimonial = await Testimonial.create(data);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Testimonial create error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
