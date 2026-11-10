import { Badge } from './ui/Badge';
import { Section } from './ui/Section';

const FACTS = [
  {
    label: 'FORMACIÓN',
    value: 'Tecnicatura en Programación',
    detail: 'UTN Facultad Regional San Rafael (cursada terminada)',
  },
  {
    label: 'UBICACIÓN',
    value: 'San Rafael, Mendoza',
    detail: 'Argentina',
  },
  {
    label: 'FOCO',
    value: 'Full Stack',
    detail: 'Backend, web con React y móvil con Flutter',
  },
  {
    label: 'BUSCO',
    value: 'Trabajo, pasantía o freelance',
    detail: 'Abierto a cualquiera de las tres',
  },
];

const ALSO = [
  'Edición de video',
  'Diseño gráfico',
  'Páginas web',
  'Apps móviles',
  'Hardware de PC',
  'Suite de Office',
  'Agentes de IA',
];

export function About() {
  return (
    <Section
      id="sobre-mi"
      eyebrow="01 // SOBRE MÍ"
      title="Programación, y curiosidad por toda la tecnología"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-5 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg lg:col-span-7">
          <p>
            Soy Lautaro, desarrollador Full Stack de San Rafael, Mendoza.
            Terminé de cursar la Tecnicatura en Programación en la UTN Facultad
            Regional San Rafael y hoy estoy abierto a un trabajo, una pasantía
            o proyectos freelance.
          </p>
          <p>
            Me gusta construir de punta a punta: APIs y backend, aplicaciones
            web con React, apps móviles con Flutter y sistemas sobre
            PostgreSQL y Supabase. También trabajo con varios agentes de IA a
            la vez para automatizar tareas y acelerar el desarrollo.
          </p>
          <p>
            La tecnología me apasiona en todas sus ramas. Con los años aprendí
            edición de video, diseño gráfico, armado de páginas web, apps
            móviles y diagnóstico y reparación de hardware de PC. Dos de mis
            proyectos, yokai-hardware-frontend y ClinAppMobile, están más
            abajo.
          </p>
        </div>

        <div className="lg:col-span-5">
          <dl className="tech-panel divide-y divide-[var(--border-subtle)]">
            {FACTS.map((fact) => (
              <div key={fact.label} className="px-5 py-4">
                <dt className="font-mono text-[11px] tracking-wider text-[var(--text-muted)]">
                  {fact.label}
                </dt>
                <dd className="mt-1 font-display text-lg font-semibold text-[var(--text-primary)]">
                  {fact.value}
                </dd>
                <dd className="mt-0.5 text-sm text-[var(--text-secondary)]">
                  {fact.detail}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <h3 className="font-mono text-[11px] tracking-wider text-[var(--text-muted)]">
              MÁS ALLÁ DEL CÓDIGO
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {ALSO.map((item) => (
                <li key={item}>
                  <Badge>{item}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
