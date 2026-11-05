import type { ProjectItem } from '../lib/types';
import { ProjectCard } from './ProjectCard';

interface ProjectsProps {
  projects: ProjectItem[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <section
      id="proyectos"
      aria-labelledby="projects-heading"
      className="section-screen"
    >
      <div className="wrap">
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-8 lg:flex-row lg:items-end">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
              03 // PROYECTOS EN PRODUCCIÓN
            </div>
            <h2
              id="projects-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl"
            >
              Sistemas reales sincronizados desde GitHub
            </h2>
          </div>

          <p className="max-w-md font-mono text-xs leading-relaxed text-[var(--text-muted)]">
            Datos generados en tiempo de compilación mediante GitHub CLI (gh) y
            curados en projects.overrides.json.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
