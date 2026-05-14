import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Review Reply Bot — Streamline Your Online Reputation',
  description: 'The Review Reply Bot empowers small to medium e-commerce and local business owners to quickly intake customer reviews, generate brand-aligned replies, and manage their reply queue from a central dashboard, ready for export.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-50 antialiased`}>
        {/* Demo Mode Banner */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900 text-zinc-100 text-xs px-4 py-2 flex justify-between items-center">
          <span className="font-medium">⚡ Demo Mode — Review Reply Bot · Built with NEXUS OS</span>
          <a href="/dashboard" className="text-blue-300 hover:underline">
            Open Dashboard →
          </a>
        </div>
        <div className="pt-9"> {/* Offset for the fixed demo banner */}
          {children}
        </div>
      </body>
    </html>
  );
}