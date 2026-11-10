import { Container } from './ui/Container';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-8">
      <Container className="flex flex-col items-start justify-between gap-4 font-mono text-xs text-[var(--text-muted)] sm:flex-row sm:items-center">
        <div>
          <span className="font-semibold text-[var(--text-primary)]">
            Lautaro Ponzina
          </span>{' '}
          — UTN Facultad Regional San Rafael (Mendoza, Argentina).
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <a
            href="https://github.com/Lautaro-404"
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw text-[var(--text-secondary)]"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/lautaro-ponzina-90878932a/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw text-[var(--text-secondary)]"
          >
            LinkedIn
          </a>
          <a
            href="mailto:ponzinalautaro6@gmail.com"
            className="link-draw text-[var(--text-secondary)]"
          >
            ponzinalautaro6@gmail.com
          </a>
        </div>
      </Container>
    </footer>
  );
}
