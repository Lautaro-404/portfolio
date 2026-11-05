import { getTechItemsForProject } from '../data/tech';
import type { ProjectItem } from '../lib/types';
import { TechIcon } from './TechStack';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
}

function formatPushDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'short',
    }).format(date);
  } catch {
    return '2026';
  }
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const mappedTech = getTechItemsForProject(project.languages, project.topics);
  const isReversed = index % 2 === 1;

  return (
    <article
      id={`proyecto-${project.name}`}
      className="tech-panel tech-panel-interactive grid grid-cols-1 lg:grid-cols-12"
    >
      {/* Visual & Architecture Blueprint Frame (5 cols) */}
      <div
        className={`frame-zoom flex flex-col justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5 sm:p-6 lg:col-span-5 lg:border-b-0 ${
          isReversed
            ? 'lg:order-2 lg:border-l lg:border-[var(--border-subtle)]'
            : 'lg:border-r lg:border-[var(--border-subtle)]'
        }`}
      >
        <div className="frame-visual flex h-full flex-col justify-between gap-5">
          {/* Top bar of app frame */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 font-mono text-xs">
            <span className="font-semibold text-[var(--accent-primary)]">
              SYS.NODE // 0{index + 1}
            </span>
            <span className="border border-[var(--border-strong)] bg-[var(--bg-surface)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
              {project.privateRepo ? 'REPO PRIVADO' : 'REPO PÚBLICO'}
            </span>
          </div>

          {/* Architecture schematic diagram */}
          <div className="my-auto space-y-3 border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="flex items-center justify-between font-mono text-[11px] text-[var(--text-muted)]">
              <span>ARQUITECTURA VERIFICADA</span>
              <span className="text-[var(--accent-primary)]">ONLINE</span>
            </div>

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

            {/* Language distribution inside the repo */}
            <div className="pt-2">
              <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-[var(--text-muted)]">
                <span>COMPOSICIÓN DEL REPOSITORIO</span>
                <span>
                  {project.languages
                    .slice(0, 3)
                    .map((l) => `${l.name} ${l.percentage}%`)
                    .join(' · ')}
                </span>
              </div>
              <div className="flex h-2 w-full overflow-hidden bg-[var(--bg-primary)]">
                {project.languages.slice(0, 5).map((lang, idx) => {
                  const palette = [
                    '#34B38A',
                    '#38BDF8',
                    '#F59E0B',
                    '#6DB33F',
                    '#4169E1',
                  ];
                  return (
                    <div
                      key={lang.name}
                      style={{
                        width: `${Math.max(lang.percentage, 3)}%`,
                        backgroundColor: palette[idx % palette.length],
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom metadata bar */}
          <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 font-mono text-[11px] text-[var(--text-muted)]">
            <span>ID: {project.name}</span>
            <span>ACTUALIZADO: {formatPushDate(project.pushed_at).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Content & Technical Specifications (7 cols) */}
      <div
        className={`flex flex-col justify-between p-6 sm:p-8 lg:col-span-7 ${
          isReversed ? 'lg:order-1' : ''
        }`}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--accent-primary)]">
            <span>PROYECTO DESTACADO 0{index + 1}</span>
            <span className="text-[var(--text-muted)]">//</span>
            <span className="text-[var(--text-secondary)]">
              {project.homepage ? 'PRODUCCIÓN ACTIVA' : 'CÓDIGO FUENTE'}
            </span>
          </div>

          <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
            {project.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            {project.description}
          </p>

          {project.highlights && project.highlights.length > 0 && (
            <ul className="mt-4 space-y-2 border-l-2 border-[var(--accent-primary)] pl-4 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
              {project.highlights.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          )}

          {/* Technology badges mapped to src/data/tech.ts */}
          <div className="mt-6">
            <div className="mb-2.5 font-mono text-[11px] uppercase text-[var(--text-muted)]">
              TECNOLOGÍAS MAPEADAS (LENGUAJES + TOPICS)
            </div>
            <div className="flex flex-wrap gap-2">
              {mappedTech.map((tech) => (
                <span
                  key={tech.id}
                  className="inline-flex items-center gap-2 border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-xs text-[var(--text-primary)]"
                >
                  <TechIcon item={tech} size={14} />
                  <span>{tech.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action links: Repo, Live Demo, Secondary URL (Swagger) */}
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] pt-5">
          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tech-primary w-full sm:w-auto"
            >
              <span>Abrir demo en vivo</span>
              <span aria-hidden="true">-&gt;</span>
            </a>
          )}

          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tech-secondary w-full sm:w-auto"
          >
            <span>
              {project.privateRepo
                ? 'Repositorio en GitHub (Privado)'
                : 'Ver código en GitHub'}
            </span>
          </a>

          {project.secondaryUrl && (
            <a
              href={project.secondaryUrl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw ml-auto font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
            >
              <span>{project.secondaryUrl.label}</span>
              <span aria-hidden="true">-&gt;</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
