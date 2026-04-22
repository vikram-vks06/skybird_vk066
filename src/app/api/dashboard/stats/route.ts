import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { auth } from '@/lib/auth';
import Contact from '@/models/Contact';
import Testimonial from '@/models/Testimonial';
import Destination from '@/models/Destination';
import Service from '@/models/Service';
import Booking from '@/models/Booking';
import Client from '@/models/Client';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.role || !['admin', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [totalContacts, unreadContacts, totalTestimonials, totalDestinations, totalServices, totalBookings, totalClients, recentContacts, recentBookings] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Testimonial.countDocuments({ isActive: true }),
      Destination.countDocuments({ isActive: true }),
      Service.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Client.countDocuments(),
      Contact.find().sort({ createdAt: -1 }).limit(5),
      Booking.find().populate('clientId', 'name email').sort({ createdAt: -1 }).limit(5),
    ]);

    return NextResponse.json({
      stats: {
        totalContacts,
        unreadContacts,
        totalTestimonials,
        totalDestinations,
        totalServices,
        totalBookings,
        totalClients,
      },
      recentContacts,
      recentBookings,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
