import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'GitHub Atlas', description: 'Find the Student Pack tools that fit your path.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }


