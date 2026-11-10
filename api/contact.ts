import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  CONTACT_LIMITS,
  EMAIL_REGEX,
  escapeHtml,
  sanitizeSingleLine,
  sanitizeText,
} from '../src/lib/contactValidation.ts';

export { escapeHtml, sanitizeSingleLine, sanitizeText };

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
}

export interface VercelRequest extends IncomingMessage {
  body?: unknown;
  headers: IncomingMessage['headers'];
  method?: string;
}

export interface VercelResponse extends ServerResponse {
  status?: (code: number) => VercelResponse;
  json?: (data: unknown) => void;
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 3;
const MAX_TRACKED_IPS = 1000;
const ipHits = new Map<string, { count: number; resetAt: number }>();

export function __resetRateLimitForTests(): void {
  ipHits.clear();
}

function firstHeaderValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0]?.trim();
  }
  return typeof value === 'string' ? value.trim() : undefined;
}

function getAllowedOrigins(req: VercelRequest): Set<string> {
  const configured = (process.env.ALLOWED_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const hostHeader =
    firstHeaderValue(req.headers['x-forwarded-host']) ||
    firstHeaderValue(req.headers.host);

  const candidateHosts = [
    hostHeader,
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ].filter((h): h is string => Boolean(h && h.trim()));

  for (const host of candidateHosts) {
    const cleanHost = host.replace(/^https?:\/\//, '').split('/')[0].trim();
    if (cleanHost) {
      configured.push(`https://${cleanHost}`);
      if (process.env.NODE_ENV !== 'production') {
        configured.push(`http://${cleanHost}`);
      }
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    configured.push('http://localhost:5173', 'http://localhost:4173');
  }

  return new Set(configured);
}

function extractRefererOrigin(referer: string | undefined): string | null {
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

function applySecurityAndCorsHeaders(
  req: VercelRequest,
  res: VercelResponse
): { allowed: boolean } {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Vary', 'Origin');

  const origin = firstHeaderValue(req.headers.origin);
  const allowedOrigins = getAllowedOrigins(req);

  if (!origin) {
    if (process.env.NODE_ENV === 'production' && req.method === 'POST') {
      const refererOrigin = extractRefererOrigin(
        firstHeaderValue(req.headers.referer)
      );
      if (!refererOrigin || !allowedOrigins.has(refererOrigin)) {
        return { allowed: false };
      }
    }
    return { allowed: true };
  }

  if (!allowedOrigins.has(origin)) {
    return { allowed: false };
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  return { allowed: true };
}

function sendJson(
  res: VercelResponse,
  statusCode: number,
  payload: { ok: boolean; message: string }
): void {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    const statusRes = res.status(statusCode);
    if (typeof statusRes.json === 'function') {
      statusRes.json(payload);
      return;
    }
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function getClientIp(req: VercelRequest): string {
  const vercelForwarded = firstHeaderValue(
    req.headers['x-vercel-forwarded-for']
  );
  if (vercelForwarded) {
    return vercelForwarded.split(',')[0].trim();
  }

  const realIp = firstHeaderValue(req.headers['x-real-ip']);
  if (realIp) {
    return realIp;
  }

  const forwarded = firstHeaderValue(req.headers['x-forwarded-for']);
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return req.socket?.remoteAddress || 'unknown-ip';
}

function pruneRateLimitMap(now: number): void {
  if (ipHits.size < 500) return;
  for (const [key, entry] of ipHits) {
    if (now > entry.resetAt) {
      ipHits.delete(key);
    }
  }
  while (ipHits.size >= MAX_TRACKED_IPS) {
    const oldestKey = ipHits.keys().next().value;
    if (oldestKey === undefined) break;
    ipHits.delete(oldestKey);
  }
}

function checkRateLimit(ip: string): { limited: boolean; retryAfterSec: number } {
  const now = Date.now();
  const current = ipHits.get(ip);

  if (!current || now > current.resetAt) {
    pruneRateLimitMap(now);
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false, retryAfterSec: 0 };
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSec = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return { limited: true, retryAfterSec };
  }

  current.count += 1;
  return { limited: false, retryAfterSec: 0 };
}

function ensurePlainObject(parsed: unknown): ContactPayload {
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Payload debe ser un objeto JSON');
  }
  return parsed as ContactPayload;
}

async function parseRequestBody(req: VercelRequest): Promise<ContactPayload> {
  if (req.body !== undefined && typeof req.body !== 'string') {
    return ensurePlainObject(req.body);
  }
  if (typeof req.body === 'string' && req.body.trim().length > 0) {
    return ensurePlainObject(JSON.parse(req.body));
  }

  return new Promise((resolve, reject) => {
    let raw = '';
    let aborted = false;
    req.on('data', (chunk: Buffer) => {
      if (aborted) return;
      raw += chunk.toString('utf8');
      if (raw.length > 32_768) {
        aborted = true;
        req.destroy?.();
        reject(new Error('Payload demasiado extenso'));
      }
    });
    req.on('end', () => {
      if (aborted) return;
      try {
        resolve(raw ? ensurePlainObject(JSON.parse(raw)) : {});
      } catch {
        reject(new Error('JSON invalido'));
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const cors = applySecurityAndCorsHeaders(req, res);

  if (!cors.allowed) {
    sendJson(res, 403, {
      ok: false,
      message: 'Origen no autorizado para acceder a este endpoint.',
    });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    sendJson(res, 405, {
      ok: false,
      message: 'Método no permitido. Usá POST /api/contact.',
    });
    return;
  }

  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp);
  if (rateLimit.limited) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSec));
    sendJson(res, 429, {
      ok: false,
      message:
        'Superaste el límite de envíos permitidos. Intentá nuevamente en unos minutos.',
    });
    return;
  }

  let body: ContactPayload;
  try {
    body = await parseRequestBody(req);
  } catch {
    sendJson(res, 400, {
      ok: false,
      message: 'El formato de los datos enviados no es válido.',
    });
    return;
  }

  // Honeypot anti-spam field check
  const honeypot =
    typeof body.website === 'string' ? sanitizeSingleLine(body.website) : '';
  if (honeypot.length > 0) {
    sendJson(res, 200, {
      ok: true,
      message: 'Mensaje recibido correctamente.',
    });
    return;
  }

  const name =
    typeof body.name === 'string' ? sanitizeSingleLine(body.name) : '';
  const email =
    typeof body.email === 'string'
      ? sanitizeSingleLine(body.email).toLowerCase()
      : '';
  const message =
    typeof body.message === 'string' ? sanitizeText(body.message) : '';

  if (
    name.length < CONTACT_LIMITS.name.min ||
    name.length > CONTACT_LIMITS.name.max
  ) {
    sendJson(res, 400, {
      ok: false,
      message: `El nombre debe tener entre ${CONTACT_LIMITS.name.min} y ${CONTACT_LIMITS.name.max} caracteres.`,
    });
    return;
  }

  if (
    email.length < CONTACT_LIMITS.email.min ||
    email.length > CONTACT_LIMITS.email.max ||
    !EMAIL_REGEX.test(email)
  ) {
    sendJson(res, 400, {
      ok: false,
      message: 'Ingresá una dirección de correo electrónico válida.',
    });
    return;
  }

  if (
    message.length < CONTACT_LIMITS.message.min ||
    message.length > CONTACT_LIMITS.message.max
  ) {
    sendJson(res, 400, {
      ok: false,
      message: `El mensaje debe tener entre ${CONTACT_LIMITS.message.min} y ${CONTACT_LIMITS.message.max} caracteres.`,
    });
    return;
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail =
    process.env.CONTACT_EMAIL || 'ponzinalautaro6@gmail.com';
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    'Portfolio Contacto <onboarding@resend.dev>';

  if (!resendApiKey) {
    if (process.env.NODE_ENV !== 'production') {
      sendJson(res, 200, {
        ok: true,
        message:
          'Mensaje validado correctamente (modo desarrollo local sin RESEND_API_KEY).',
      });
      return;
    }

    sendJson(res, 503, {
      ok: false,
      message:
        'El servicio de correo no está configurado en el servidor. Escribí directamente a ponzinalautaro6@gmail.com.',
    });
    return;
  }

  const safeHtmlName = escapeHtml(name);
  const safeHtmlEmail = escapeHtml(email);
  const safeHtmlMessage = escapeHtml(message);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [contactEmail],
        reply_to: email,
        subject: `[Portafolio Web] Nuevo mensaje de ${name}`,
        text: `Nuevo mensaje desde el portafolio de Lautaro Ponzina\n\nNombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
        html: `
          <h2>Nuevo mensaje desde el portafolio de Lautaro Ponzina</h2>
          <p><strong>Nombre:</strong> ${safeHtmlName}</p>
          <p><strong>Email:</strong> ${safeHtmlEmail}</p>
          <p><strong>Mensaje:</strong></p>
          <pre style="font-family: monospace; white-space: pre-wrap;">${safeHtmlMessage}</pre>
        `,
      }),
    });

    if (!response.ok) {
      sendJson(res, 502, {
        ok: false,
        message:
          'No se pudo entregar el correo mediante Resend. Podés escribir directamente a ponzinalautaro6@gmail.com.',
      });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      message:
        'Gracias por escribir. Tu mensaje fue enviado y te responderé a la brevedad.',
    });
  } catch {
    sendJson(res, 500, {
      ok: false,
      message:
        'Ocurrió un error al procesar el envío. Escribí directamente a ponzinalautaro6@gmail.com.',
    });
  }
}
