import { useEffect, useRef, useState } from 'react';
import { OWNER_NAME } from '../data/profile';
import type { ThemeMode } from '../lib/theme';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

const NAV_LINKS = [
  { href: '#sobre-mi', code: '01', label: 'Sobre mí' },
  { href: '#tecnologias', code: '02', label: 'Tecnologías' },
  { href: '#proyectos', code: '03', label: 'Proyectos' },
  { href: '#contacto', code: '04', label: 'Contacto' },
];

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border-subtle)] backdrop-blur-md"
      style={{ backgroundColor: 'var(--bg-glass)' }}
    >
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <a
          href="#inicio"
          className="group inline-flex items-center gap-3 text-left no-underline"
        >
          <span
            className="flex h-8 w-8 items-center justify-center border border-[var(--border-strong)] bg-[var(--bg-surface)] font-mono text-xs font-semibold tracking-tight text-[var(--accent-primary)] transition-colors group-hover:border-[var(--accent-primary)]"
            aria-hidden="true"
          >
            LP
          </span>
          <div className="flex flex-col">
            <span className="font-display text-sm font-semibold tracking-tight text-[var(--text-primary)]">
              {OWNER_NAME}
            </span>
            <span
              className="font-mono text-[11px] text-[var(--text-muted)]"
              aria-hidden="true"
            >
              FULL STACK // UTN FRSR
            </span>
            <span className="sr-only"> — Ir al inicio</span>
          </div>
        </a>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-7 md:flex"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-draw font-mono text-xs tracking-wide text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <span className="text-[var(--accent-primary)]">{item.code}.</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-9 items-center gap-2 border border-[var(--border-strong)] bg-[var(--bg-surface)] px-2.5 sm:px-3 font-mono text-xs whitespace-nowrap text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] cursor-pointer"
            aria-label={
              theme === 'dark'
                ? 'Modo oscuro. Cambiar a modo claro'
                : 'Modo claro. Cambiar a modo oscuro'
            }
          >
            <span
              className="h-2 w-2 shrink-0"
              style={{
                backgroundColor:
                  theme === 'dark'
                    ? 'var(--accent-primary)'
                    : 'var(--accent-amber)',
              }}
              aria-hidden="true"
            />
            <span>
              <span className="hidden sm:inline">MODO: </span>
              {theme === 'dark' ? 'OSCURO' : 'CLARO'}
            </span>
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center border border-[var(--border-strong)] bg-[var(--bg-surface)] font-mono text-xs text-[var(--text-primary)] md:hidden cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              mobileMenuOpen
                ? 'Cerrar menú de navegación'
                : 'Abrir menú de navegación'
            }
          >
            {mobileMenuOpen ? 'X' : '≡'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navegación móvil"
          className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] md:hidden"
        >
          <div className="wrap flex flex-col divide-y divide-[var(--border-subtle)] py-3">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between py-3.5 font-mono text-sm text-[var(--text-primary)] no-underline"
              >
                <span>
                  <span className="mr-2 text-[var(--accent-primary)]">
                    {item.code}.
                  </span>
                  {item.label}
                </span>
                <span className="text-xs text-[var(--text-muted)]">IR -&gt;</span>
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
