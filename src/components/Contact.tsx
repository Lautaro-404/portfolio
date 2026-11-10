import { type FormEvent, useRef, useState } from 'react';
import {
  CONTACT_LIMITS,
  type ContactFieldErrors,
  type ContactFieldName,
  firstInvalidContactField,
  hasContactErrors,
  validateContact,
  validateContactField,
} from '../lib/contactValidation';
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
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<ContactFieldName, boolean>>
  >({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [feedback, setFeedback] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const focusField = (field: ContactFieldName | null) => {
    if (field === 'name') {
      nameInputRef.current?.focus();
    } else if (field === 'email') {
      emailInputRef.current?.focus();
    } else if (field === 'message') {
      messageInputRef.current?.focus();
    }
  };

  const handleFieldChange = (field: ContactFieldName, value: string) => {
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'message') setMessage(value);

    if (touched[field] || errors[field]) {
      const fieldError = validateContactField(field, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldError) {
          next[field] = fieldError;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  const handleFieldBlur = (field: ContactFieldName, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateContactField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) {
        next[field] = fieldError;
      } else {
        delete next[field];
      }
      return next;
    });
  };

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

    setTouched({ name: true, email: true, message: true });
    const validationErrors = validateContact({ name, email, message });
    setErrors(validationErrors);

    if (hasContactErrors(validationErrors)) {
      if (status !== 'idle') {
        setStatus('idle');
        setFeedback('');
      }
      focusField(firstInvalidContactField(validationErrors));
      return;
    }

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
      setErrors({});
      setTouched({});
    } catch {
      setStatus('error');
      setFeedback(
        'Error de conexión al enviar el formulario. Podés escribirme a ponzinalautaro6@gmail.com.'
      );
    }
  };

  const getFieldBorderClass = (field: ContactFieldName) =>
    errors[field]
      ? 'border-[var(--danger)] focus:border-[var(--danger)]'
      : 'border-[var(--border-strong)] focus:border-[var(--accent-primary)]';

  const trimmedMessageLength = message.trim().length;

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
                  aria-label="Copiar dirección de correo electrónico ponzinalautaro6@gmail.com"
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
            className="tech-panel relative p-6 sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 font-mono text-xs">
              <span className="font-semibold text-[var(--accent-primary)]">
                POST /api/contact
              </span>
              <span className="text-[var(--text-muted)]">RESEND // TLS</span>
            </div>

            {/* Honeypot anti-spam field positioned off-screen and excluded from assistive tech */}
            <div
              className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0"
              aria-hidden="true"
            >
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
                  Nombre completo{' '}
                  <span className="text-[var(--accent-primary)]" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  ref={nameInputRef}
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  minLength={CONTACT_LIMITS.name.min}
                  maxLength={CONTACT_LIMITS.name.max}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onBlur={(e) => handleFieldBlur('name', e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  placeholder="Tu nombre o empresa"
                  className={`mt-2 w-full border bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors ${getFieldBorderClass('name')}`}
                />
                {errors.name && (
                  <p
                    id="contact-name-error"
                    role="alert"
                    className="mt-1.5 font-mono text-xs text-[var(--danger)]"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block font-mono text-xs font-medium uppercase text-[var(--text-secondary)]"
                >
                  Correo electrónico{' '}
                  <span className="text-[var(--accent-primary)]" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  ref={emailInputRef}
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={CONTACT_LIMITS.email.max}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={(e) => handleFieldBlur('email', e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'contact-email-error' : undefined
                  }
                  placeholder="nombre@empresa.com"
                  className={`mt-2 w-full border bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors ${getFieldBorderClass('email')}`}
                />
                {errors.email && (
                  <p
                    id="contact-email-error"
                    role="alert"
                    className="mt-1.5 font-mono text-xs text-[var(--danger)]"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <label
                    htmlFor="contact-message"
                    className="block font-mono text-xs font-medium uppercase text-[var(--text-secondary)]"
                  >
                    Mensaje{' '}
                    <span
                      className="text-[var(--accent-primary)]"
                      aria-hidden="true"
                    >
                      *
                    </span>
                  </label>
                  <span
                    id="contact-message-counter"
                    className="font-mono text-[11px] text-[var(--text-muted)]"
                  >
                    {trimmedMessageLength} / {CONTACT_LIMITS.message.max}
                  </span>
                </div>
                <textarea
                  ref={messageInputRef}
                  id="contact-message"
                  name="message"
                  required
                  minLength={CONTACT_LIMITS.message.min}
                  maxLength={CONTACT_LIMITS.message.max}
                  rows={5}
                  value={message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  onBlur={(e) => handleFieldBlur('message', e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message
                      ? 'contact-message-error contact-message-counter'
                      : 'contact-message-counter'
                  }
                  placeholder="Contame sobre el proyecto, posición o consulta técnica..."
                  className={`mt-2 w-full resize-y border bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors ${getFieldBorderClass('message')}`}
                />
                {errors.message && (
                  <p
                    id="contact-message-error"
                    role="alert"
                    className="mt-1.5 font-mono text-xs text-[var(--danger)]"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  aria-busy={status === 'submitting'}
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
                aria-atomic="true"
                role="status"
                className="min-h-[1.5rem]"
              >
                {status === 'submitting' && (
                  <div className="border border-[var(--border-strong)] bg-[var(--bg-primary)] px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">
                    <span
                      aria-hidden="true"
                      className="mr-2 font-semibold text-[var(--accent-primary)]"
                    >
                      [PROCESANDO]
                    </span>
                    Enviando tu mensaje...
                  </div>
                )}

                {status === 'success' && (
                  <div className="border border-[var(--accent-primary)] bg-[var(--accent-primary-subtle)] px-4 py-3 font-mono text-xs text-[var(--text-primary)]">
                    <span
                      aria-hidden="true"
                      className="mr-2 font-semibold text-[var(--accent-primary)]"
                    >
                      [ESTADO 200 OK]
                    </span>
                    {feedback}
                  </div>
                )}

                {status === 'error' && (
                  <div className="border border-[var(--danger)] bg-[var(--bg-primary)] px-4 py-3 font-mono text-xs text-[var(--danger)]">
                    <span aria-hidden="true" className="mr-2 font-semibold">
                      [ERROR DE ENVÍO]
                    </span>
                    {feedback}
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
