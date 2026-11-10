import { useMemo, useState, type ReactNode } from 'react';
import { GITHUB_URL } from '../data/profile';
import { getTechItemsForProject } from '../data/tech';
import { isProject } from '../lib/languages';
import type { ProjectItem, TechItem } from '../lib/types';
import { ProjectCard } from './ProjectCard';
import { TechIcon } from './TechStack';
import { Button } from './ui/Button';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { Section } from './ui/Section';

interface ProjectsProps {
  /** Raw data from projects.json; validated here so a bad build never breaks the page. */
  projects: unknown;
}

/** Animated show/hide: collapses height and fades, and removes hidden content from tab order. */
function Collapsible({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div className="collapsible" data-open={open} inert={!open}>
      <div className="collapsible-inner">{children}</div>
    </div>
  );
}

function StatePanel({
  label,
  title,
  children,
  role,
}: {
  label: string;
  title: string;
  children: ReactNode;
  role?: 'alert' | 'status';
}) {
  return (
    <div
      role={role}
      className="grid gap-8 border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-6 sm:p-10 md:grid-cols-12"
    >
      <div className="md:col-span-8">
        <div className="font-mono text-xs font-semibold tracking-wider text-[var(--accent-amber)]">
          {label}
        </div>
        <h3 className="mt-3 font-display text-xl font-bold tracking-tight sm:text-2xl">{title}</h3>
        <div className="mt-3 max-w-prose text-sm leading-relaxed text-[var(--text-secondary)]">
          {children}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="hidden grid-cols-4 content-center gap-1.5 md:col-span-4 md:grid"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className={`h-6 border border-dashed ${
              i === 5 ? 'border-[var(--accent-amber)]' : 'border-[var(--border-strong)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectsEmpty() {
  return (
    <StatePanel
      role="status"
      label="SIN DATOS // 0 PROYECTOS"
      title="Todavía no hay proyectos para mostrar"
    >
      <p>
        Los repositorios se sincronizan desde GitHub en cada compilación y esta vez no llegó
        ninguno. Mientras tanto, podés ver todo mi trabajo directamente en el perfil.
      </p>
      <div className="mt-6">
        <Button
          href={GITHUB_URL}
          variant="secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ir al perfil de GitHub
        </Button>
      </div>
    </StatePanel>
  );
}

function ProjectsError({ onRetry }: { onRetry?: () => void }) {
  return (
    <StatePanel
      role="alert"
      label="ERROR // NO SE PUDO RENDERIZAR"
      title="No pudimos cargar los proyectos"
    >
      <p>
        Algo falló al leer los datos de esta sección. No es tu conexión: el problema está de mi
        lado. Probá de nuevo o mirá los repositorios en GitHub.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {onRetry && <Button onClick={onRetry}>Reintentar</Button>}
        <Button
          href={GITHUB_URL}
          variant="secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ir al perfil de GitHub
        </Button>
      </div>
    </StatePanel>
  );
}

function FilterButton({
  pressed,
  onClick,
  count,
  tech,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  count: number;
  tech?: TechItem;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-2 border px-3 py-1.5 font-mono text-xs transition-[background-color,border-color,color,transform] duration-200 active:translate-y-px ${
        pressed
          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-subtle)] text-[var(--text-primary)]'
          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
      }`}
    >
      {tech && <TechIcon item={tech} size={14} />}
      <span>{children}</span>
      <span className={pressed ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}>
        {count}
      </span>
    </button>
  );
}

