import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { BackgroundBlobs } from '@/components/layout/BackgroundBlobs'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/theme-provider'
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
    'AI systems and agent engineer. I build autonomous agents, RAG pipelines, and the backends that run them in production.',
  openGraph: {
    title: 'Saif Alqdessi – AI Engineer',
    description: 'I build autonomous AI agents, RAG pipelines, and the backends that run them.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="w-full overflow-x-hidden bg-bg-base text-text-primary font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <BackgroundBlobs />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
