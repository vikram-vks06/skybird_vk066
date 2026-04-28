import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="bg-bg space-y-6 px-4 md:px-6 pb-6 pt-28">
        {/* Hero-style section */}
        <section className="relative w-full max-w-7xl mx-auto min-h-[60vh] rounded-5xl overflow-hidden group mb-10" style={{ minHeight: '60vh' }}>
          {/* Background image */}
          <div className="absolute inset-0">
            <AppImage
              src="https://images.unsplash.com/photo-1634018877917-4381815e0747"
              alt="Aerial view of clouds from aircraft window, bright daylight, blue sky, white cloud formations, calm and expansive atmosphere"
              fill
              priority
              className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              sizes="100vw"
            />
          </div>
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/30 to-navy/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/50 via-transparent to-transparent" />
          {/* Centered heading card */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full py-24">
            <div className="bg-white/90 rounded-3xl shadow-card px-8 py-10 max-w-2xl w-full text-center backdrop-blur-md border border-white/60">
              <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4">Privacy Policy</h1>
              <p className="text-navy/60 text-lg">How we protect your information and respect your privacy.</p>
            </div>
          </div>
        </section>
        <section className="max-w-3xl mx-auto py-8 px-4 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold mt-8 mb-2">Information We Collect</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Personal information you provide (name, email, etc.)</li>
            <li>Usage data and cookies</li>
            <li>Payment and transaction details</li>
          </ul>
          <h2 className="text-xl font-semibold mt-8 mb-2">How We Use Information</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>To provide and improve our services</li>
            <li>To process payments and bookings</li>
            <li>To communicate with you</li>
            <li>To comply with legal obligations</li>
          </ul>
          <h2 className="text-xl font-semibold mt-8 mb-2">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:admin@skybirds.in" className="text-blue-600 underline">admin@skybirds.in</a>.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