function ProjectsList({ projects }: { projects: ProjectItem[] }) {
  const [activeTechId, setActiveTechId] = useState<string | null>(null);

  const { entries, filters } = useMemo(() => {
    const sorted = [...projects].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    const withTech = sorted.map((project) => {
      const tech = getTechItemsForProject(project.languages, project.topics);
      return { project, tech, techIds: new Set(tech.map((t) => t.id)) };
    });

    const byId = new Map<string, { tech: TechItem; count: number }>();
    for (const entry of withTech) {
      for (const tech of entry.tech) {
        const found = byId.get(tech.id);
        if (found) found.count += 1;
        else byId.set(tech.id, { tech, count: 1 });
      }
    }
    const filterList = [...byId.values()].sort(
      (a, b) => b.count - a.count || a.tech.name.localeCompare(b.tech.name)
    );

    return { entries: withTech, filters: filterList };
  }, [projects]);

  const matches = (techIds: Set<string>) => activeTechId === null || techIds.has(activeTechId);
  const featured = entries.filter((e) => e.project.featured);
  const others = entries.filter((e) => !e.project.featured);
  const visibleCount = entries.filter((e) => matches(e.techIds)).length;
  const activeTech = filters.find((f) => f.tech.id === activeTechId)?.tech;

  const showGroup = (group: typeof entries) => group.some((e) => matches(e.techIds));

  return (
    <div>
      <div role="group" aria-labelledby="proyectos-filtros-etiqueta">
        <div
          id="proyectos-filtros-etiqueta"
          className="mb-3 font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]"
        >
          Filtrar por tecnología
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterButton
            pressed={activeTechId === null}
            onClick={() => setActiveTechId(null)}
            count={entries.length}
          >
            Todos
          </FilterButton>
          {filters.map(({ tech, count }) => (
            <FilterButton
              key={tech.id}
              tech={tech}
              pressed={activeTechId === tech.id}
              onClick={() => setActiveTechId(activeTechId === tech.id ? null : tech.id)}
              count={count}
            >
              {tech.name}
            </FilterButton>
          ))}
        </div>
        <p
          role="status"
          aria-live="polite"
          className="mt-3 font-mono text-xs text-[var(--text-muted)]"
        >
          {activeTech
            ? `${visibleCount} de ${entries.length} proyectos usan ${activeTech.name}`
            : `${entries.length} ${entries.length === 1 ? 'proyecto' : 'proyectos'}`}
        </p>
      </div>

      <div className="mt-8">
        {featured.length > 0 && (
          <Collapsible open={showGroup(featured)}>
            {(() => {
              let visibleIdx = 0;
              return featured.map(({ project, tech, techIds }) => {
                const isOpen = matches(techIds);
                const cardIndex = isOpen ? visibleIdx++ : 0;
                return (
                  <Collapsible key={project.name} open={isOpen}>
                    <div className="pb-8">
                      <ProjectCard
                        project={project}
                        tech={tech}
                        index={cardIndex}
                        variant="featured"
                        activeTechId={activeTechId}
                      />
                    </div>
                  </Collapsible>
                );
              });
            })()}
          </Collapsible>
        )}

        {others.length > 0 && (
          <Collapsible open={showGroup(others)}>
            <div className="pt-2">
              <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Otros proyectos
              </h3>
              <div className="border-x border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                {(() => {
                  let visibleIdx = featured.filter((e) => matches(e.techIds)).length;
                  return others.map(({ project, tech, techIds }) => {
                    const isOpen = matches(techIds);
                    const cardIndex = isOpen ? visibleIdx++ : 0;
                    return (
                      <Collapsible key={project.name} open={isOpen}>
                        <div className="border-t border-[var(--border-subtle)]">
                          <ProjectCard
                            project={project}
                            tech={tech}
                            index={cardIndex}
                            variant="compact"
                            activeTechId={activeTechId}
                          />
                        </div>
                      </Collapsible>
                    );
                  });
                })()}
              </div>
            </div>
          </Collapsible>
        )}
      </div>
    </div>
  );
}

export function Projects({ projects }: ProjectsProps) {
  const valid = Array.isArray(projects) ? projects.filter(isProject) : null;

  return (
    <Section
      id="proyectos"
      eyebrow="03 // PROYECTOS"
      title="Lo que construí, directo desde GitHub"
      subtitle="Se actualiza en cada compilación a partir de mis repositorios. Filtrá por tecnología para ver qué usé en cada uno."
    >
      <ErrorBoundary fallback={(reset) => <ProjectsError onRetry={reset} />}>
        {valid === null ? (
          <ProjectsError />
        ) : valid.length === 0 ? (
          <ProjectsEmpty />
        ) : (
          <ProjectsList projects={valid} />
        )}
      </ErrorBoundary>
    </Section>
  );
}
