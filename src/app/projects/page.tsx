import { projects } from '@/data/projects'
import { ProjectGrid } from '@/components/sections/ProjectGrid'

export const metadata = {
  title: 'Projects & Initiatives | Steven Huff',
  description: 'Tools, curriculum, grants, and programs built by Steven Huff — mathematics educator and CS teacher.',
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <ProjectGrid projects={projects} />
    </div>
  )
}
