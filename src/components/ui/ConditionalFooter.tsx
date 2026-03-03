'use client'

import { usePathname } from 'next/navigation'
import { Footer } from '@/components/ui/Footer'

const PDF_PAGES = ['/documents']

export function ConditionalFooter() {
  const pathname = usePathname()
  if (PDF_PAGES.includes(pathname)) return null
  return <Footer />
}

export default ConditionalFooter
