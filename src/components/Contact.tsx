import { type FormEvent, useState } from 'react';
import type {
  ContactRequestPayload,
  ContactResponsePayload,
} from '../lib/types';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [feedback, setFeedback] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('ponzinalautaro6@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setFeedback('');

    const payload: ContactRequestPayload = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      website: website.trim(),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ContactResponsePayload;

      if (!response.ok || !data.ok) {
        setStatus('error');
        setFeedback(
          data.message ||
            'No se pudo enviar el mensaje. Escribime directamente a ponzinalautaro6@gmail.com.'
        );
        return;
      }

      setStatus('success');
      setFeedback(data.message);
      setName('');
      setEmail('');
      setMessage('');
      setWebsite('');
    } catch {
      setStatus('error');
      setFeedback(
        'Error de conexión al enviar el formulario. Podés escribirme a ponzinalautaro6@gmail.com.'
      );
    }
  };

  return (
    <section
      id="contacto"
      aria-labelledby="contact-heading"
      className="section-screen border-b-0"
    >
      <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left column: Direct channels (5 cols) */}
        <div className="lg:col-span-5">
          <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
            04 // CONTACTO DIRECTO
          </div>
          <h2
            id="contact-heading"
            className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl"
          >
            Iniciemos una conversación técnica
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
            Estoy disponible para sumarme a equipos de desarrollo Full Stack,
            proyectos freelance o colaboraciones técnicas desde San Rafael,
            Mendoza (modalidad remota o híbrida).
          </p>

          <div className="mt-8 space-y-3 font-mono text-xs">
            <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <div className="text-[11px] uppercase text-[var(--text-muted)]">
                CORREO ELECTRÓNICO
              </div>
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                <a
                  href="mailto:ponzinalautaro6@gmail.com"
                  className="font-semibold text-[var(--text-primary)] no-underline hover:text-[var(--accent-primary)]"
                >
                  ponzinalautaro6@gmail.com
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="border border-[var(--border-strong)] bg-[var(--bg-primary)] px-2.5 py-1 text-[11px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  {copiedEmail ? 'COPIADO' : 'COPIAR'}
                </button>
              </div>
            </div>

            <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <div className="text-[11px] uppercase text-[var(--text-muted)]">
                PERFIL PROFESIONAL
              </div>
              <div className="mt-1.5">
                <a
                  href="https://www.linkedin.com/in/lautaro-ponzina-90878932a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw font-semibold text-[var(--text-primary)]"
                >
                  linkedin.com/in/lautaro-ponzina-90878932a -&gt;
                </a>
              </div>
            </div>

            <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <div className="text-[11px] uppercase text-[var(--text-muted)]">
                REPOSITORIOS Y ACTIVIDAD
              </div>
              <div className="mt-1.5">
                <a
                  href="https://github.com/Lautaro-404"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw font-semibold text-[var(--text-primary)]"
                >
                  github.com/Lautaro-404 -&gt;
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Contact form connected to POST /api/contact (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="tech-panel p-6 sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 font-mono text-xs">
              <span className="font-semibold text-[var(--accent-primary)]">
                POST /api/contact
              </span>
              <span className="text-[var(--text-muted)]">RESEND // TLS</span>
            </div>

            {/* Honeypot anti-spam field (hidden from real users) */}
            <div
              className="hidden"
              aria-hidden="true"
            >
              <label htmlFor="contact-website">Sitio web</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block font-mono text-xs font-medium uppercase text-[var(--text-secondary)]"
                >
                  Nombre completo <span className="text-[var(--accent-primary)]">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre o empresa"
                  className="mt-2 w-full border border-[var(--border-strong)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)]"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block font-mono text-xs font-medium uppercase text-[var(--text-secondary)]"
                >
                  Correo electrónico <span className="text-[var(--accent-primary)]">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={120}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@empresa.com"
                  className="mt-2 w-full border border-[var(--border-strong)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)]"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-xs font-medium uppercase text-[var(--text-secondary)]"
                >
                  Mensaje <span className="text-[var(--accent-primary)]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Contame sobre el proyecto, posición o consulta técnica..."
                  className="mt-2 w-full resize-y border border-[var(--border-strong)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-tech-primary w-full sm:w-auto disabled:opacity-60"
                >
                  <span>
                    {status === 'submitting'
                      ? 'Enviando mensaje...'
                      : 'Enviar mensaje'}
                  </span>
                  <span aria-hidden="true">-&gt;</span>
                </button>
              </div>

              <div
                aria-live="polite"
                role="status"
                className="min-h-[1.5rem]"
              >
                {status === 'success' && (
                  <div className="border border-[var(--accent-primary)] bg-[var(--accent-primary-subtle)] px-4 py-3 font-mono text-xs text-[var(--text-primary)]">
                    [ESTADO 200 OK] {feedback}
                  </div>
                )}

                {status === 'error' && (
                  <div className="border border-[var(--danger)] bg-[var(--bg-primary)] px-4 py-3 font-mono text-xs text-[var(--danger)]">
                    [ERROR DE VALIDACIÓN / ENVÍO] {feedback}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
