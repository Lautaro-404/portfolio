import type { ReactNode } from 'react';
import { Container } from './Container';

interface SectionProps {
  id: string;
  /** Short mono label above the title, for example "03 // PROYECTOS". */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}

/** Page section with a consistent heading block (title and optional subtitle). */
export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  className = '',
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`section-screen ${className}`.trim()}
    >
      <Container>
        <div className="enter flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-8 lg:flex-row lg:items-end">
          <div>
            {eyebrow && (
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                {eyebrow}
              </div>
            )}
            <h2
              id={headingId}
              className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl"
            >
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="max-w-md font-mono text-xs leading-relaxed text-[var(--text-muted)]">
              {subtitle}
            </p>
          )}
        </div>
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  );
}
