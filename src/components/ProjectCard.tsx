import { useState } from 'react';
import { getTechItemsForProject } from '../data/tech';
import type { ProjectItem } from '../lib/types';
import { TechIcon } from './TechStack';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export type ProjectCardVariant = 'featured' | 'compact';

interface ProjectCardProps {
  project: ProjectItem;
  /** Zero-based position inside its group, used for the index label and layout rhythm. */
  index: number;
  variant?: ProjectCardVariant;
  /** Technology id currently selected in the filter bar; its badge is emphasised. */
  activeTechId?: string | null;
}

const LANGUAGE_PALETTE = ['#34B38A', '#38BDF8', '#F59E0B', '#6DB33F', '#4169E1'];

function formatPushDate(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('es-AR', { year: 'numeric', month: 'short' }).format(date);
}

function padIndex(index: number): string {
  return String(index + 1).padStart(2, '0');
}

function TechBadges({
  project,
  activeTechId,
}: {
  project: ProjectItem;
  activeTechId?: string | null;
}) {
  const tech = getTechItemsForProject(project.languages, project.topics);

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tecnologías del proyecto">
      {tech.map((item) => (
        <li key={item.id}>
          <Badge
            className={
              item.id === activeTechId
                ? '!border-[var(--accent-primary)] !bg-[var(--accent-primary-subtle)]'
                : ''
            }
          >
            <TechIcon item={item} size={14} />
            <span>{item.name}</span>
          </Badge>
        </li>
      ))}
    </ul>
  );
}

function ProjectLinks({ project, compact }: { project: ProjectItem; compact?: boolean }) {
  const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
  const sizing = compact ? 'px-4 py-2 text-xs' : 'w-full sm:w-auto';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {project.homepage && (
        <Button href={project.homepage} {...external} className={sizing}>
          <span>Ver demo</span>
          <span aria-hidden="true">-&gt;</span>
          <span className="sr-only"> de {project.title} (se abre en una pestaña nueva)</span>
        </Button>
      )}
      <Button href={project.html_url} variant="secondary" {...external} className={sizing}>
        <span>{project.privateRepo ? 'Repositorio (privado)' : 'Ver código'}</span>
        <span className="sr-only"> de {project.title} en GitHub (se abre en una pestaña nueva)</span>
      </Button>
      {project.secondaryUrl && (
        <a
          href={project.secondaryUrl.url}
          {...external}
          className="link-draw font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)] sm:ml-auto"
        >
          <span>{project.secondaryUrl.label}</span>
          <span aria-hidden="true">-&gt;</span>
        </a>
      )}
    </div>
  );
}

/** Lazy-loaded screenshot; falls back to the architecture schematic if it is missing or fails. */
function ProjectShot({ project }: { project: ProjectItem }) {
  const [failed, setFailed] = useState(false);
  if (!project.screenshot || failed) return null;

  return (
    <img
      src={project.screenshot}
      alt={`Captura de pantalla de ${project.title}`}
      width={1280}
      height={800}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="aspect-[16/10] w-full border border-[var(--border-subtle)] object-cover object-top"
    />
  );
}

