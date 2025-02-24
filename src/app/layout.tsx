import type { Metadata } from "next";
import { GeistMono, GeistSans } from "geist/font"
import { Newsreader } from 'next/font/google'
import "./globals.css";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/ThemeProvider";
import NewsletterCard from "@/components/NewsletterCard";

const newsreader = Newsreader({ 
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-newsreader',
})

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable} ${newsreader.variable}`}>
      <body className="font-sans antialiased text-base bg-[#f0efea] dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
          <NewsletterCard />
        </ThemeProvider>
      </body>
    </html>
  );
}
