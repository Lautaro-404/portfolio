import type { ProjectItem } from '../lib/types';
import { ProjectCard } from './ProjectCard';
import { Section } from './ui/Section';

interface ProjectsProps {
  projects: ProjectItem[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <Section
      id="proyectos"
      eyebrow="03 // PROYECTOS EN PRODUCCIÓN"
      title="Sistemas reales sincronizados desde GitHub"
      subtitle="Datos generados en tiempo de compilación mediante GitHub CLI (gh) y curados en projects.overrides.json."
    >
      <div className="space-y-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}
