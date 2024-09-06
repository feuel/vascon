import './global.css';
import { Inter } from 'next/font/google';

export const metadata = {
  title: 'Vend',
  description: 'Save coins, make purchases',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
