import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Fira_Code } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { AdminProvider } from '@/components/AdminContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-code',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vandan Patel | AI & Data Science Engineer',
  description:
    'Portfolio of Vandan Patel - AI & Data Science Engineer specializing in LLMs, RAG pipelines, AI agents, deep learning, and full-stack web solutions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${firaCode.variable}`}>
      <body id="top">
        <AdminProvider>
          <Navbar />
          <main className="page-content">{children}</main>
          <Footer />
          <Chatbot />
        </AdminProvider>
      </body>
    </html>
  );
}
