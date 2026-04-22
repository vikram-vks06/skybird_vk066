import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import Providers from '@/components/Providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Sky Birds — Corporate Travel, Simplified',
  description: 'Sky Birds handles end-to-end corporate travel — flights, hotels, local transport, and sightseeing — with customized itineraries and fully transparent pricing for businesses.',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}