import type { IncomingMessage, ServerResponse } from 'node:http';

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
const ipHits = new Map<string, { count: number; resetAt: number }>();

const EMAIL_REGEX = /^[^\s@<>()[\]\\.,;:@"]+(\.[^\s@<>()[\]\\.,;:@"]+)*@[^\s@<>()[\]\\.,;:@"]+\.[^\s@<>()[\]\\.,;:@"]{2,}$/;

function stripControlChars(input: string, preserveNewlines: boolean): string {
  let out = '';
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    const isNewline = code === 10 || code === 13; // \n or \r
    const isTab = code === 9; // \t
    const isControl = (code >= 0 && code <= 31) || code === 127;
    if (!isControl || isTab || (preserveNewlines && isNewline)) {
      out += input[i];
    }
  }
  return out;
}

export function __resetRateLimitForTests(): void {
  ipHits.clear();
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeSingleLine(input: string): string {
  return stripControlChars(input, true)
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sanitizeText(input: string): string {
  return stripControlChars(input, true)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

function getAllowedOrigins(): Set<string> {
  const configured = (process.env.ALLOWED_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV !== 'production') {
    configured.push('http://localhost:5173', 'http://localhost:4173');
  }

  return new Set(configured);
}

function applySecurityAndCorsHeaders(
  req: VercelRequest,
  res: VercelResponse
): { allowed: boolean } {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Vary', 'Origin');

  const rawOrigin = req.headers.origin;
  const origin = Array.isArray(rawOrigin) ? rawOrigin[0] : rawOrigin;

  if (!origin) {
    // Same-origin or server-to-server request without Origin header
    return { allowed: true };
  }

  const allowedOrigins = getAllowedOrigins();
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
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown-ip';
}

function checkRateLimit(ip: string): { limited: boolean; retryAfterSec: number } {
  const now = Date.now();
  const current = ipHits.get(ip);

  if (!current || now > current.resetAt) {
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

async function parseRequestBody(req: VercelRequest): Promise<ContactPayload> {
  if (req.body && typeof req.body === 'object') {
    return req.body as ContactPayload;
  }
  if (typeof req.body === 'string' && req.body.trim().length > 0) {
    return JSON.parse(req.body) as ContactPayload;
  }

  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk: Buffer) => {
      raw += chunk.toString('utf8');
      if (raw.length > 32_768) {
        reject(new Error('Payload demasiado extenso'));
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? (JSON.parse(raw) as ContactPayload) : {});
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

  if (name.length < 2 || name.length > 80) {
    sendJson(res, 400, {
      ok: false,
      message: 'El nombre debe tener entre 2 y 80 caracteres.',
    });
    return;
  }

  if (email.length < 5 || email.length > 120 || !EMAIL_REGEX.test(email)) {
    sendJson(res, 400, {
      ok: false,
      message: 'Ingresá una dirección de correo electrónico válida.',
    });
    return;
  }

  if (message.length < 10 || message.length > 2000) {
    sendJson(res, 400, {
      ok: false,
      message: 'El mensaje debe tener entre 10 y 2000 caracteres.',
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
