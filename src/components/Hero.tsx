import type { ProjectItem } from '../lib/types';
import { Button } from './ui/Button';

interface HeroProps {
  projects: ProjectItem[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  HTML: '#E34F26',
  Dart: '#47C5FB',
  JavaScript: '#F7DF1E',
  Java: '#6DB33F',
  Python: '#3776AB',
  PLpgSQL: '#4169E1',
  TypeScript: '#3178C6',
  CSS: '#06B6D4',
  Dockerfile: '#2496ED',
};

export function Hero({ projects }: HeroProps) {
  // Compute aggregate language distribution across all portfolio projects
  const languageTotals = new Map<string, number>();
  let totalBytes = 0;

  for (const project of projects) {
    for (const lang of project.languages) {
      totalBytes += lang.bytes;
      languageTotals.set(
        lang.name,
        (languageTotals.get(lang.name) || 0) + lang.bytes
      );
    }
  }

  const topLanguages = Array.from(languageTotals.entries())
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage:
        totalBytes > 0 ? Number(((bytes / totalBytes) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 6);

  const totalKilobytes = Math.round(totalBytes / 1024);

  return (
    <section
      id="inicio"
      aria-labelledby="hero-heading"
      className="section-screen relative"
    >
      <div className="wrap grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left column: primary statement and 2 actions */}
        <div className="enter flex flex-col items-start lg:col-span-7">
          <div className="mb-5 inline-flex items-center gap-2.5 border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 py-1.5 font-mono text-xs text-[var(--text-secondary)]">
            <span
              className="h-2 w-2 bg-[var(--accent-primary)]"
              aria-hidden="true"
            />
            <span>UTN FACULTAD REGIONAL SAN RAFAEL // MENDOZA, AR</span>
          </div>

          <h1
            id="hero-heading"
            className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.06]"
          >
            Lautaro Ponzina. Desarrollador Full Stack de software web y móvil.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Construyo aplicaciones de punta a punta desde San Rafael, Mendoza:
            interfaces reactivas en React, TypeScript y Flutter conectadas a
            APIs en Java Spring Boot, Python y PostgreSQL/Supabase, desplegadas
            en producción sobre Docker, Vercel y Render.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              href="#proyectos"
              className="w-full sm:w-auto"
            >
              <span>Explorar proyectos</span>
              <span aria-hidden="true">-&gt;</span>
            </Button>
            <Button
              href="#contacto" variant="secondary"
              className="w-full sm:w-auto"
            >
              <span>Enviar consulta</span>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--border-subtle)] pt-5 font-mono text-xs text-[var(--text-muted)]">
            <a
              href="https://github.com/Lautaro-404"
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw text-[var(--text-secondary)]"
            >
              GITHUB // Lautaro-404
            </a>
            <a
              href="https://www.linkedin.com/in/lautaro-ponzina-90878932a/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-draw text-[var(--text-secondary)]"
            >
              LINKEDIN // lautaro-ponzina
            </a>
            <span>EMAIL // ponzinalautaro6@gmail.com</span>
          </div>
        </div>

        {/* Right column: real engineering telemetry card from projects.json */}
        <div className="lg:col-span-5">
          <div className="tech-panel p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3.5 font-mono text-xs">
              <span className="font-semibold text-[var(--accent-primary)]">
                SYS.TELEMETRY // GITHUB_CLI
              </span>
              <span className="text-[var(--text-muted)]">
                USER: Lautaro-404
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3.5">
                <div className="font-mono text-[11px] uppercase text-[var(--text-muted)]">
                  Sistemas en producción
                </div>
                <div className="mt-1 font-display text-2xl font-bold text-[var(--text-primary)]">
                  0{projects.length}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-[var(--accent-primary)]">
                  Vercel + Render + Supabase
                </div>
              </div>

              <div className="border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3.5">
                <div className="font-mono text-[11px] uppercase text-[var(--text-muted)]">
                  Volumen analizado
                </div>
                <div className="mt-1 font-display text-2xl font-bold text-[var(--text-primary)]">
                  {totalKilobytes.toLocaleString('es-AR')} KB
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                  Código fuente verificado
                </div>
              </div>
            </div>

            {/* Proportional multi-language bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between font-mono text-xs text-[var(--text-secondary)]">
                <span>DISTRIBUCIÓN DE LENGUAJES</span>
                <span className="text-[var(--text-muted)]">API /languages</span>
              </div>

              <div
                className="mt-2.5 flex h-2.5 w-full overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
                role="img"
                aria-label="Barra proporcional de lenguajes usados en los proyectos"
              >
                {topLanguages.map((lang) => (
                  <div
                    key={lang.name}
                    style={{
                      width: `${Math.max(lang.percentage, 3)}%`,
                      backgroundColor:
                        LANGUAGE_COLORS[lang.name] || 'var(--accent-primary)',
                    }}
                    title={`${lang.name}: ${lang.percentage}%`}
                  />
                ))}
              </div>

              <ul className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
                {topLanguages.map((lang) => (
                  <li
                    key={lang.name}
                    className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1"
                  >
                    <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span
                        className="inline-block h-2 w-2"
                        style={{
                          backgroundColor:
                            LANGUAGE_COLORS[lang.name] ||
                            'var(--accent-primary)',
                        }}
                        aria-hidden="true"
                      />
                      {lang.name}
                    </span>
                    <span className="text-[var(--text-muted)]">
                      {lang.percentage}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Active deployments list */}
            <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
              <div className="font-mono text-[11px] uppercase text-[var(--text-muted)]">
                PROYECTOS SINCRONIZADOS
              </div>
              <div className="mt-2.5 space-y-2">
                {projects.map((proj) => (
                  <a
                    key={proj.name}
                    href={`#proyecto-${proj.name}`}
                    className="flex items-center justify-between border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-2 font-mono text-xs text-[var(--text-primary)] no-underline transition-colors hover:border-[var(--accent-primary)]"
                  >
                    <span className="truncate font-medium">{proj.name}</span>
                    <span className="ml-2 shrink-0 text-[11px] text-[var(--accent-primary)]">
                      {proj.privateRepo ? 'PRIVADO // DEMO' : 'PÚBLICO // LIVE'}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
