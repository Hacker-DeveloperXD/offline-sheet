import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter for a clean sans-serif font
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // For notifications
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans', // Keep variable name for compatibility if Geist was intended
});

export const metadata: Metadata = {
  title: 'OfflineSheet',
  description: 'Powerful offline spreadsheet application.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "antialiased min-h-screen flex flex-col")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
