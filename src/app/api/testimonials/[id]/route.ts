import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { auth } from '@/lib/auth';
import { deleteUploadedImageIfLocal, saveUploadedImage } from '@/lib/upload';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Testimonial fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.role || !['admin', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const contentType = req.headers.get('content-type') || '';
    let data: Record<string, unknown>;

    await connectDB();
    const existing = await Testimonial.findById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const image = formData.get('image');
      let imageUrl = String(formData.get('imageUrl') || existing.imageUrl || '').trim();

      if (image instanceof File && image.size > 0) {
        imageUrl = await saveUploadedImage(image, 'testimonials');
      }

      data = {
        name: String(formData.get('name') || existing.name),
        role: String(formData.get('role') || existing.role),
        company: String(formData.get('company') || existing.company),
        quote: String(formData.get('quote') || existing.quote),
        imageUrl,
        accentColor: String(formData.get('accentColor') || existing.accentColor || '#4F8BD2'),
        isActive: String(formData.get('isActive') || String(existing.isActive)) === 'true',
        order: Number(formData.get('order') || existing.order || 0),
      };
    } else {
      data = await req.json();
    }

    const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true });
    if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const nextImageUrl = typeof data.imageUrl === 'string' ? data.imageUrl : '';
    if (nextImageUrl && nextImageUrl !== existing.imageUrl) {
      await deleteUploadedImageIfLocal(existing.imageUrl);
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Testimonial update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.role || !['admin', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const existing = await Testimonial.findById(id);
    await Testimonial.findByIdAndDelete(id);
    if (existing?.imageUrl) {
      await deleteUploadedImageIfLocal(existing.imageUrl);
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Testimonial delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
