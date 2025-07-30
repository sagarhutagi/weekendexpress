import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Weekend Express - Your Weekend Learning Companion',
  description: 'Discover and join online workshops and live sessions on technology, art, wellness, and business. Learn new skills on your schedule.',
  openGraph: {
    title: 'Weekend Express - Your Weekend Learning Companion',
    description: 'Discover and join online workshops and live sessions on technology, art, wellness, and business. Learn new skills on your schedule.',
    url: 'https://weekend-express.app',
    siteName: 'Weekend Express',
    images: [
      {
        url: 'https://placehold.co/1200x630.png', // Replace with a proper OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weekend Express - Your Weekend Learning Companion',
    description: 'Discover and join online workshops and live sessions on technology, art, wellness, and business. Learn new skills on your schedule.',
    images: ['https://placehold.co/1200x630.png'], // Replace with a proper Twitter card image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
