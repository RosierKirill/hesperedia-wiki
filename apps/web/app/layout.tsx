import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Hesperedia Wiki',
    template: '%s | Hesperedia Wiki',
  },
  description: "L'encyclopédie complète de l'univers Hesperedia — personnages, créatures, lore, carte interactive.",
  keywords: ['Hesperedia', 'wiki', 'fantasy', 'lore', 'personnages', 'créatures'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Hesperedia Wiki',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
