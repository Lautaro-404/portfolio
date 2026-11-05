import type { IncomingMessage, ServerResponse } from 'node:http';

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
}

interface VercelRequest extends IncomingMessage {
  body?: unknown;
  headers: IncomingMessage['headers'];
  method?: string;
}

interface VercelResponse extends ServerResponse {
  status?: (code: number) => VercelResponse;
  json?: (data: unknown) => void;
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 3;
const ipHits = new Map<string, { count: number; resetAt: number }>();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function sendJson(
  res: VercelResponse,
  statusCode: number,
  payload: { ok: boolean; message: string }
) {
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

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const current = ipHits.get(ip);

  if (!current || now > current.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  current.count += 1;
  return false;
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

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, {
      ok: false,
      message: 'Método no permitido. Usá POST /api/contact.',
    });
    return;
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
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
  const honeypot = typeof body.website === 'string' ? body.website.trim() : '';
  if (honeypot.length > 0) {
    sendJson(res, 200, {
      ok: true,
      message: 'Mensaje recibido correctamente.',
    });
    return;
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (name.length < 2 || name.length > 80) {
    sendJson(res, 400, {
      ok: false,
      message: 'El nombre debe tener entre 2 y 80 caracteres.',
    });
    return;
  }

  if (email.length > 120 || !EMAIL_REGEX.test(email)) {
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
    process.env.RESEND_FROM_EMAIL || 'Portfolio Contacto <onboarding@resend.dev>';

  if (!resendApiKey) {
    // In local development without RESEND_API_KEY, confirm validation succeeded clearly
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
        html: `
          <h2>Nuevo mensaje desde el portafolio de Lautaro Ponzina</h2>
          <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Mensaje:</strong></p>
          <pre style="font-family: monospace; white-space: pre-wrap;">${escapeHtml(message)}</pre>
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
