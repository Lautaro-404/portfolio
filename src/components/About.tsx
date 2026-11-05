const PILLARS = [
  {
    code: 'ARCH.01',
    title: 'Desarrollo Frontend y Móvil Multiplataforma',
    detail:
      'Construcción de interfaces web en React, TypeScript y Tailwind CSS junto con aplicaciones nativas en Flutter y Dart (arquitectura Feature-First con Riverpod), priorizando rendimiento, semántica accesible y tiempos de carga bajos.',
  },
  {
    code: 'ARCH.02',
    title: 'Backend Transaccional y Persistencia Relacional',
    detail:
      'Diseño de APIs RESTful en Java con Spring Boot y seguridad JWT, servicios en Python/Node.js y bases de datos PostgreSQL y Supabase con migraciones versionadas en Flyway, procedimientos PL/pgSQL y funciones Edge.',
  },
  {
    code: 'ARCH.03',
    title: 'Entorno Linux, Contenedores y Flujos con Agentes IA',
    detail:
      'Trabajo diario sobre Linux (CachyOS, Ubuntu, Linux Mint) y terminal WezTerm, empaquetado reproducible con Docker, despliegue continuo en Vercel, Render y Cloudflare, e integración de agentes (Antigravity, Claude Code, OpenCode) guiados por contratos AGENTS.md.',
  },
];

export function About() {
  return (
    <section
      id="sobre-mi"
      aria-labelledby="about-heading"
      className="section-screen"
    >
      <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left column: Sticky section header and technical profile specs */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
              01 // SOBRE MÍ
            </div>
            <h2
              id="about-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl"
            >
              Formación técnica y criterio de ingeniería
            </h2>

            <dl className="mt-6 divide-y divide-[var(--border-subtle)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono text-xs">
              <div className="flex items-center justify-between px-4 py-3">
                <dt className="text-[var(--text-muted)]">INSTITUCIÓN</dt>
                <dd className="font-medium text-[var(--text-primary)]">
                  UTN FR San Rafael
                </dd>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <dt className="text-[var(--text-muted)]">UBICACIÓN</dt>
                <dd className="font-medium text-[var(--text-primary)]">
                  Mendoza, Argentina
                </dd>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <dt className="text-[var(--text-muted)]">SISTEMA BASE</dt>
                <dd className="font-medium text-[var(--accent-primary)]">
                  Linux (CachyOS / Mint)
                </dd>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <dt className="text-[var(--text-muted)]">FLUJO AGÉNTICO</dt>
                <dd className="font-medium text-[var(--text-primary)]">
                  Antigravity + Claude CLI
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right column: Editorial narrative and 3 technical pillars */}
        <div className="lg:col-span-8">
          <div className="space-y-4 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            <p>
              Soy desarrollador Full Stack formado en la{' '}
              <strong className="font-semibold text-[var(--text-primary)]">
                Universidad Tecnológica Nacional — Facultad Regional San Rafael
              </strong>
              . Me enfoco en resolver problemas reales de software diseñando
              tanto la estructura de datos y las reglas de negocio en el
              servidor como la experiencia de uso en el navegador o el teléfono.
            </p>
            <p>
              En cada proyecto priorizo arquitecturas claras y verificables:
              desde plataformas e-commerce con APIs en Java Spring Boot,
              PostgreSQL y Docker hasta aplicaciones móviles en Flutter
              conectadas a Supabase Realtime y pasarelas de pago en producción.
            </p>
          </div>

          <div className="mt-8 divide-y divide-[var(--border-subtle)] border-t border-b border-[var(--border-subtle)]">
            {PILLARS.map((pillar) => (
              <article
                key={pillar.code}
                className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-12 sm:gap-6"
              >
                <div className="font-mono text-xs font-semibold text-[var(--accent-primary)] sm:col-span-3">
                  {pillar.code}
                </div>
                <div className="sm:col-span-9">
                  <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {pillar.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
