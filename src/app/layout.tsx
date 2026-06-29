import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { BackgroundBlobs } from '@/components/layout/BackgroundBlobs'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Saif Alqdessi – AI Engineer',
  description:
    'AI Systems & Agent Engineer building autonomous AI solutions, intelligent agents, and scalable architectures.',
  openGraph: {
    title: 'Saif Alqdessi – AI Engineer',
    description: 'AI Systems & Agent Engineer building autonomous AI solutions.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg-base text-text-primary font-sans antialiased">
        <BackgroundBlobs />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
