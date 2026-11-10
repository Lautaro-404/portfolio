import type { ReactNode } from 'react';
import { GITHUB_URL, LINKEDIN_URL, OWNER_NAME } from '../data/profile';
import { Button } from './ui/Button';
import { Container } from './ui/Container';

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-draw gap-2 font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
    >
      {children}
      <span>{label}</span>
    </a>
  );
}

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-heading"
      className="section-screen relative"
    >
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="enter flex flex-col items-start lg:col-span-7">
          <p className="mb-6 font-mono text-xs uppercase tracking-wider text-[var(--accent-primary)]">
            {OWNER_NAME} // Desarrollador Full Stack
          </p>

          <h1
            id="hero-heading"
            className="font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-6xl lg:text-[4.25rem] lg:leading-[1.02]"
          >
            Construyo software de punta a punta.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Del backend a la pantalla, con código claro y mantenible.
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button href="#proyectos" className="w-full sm:w-auto">
              <span>Ver proyectos</span>
              <span aria-hidden="true">-&gt;</span>
            </Button>
            <Button
              href="#contacto"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Contactame
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
            <SocialLink href={GITHUB_URL} label="GitHub">
              <GitHubIcon />
            </SocialLink>
            <SocialLink href={LINKEDIN_URL} label="LinkedIn">
              <LinkedInIcon />
            </SocialLink>
          </div>

          <dl className="mt-8 grid w-full max-w-xl grid-cols-1 gap-x-8 gap-y-3 border-t border-[var(--border-subtle)] pt-6 font-mono text-xs sm:grid-cols-2">
            <div>
              <dt className="text-[var(--text-muted)]">FORMACIÓN</dt>
              <dd className="mt-1 text-[var(--text-primary)]">
                UTN Facultad Regional San Rafael
              </dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">UBICACIÓN</dt>
              <dd className="mt-1 text-[var(--text-primary)]">
                Neuquén Capital, Argentina
              </dd>
            </div>
          </dl>
        </div>

        {/* Portrait: offset frame gives the asymmetric composition. */}
        <div className="enter mx-auto w-full max-w-sm pb-3 pr-3 lg:col-span-5 lg:mt-14 lg:max-w-none">
          <div className="relative">
            <div
              className="absolute inset-0 translate-x-3 translate-y-3 border border-[var(--accent-primary)]"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-[var(--border-strong)] bg-[var(--bg-surface)]">
              <picture>
                <source srcSet="/foto-perfil.webp" type="image/webp" />
                <img
                  src="/foto-perfil.jpg"
                  alt={`Retrato de ${OWNER_NAME}`}
                  width={1280}
                  height={1280}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </picture>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
