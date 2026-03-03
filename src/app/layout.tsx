import type { Metadata } from 'next'
import { Inter, Crimson_Pro, Caveat } from 'next/font/google'
import './globals.css'
import { LenisProvider } from '@/lib/lenis'
import { Navigation } from '@/components/ui/Navigation'
import { ConditionalFooter } from '@/components/ui/ConditionalFooter'
import { PageTransition } from '@/components/ui/PageTransition'
import { NavigationLoader } from '@/components/ui/NavigationLoader'


const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const crimsonPro = Crimson_Pro({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const caveat = Caveat({
  variable: '--font-handwritten',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Steven Huff | Math Educator & Developer',
  description:
    'Interactive CV for Steven Huff — math educator, CS teacher, curriculum developer, and tool builder at Pleasant Valley High School and Butte College.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${crimsonPro.variable} ${caveat.variable} antialiased`}>
        {/* Skip to main content — keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-[var(--color-bg-primary)] focus:font-bold focus:rounded focus:no-underline"
        >
          Skip to main content
        </a>
        <LenisProvider>
          <NavigationLoader />
          <Navigation />
          <main id="main-content">
            <PageTransition>{children}</PageTransition>
          </main>
          <ConditionalFooter />
        </LenisProvider>
      </body>
    </html>
  )
}
