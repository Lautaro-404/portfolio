import { CURATED_TECH, TECH_CATEGORIES } from '../data/tech';
import { computeLanguageSummary } from '../lib/languages';
import type { ProjectItem, TechItem } from '../lib/types';
import { Section } from './ui/Section';

interface TechStackProps {
  projects: ProjectItem[];
}

export function TechIcon({
  item,
  size = 20,
}: {
  item: TechItem;
  size?: number;
}) {
  if (!item.svgPaths) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex shrink-0 items-center justify-center font-mono text-[11px] font-bold leading-none select-none"
        style={{
          width: size,
          height: size,
          color: item.mono ? 'currentColor' : item.brandColor,
        }}
      >
        &gt;_
      </span>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={item.svgPaths.viewBox}
      aria-hidden="true"
      className="shrink-0"
    >
      {item.svgPaths.elements.map((el, idx) => (
        <path
          key={idx}
          d={el.d}
          fill={el.fill ?? (item.mono ? 'currentColor' : item.brandColor)}
        />
      ))}
    </svg>
  );
}

function LanguageSummary({ projects }: { projects: ProjectItem[] }) {
  const { stats, totalBytes } = computeLanguageSummary(projects);
  if (stats.length === 0) return null;

  const top = stats.slice(0, 6);

  return (
    <div className="mt-10 border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
        <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
          Lenguajes más usados
        </h3>
        <p className="font-mono text-xs text-[var(--text-muted)]">
          Calculado desde projects.json · {(totalBytes / 1024).toFixed(0)} KB
        </p>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {top.map((stat) => (
          <li key={stat.name}>
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-semibold text-[var(--text-primary)]">
                {stat.name}
              </span>
              <span className="text-[var(--accent-primary)]">
                {stat.percentage}%
              </span>
            </div>
            <div
              className="mt-1.5 h-1 w-full bg-[var(--bg-elevated)]"
              role="presentation"
            >
              <div
                className="h-full bg-[var(--accent-primary)]"
                style={{ width: `${Math.max(stat.percentage, 3)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TechStack({ projects }: TechStackProps) {
  return (
    <Section
      id="tecnologias"
      eyebrow="02 // TECNOLOGÍAS"
      title="Con qué trabajo"
      subtitle="Mi foco está en el backend con Java y Spring Boot. Lo destacado es lo que uso a diario; el resto es el entorno que lo rodea."
    >
      <div>
        {TECH_CATEGORIES.map((category, catIdx) => {
          const items = CURATED_TECH.filter((t) => t.category === category);
          const featured = items.filter((t) => t.featured);
          const rest = items.filter((t) => !t.featured);

          return (
            <div
              key={category}
              className="enter grid grid-cols-1 gap-5 border-b border-[var(--border-subtle)] py-8 first:pt-0 last:border-b-0 lg:grid-cols-12 lg:gap-8"
            >
              <div className="lg:col-span-3">
                <div className="font-mono text-xs text-[var(--accent-primary)]">
                  {String(catIdx + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold text-[var(--text-primary)]">
                  {category}
                </h3>
                <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                  {items.length} {items.length === 1 ? 'herramienta' : 'herramientas'}
                </p>
              </div>

              <div className="space-y-3 lg:col-span-9">
                {featured.length > 0 && (
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {featured.map((tech) => (
                      <li
                        key={tech.id}
                        className="tech-panel flex items-center gap-4 p-4"
                      >
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                          style={{ borderLeftColor: tech.brandColor, borderLeftWidth: 3 }}
                        >
                          <TechIcon item={tech} size={26} />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-display text-base font-semibold text-[var(--text-primary)]">
                            {tech.name}
                          </span>
                          {tech.role && (
                            <span className="mt-0.5 block text-xs leading-relaxed text-[var(--text-secondary)]">
                              {tech.role}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {rest.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {rest.map((tech) => (
                      <li
                        key={tech.id}
                        className="tech-panel inline-flex items-center gap-2 px-3 py-2 text-[var(--text-primary)]"
                      >
                        <TechIcon item={tech} size={16} />
                        <span className="font-mono text-xs">{tech.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <LanguageSummary projects={projects} />
    </Section>
  );
}
