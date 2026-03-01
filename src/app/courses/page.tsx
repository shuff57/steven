import { CourseCatalog } from '@/components/sections/CourseCatalog'

export const metadata = {
  title: 'Course Catalog | Steven Huff',
  description: 'Browse all courses taught by Steven Huff across community college, university, and K–12 settings.',
}

export default function CoursesPage() {
  return (
    <main className="min-h-screen">
      <CourseCatalog />
    </main>
  )
}
