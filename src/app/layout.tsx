import './globals.css'
import type { Metadata } from 'next'
import { GeistSans, GeistMono } from '@/app/fonts'
import { ThemeProvider } from '@/components/ThemeProvider'
import { siteConfig } from '@/config/site'
import Footer from "@/components/Footer";
import NewsletterCard from "@/components/NewsletterCard";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased text-[#0E0D09] bg-[#F9F9F9] dark:text-[#B0B0B0] dark:bg-[#0E0D09] overflow-x-hidden">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <NewsletterCard />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
