import { useState } from 'react';
import { CURATED_TECH, TECH_CATEGORIES } from '../data/tech';
import type { ProjectItem, TechCategory, TechItem } from '../lib/types';

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
          fill={el.fill || item.brandColor}
        />
      ))}
    </svg>
  );
}

export function TechStack({ projects }: TechStackProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    TechCategory | 'TODAS'
  >('TODAS');

  // Compute automatic language summary from projects.json
  const languageMap = new Map<string, number>();
  let totalBytes = 0;

  for (const project of projects) {
    for (const lang of project.languages) {
      totalBytes += lang.bytes;
      languageMap.set(lang.name, (languageMap.get(lang.name) || 0) + lang.bytes);
    }
  }

  const languageStats = Array.from(languageMap.entries())
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage:
        totalBytes > 0 ? Number(((bytes / totalBytes) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .filter((item) => item.percentage >= 0.1);

  const visibleCategories =
    selectedCategory === 'TODAS' ? TECH_CATEGORIES : [selectedCategory];

  return (
    <section
      id="tecnologias"
      aria-labelledby="tech-heading"
      className="section-screen"
    >
      <div className="wrap">
        <div className="flex flex-col justify-between gap-6 border-b border-[var(--border-subtle)] pb-8 lg:flex-row lg:items-end">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
              02 // TECNOLOGÍAS Y ENTORNOS
            </div>
            <h2
              id="tech-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl"
            >
              Stack técnico curado por capa
            </h2>
          </div>

          {/* Filter controls */}
          <div
            role="group"
            aria-label="Filtrar tecnologías por categoría"
            className="flex flex-wrap gap-2"
          >
            <button
              type="button"
              onClick={() => setSelectedCategory('TODAS')}
              aria-pressed={selectedCategory === 'TODAS'}
              className={`border px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
                selectedCategory === 'TODAS'
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-subtle)] text-[var(--text-primary)] font-semibold'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
              }`}
            >
              TODAS ({CURATED_TECH.length})
            </button>
            {TECH_CATEGORIES.map((category) => {
              const count = CURATED_TECH.filter(
                (t) => t.category === category
              ).length;
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={active}
                  className={`border px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
                    active
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-subtle)] text-[var(--text-primary)] font-semibold'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Automatic GitHub language telemetry summary */}
        <div className="mt-8 border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
              TELEMETRÍA AUTOMÁTICA DE LENGUAJES (CALCULADA DESDE PROJECTS.JSON)
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {(totalBytes / 1024).toFixed(0)} KB totales auditados vía GitHub
              API
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {languageStats.slice(0, 6).map((stat) => (
              <div
                key={stat.name}
                className="border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {stat.name}
                  </span>
                  <span className="text-[var(--accent-primary)]">
                    {stat.percentage}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full bg-[var(--bg-elevated)]">
                  <div
                    className="h-full bg-[var(--accent-primary)]"
                    style={{ width: `${Math.max(stat.percentage, 4)}%` }}
                  />
                </div>
                <div className="mt-1.5 font-mono text-[11px] text-[var(--text-muted)]">
                  {(stat.bytes / 1024).toFixed(1)} KB
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Curated categories */}
        <div className="mt-8 space-y-8">
          {visibleCategories.map((category, catIdx) => {
            const items = CURATED_TECH.filter((t) => t.category === category);
            return (
              <div
                key={category}
                className="grid grid-cols-1 gap-4 border-b border-[var(--border-subtle)] pb-8 last:border-b-0 lg:grid-cols-12 lg:gap-8"
              >
                <div className="lg:col-span-3">
                  <div className="font-mono text-xs text-[var(--accent-primary)]">
                    CAPA 0{catIdx + 1}
                  </div>
                  <h3 className="mt-1 font-display text-lg font-semibold text-[var(--text-primary)]">
                    {category}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-9">
                  {items.map((tech) => (
                    <div
                      key={tech.id}
                      className="tech-panel tech-panel-interactive flex items-start gap-3.5 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                        <TechIcon item={tech} size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-display text-sm font-semibold text-[var(--text-primary)]">
                            {tech.name}
                          </h4>
                          <span
                            className="h-2 w-2 shrink-0"
                            style={{ backgroundColor: tech.brandColor }}
                            aria-hidden="true"
                          />
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                          {tech.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
