import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SpazaBudget',
  description: 'AI-powered budget management and space-to-cash analysis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
