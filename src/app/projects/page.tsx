import { projects } from '@/data/projects'
import { ProjectGrid } from '@/components/sections/ProjectGrid'

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <ProjectGrid projects={projects} />
    </div>
  )
}
