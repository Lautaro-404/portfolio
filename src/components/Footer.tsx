import {
  CONTACT_EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  OWNER_NAME,
} from '../data/profile';
import { Container } from './ui/Container';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-8">
      <Container className="flex flex-col items-start justify-between gap-4 font-mono text-xs text-[var(--text-muted)] sm:flex-row sm:items-center">
        <div>
          <span className="font-semibold text-[var(--text-primary)]">
            {OWNER_NAME}
          </span>{' '}
          — UTN Facultad Regional San Rafael (Mendoza, Argentina).
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw text-[var(--text-secondary)]"
          >
            GitHub
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw text-[var(--text-secondary)]"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="link-draw text-[var(--text-secondary)]"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </Container>
    </footer>
  );
}
