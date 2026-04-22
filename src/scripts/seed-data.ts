import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/skybirds';

async function seedData() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Testimonials
  const TestimonialSchema = new mongoose.Schema({
    name: String, role: String, company: String, quote: String, imageUrl: String,
    accentColor: String, isActive: { type: Boolean, default: true }, order: Number,
    createdAt: { type: Date, default: Date.now },
  });
  const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
  const tCount = await Testimonial.countDocuments();
  if (tCount === 0) {
    await Testimonial.insertMany([
      { name: 'Rahul Mehta', role: 'VP Operations', company: 'Tata Consultancy Services', quote: 'Sky Birds cut our travel spend by 22% in the first quarter — without reducing comfort.', imageUrl: '', accentColor: '#E8A020', isActive: true, order: 1 },
      { name: 'Priya Nair', role: 'Head of HR & Admin', company: 'Infosys BPM', quote: 'We manage travel for 300+ employees. Sky Birds assigned us a dedicated coordinator. Genuinely seamless.', imageUrl: '', accentColor: '#2A7FD4', isActive: true, order: 2 },
      { name: 'Arjun Krishnamurthy', role: 'Managing Director', company: 'Mahindra Logistics', quote: 'Three international conferences, six cities, forty delegates — Sky Birds handled it all without a single escalation.', imageUrl: '', accentColor: '#E8A020', isActive: true, order: 3 },
    ]);
    console.log('✓ Testimonials seeded');
  } else { console.log('• Testimonials already exist'); }

  // Destinations
  const DestinationSchema = new mongoose.Schema({
    city: String, country: String, tagline: String, imageUrl: String,
    accentColor: String, tag: String, isActive: { type: Boolean, default: true }, order: Number,
    createdAt: { type: Date, default: Date.now },
  });
  const Destination = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
  const dCount = await Destination.countDocuments();
  if (dCount === 0) {
    await Destination.insertMany([
      { city: 'Dubai', country: 'UAE', tagline: 'MICE, incentive travel, and luxury corporate retreats.', imageUrl: 'https://images.unsplash.com/photo-1603632633851-561a1b08da15', accentColor: '#E8A020', tag: 'Top Booked', isActive: true, order: 1 },
      { city: 'Singapore', country: 'Asia-Pacific', tagline: 'Conference hubs, fintech corridors, and seamless transit.', imageUrl: '', accentColor: '#2A7FD4', tag: 'Business Hub', isActive: true, order: 2 },
      { city: 'Mumbai', country: 'India', tagline: 'Financial capital — seamless domestic corporate travel.', imageUrl: '', accentColor: '#F0B830', tag: 'Domestic', isActive: true, order: 3 },
      { city: 'London', country: 'United Kingdom', tagline: 'European business travel, conferences, and client meetings.', imageUrl: 'https://images.unsplash.com/photo-1648476871040-47da9bfc67a4', accentColor: '#FFFFFF', tag: 'International', isActive: true, order: 4 },
    ]);
    console.log('✓ Destinations seeded');
  } else { console.log('• Destinations already exist'); }

  // Services
  const ServiceSchema = new mongoose.Schema({
    icon: String, title: String, description: String, tag: String,
    colSpan: { type: Number, default: 1 }, isActive: { type: Boolean, default: true }, order: Number,
    createdAt: { type: Date, default: Date.now },
  });
  const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
  const sCount = await Service.countDocuments();
  if (sCount === 0) {
    await Service.insertMany([
      { icon: 'TicketIcon', title: 'Flight Ticketing', description: 'Domestic and international bookings at competitive fares. Multi-city, open-jaw, and corporate account rates available.', tag: 'Air Travel', colSpan: 1, isActive: true, order: 1 },
      { icon: 'BuildingOffice2Icon', title: 'Hotel Booking', description: 'Curated stays from business hotels to luxury resorts — pre-negotiated corporate rates across 80+ cities.', tag: 'Accommodation', colSpan: 1, isActive: true, order: 2 },
      { icon: 'TruckIcon', title: 'Local Transport', description: 'Airport transfers, inter-city cabs, chauffeur services, and coach hire — coordinated seamlessly with your itinerary.', tag: 'Ground Mobility', colSpan: 2, isActive: true, order: 3 },
      { icon: 'MapIcon', title: 'Sightseeing & Tours', description: 'Guided excursions, cultural experiences, and leisure extensions built around your business schedule.', tag: 'Experiences', colSpan: 2, isActive: true, order: 4 },
      { icon: 'DocumentCheckIcon', title: 'Visa Assistance', description: 'End-to-end visa documentation support for 50+ countries. Express processing for urgent corporate travel.', tag: 'Documentation', colSpan: 1, isActive: true, order: 5 },
      { icon: 'PhoneArrowUpRightIcon', title: '24/7 Support', description: 'Dedicated travel desk reachable around the clock. Real humans, not bots — because corporate travel never sleeps.', tag: 'Always On', colSpan: 1, isActive: true, order: 6 },
    ]);
    console.log('✓ Services seeded');
  } else { console.log('• Services already exist'); }

  // Create empty collections for contacts, bookings, payments, clients
  const db = mongoose.connection.db!;
  const existing = (await db.listCollections().toArray()).map(c => c.name);
  for (const name of ['contacts', 'bookings', 'payments', 'clients']) {
    if (!existing.includes(name)) {
      await db.createCollection(name);
      console.log(`✓ Collection '${name}' created`);
    } else {
      console.log(`• Collection '${name}' already exists`);
    }
  }

  console.log('\n✅ All collections ready!');
  await mongoose.disconnect();
}

seedData().catch(console.error);