function FeaturedCard({ project, index, activeTechId }: ProjectCardProps) {
  const [shotFailed, setShotFailed] = useState(false);
  const hasShot = Boolean(project.screenshot) && !shotFailed;
  const isReversed = index % 2 === 1;
  const updated = formatPushDate(project.pushed_at);

  return (
    <article
      id={`proyecto-${project.name}`}
      aria-labelledby={`proyecto-${project.name}-titulo`}
      className="tech-panel tech-panel-interactive grid grid-cols-1 lg:grid-cols-12"
    >
      <div
        className={`frame-zoom flex flex-col border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5 sm:p-6 lg:col-span-5 lg:border-b-0 ${
          isReversed
            ? 'lg:order-2 lg:border-l lg:border-[var(--border-subtle)]'
            : 'lg:border-r lg:border-[var(--border-subtle)]'
        }`}
      >
        <div className="frame-visual flex h-full flex-col justify-between gap-5">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 font-mono text-xs">
            <span className="font-semibold text-[var(--accent-primary)]">
              NODO {padIndex(index)}
            </span>
            <span className="border border-[var(--border-strong)] bg-[var(--bg-surface)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
              {project.privateRepo ? 'REPO PRIVADO' : 'REPO PÚBLICO'}
            </span>
          </div>

          {hasShot ? (
            <img
              src={project.screenshot}
              alt={`Captura de pantalla de ${project.title}`}
              width={1280}
              height={800}
              loading="lazy"
              decoding="async"
              onError={() => setShotFailed(true)}
              className="my-auto aspect-[16/10] w-full border border-[var(--border-subtle)] object-cover object-top"
            />
          ) : (
            <div className="flex flex-1 flex-col justify-center space-y-3 border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              {project.subtitle && (
                <div className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                  {project.subtitle}
                </div>
              )}
              {project.architectureNote && (
                <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                  {project.architectureNote}
                </p>
              )}
              <div className="pt-2">
                <div className="mb-1.5 flex items-center justify-between gap-3 font-mono text-[11px] text-[var(--text-muted)]">
                  <span>COMPOSICIÓN</span>
                  <span className="truncate">
                    {project.languages
                      .slice(0, 3)
                      .map((l) => `${l.name} ${l.percentage}%`)
                      .join(' · ')}
                  </span>
                </div>
                <div className="flex h-2 w-full overflow-hidden bg-[var(--bg-primary)]" aria-hidden="true">
                  {project.languages.slice(0, 5).map((lang, idx) => (
                    <div
                      key={lang.name}
                      style={{
                        width: `${Math.max(lang.percentage, 3)}%`,
                        backgroundColor: LANGUAGE_PALETTE[idx % LANGUAGE_PALETTE.length],
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-3 font-mono text-[11px] text-[var(--text-muted)]">
            <span className="truncate">{project.name}</span>
            {updated && <span className="shrink-0">ACT. {updated.toUpperCase()}</span>}
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col justify-between p-6 sm:p-8 lg:col-span-7 ${
          isReversed ? 'lg:order-1' : ''
        }`}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--accent-primary)]">
            <span>DESTACADO {padIndex(index)}</span>
            <span className="text-[var(--text-muted)]" aria-hidden="true">
              //
            </span>
            <span className="text-[var(--text-secondary)]">
              {project.homepage ? 'EN LÍNEA' : 'CÓDIGO FUENTE'}
            </span>
          </div>

          <h3
            id={`proyecto-${project.name}-titulo`}
            className="mt-2 font-display text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl"
          >
            {project.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            {project.description}
          </p>

          {project.highlights && project.highlights.length > 0 && (
            <ul className="mt-4 space-y-2 border-l-2 border-[var(--accent-primary)] pl-4 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
              {project.highlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <TechBadges project={project} activeTechId={activeTechId} />
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border-subtle)] pt-5">
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

function CompactCard({ project, index, activeTechId }: ProjectCardProps) {
  return (
    <article
      id={`proyecto-${project.name}`}
      aria-labelledby={`proyecto-${project.name}-titulo`}
      className="grid grid-cols-1 gap-x-8 gap-y-4 px-5 py-6 transition-colors duration-200 hover:bg-[var(--bg-elevated)] sm:px-6 md:grid-cols-12"
    >
      <div className="font-mono text-xs text-[var(--text-muted)] md:col-span-1 md:pt-1">
        {padIndex(index)}
      </div>

      <div className="md:col-span-6">
        <h4
          id={`proyecto-${project.name}-titulo`}
          className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)]"
        >
          {project.title}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {project.description}
        </p>
        {project.screenshot && (
          <div className="mt-4 max-w-sm">
            <ProjectShot project={project} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 md:col-span-5">
        <TechBadges project={project} activeTechId={activeTechId} />
        <ProjectLinks project={project} compact />
      </div>
    </article>
  );
}

export function ProjectCard({ variant = 'featured', ...props }: ProjectCardProps) {
  return variant === 'featured' ? <FeaturedCard {...props} /> : <CompactCard {...props} />;
}

