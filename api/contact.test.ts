import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import handler, {
  __resetRateLimitForTests,
  escapeHtml,
  sanitizeSingleLine,
  sanitizeText,
  type VercelRequest,
  type VercelResponse,
} from './contact.ts';

interface MockResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
  setHeader: (name: string, value: string) => void;
  getHeader: (name: string) => string | undefined;
  status: (code: number) => VercelResponse;
  json: (data: unknown) => void;
  end: (chunk?: string) => void;
}

function createMockReq(options: {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  ip?: string;
}): VercelRequest {
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(options.headers ?? {})) {
    headers[key.toLowerCase()] = value;
  }

  return {
    method: options.method ?? 'POST',
    headers,
    body: options.body,
    socket: {
      remoteAddress: options.ip ?? '198.51.100.10',
    },
  } as unknown as VercelRequest;
}

function createMockRes(): MockResponse & VercelResponse {
  const headers: Record<string, string> = {};
  const res: MockResponse = {
    statusCode: 200,
    headers,
    body: '',
    setHeader(name: string, value: string) {
      headers[name.toLowerCase()] = value;
    },
    getHeader(name: string) {
      return headers[name.toLowerCase()];
    },
    status(code: number) {
      this.statusCode = code;
      return this as unknown as VercelResponse;
    },
    json(data: unknown) {
      this.setHeader('Content-Type', 'application/json; charset=utf-8');
      this.body = JSON.stringify(data);
    },
    end(chunk?: string) {
      if (chunk) {
        this.body = chunk;
      }
    },
  };
  return res as unknown as MockResponse & VercelResponse;
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    process.env.ALLOWED_ORIGIN = 'https://lautaroponzina.vercel.app';
    delete process.env.RESEND_API_KEY;
  });

  it('rejects non-POST methods with 405 and Allow header', async () => {
    const req = createMockReq({
      method: 'GET',
      headers: { origin: 'https://lautaroponzina.vercel.app' },
    });
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 405);
    assert.equal(res.getHeader('allow'), 'POST, OPTIONS');
    const data = JSON.parse(res.body) as { ok: boolean; message: string };
    assert.equal(data.ok, false);
  });

  it('handles OPTIONS preflight from allowed origin with 204 and strict CORS headers', async () => {
    const req = createMockReq({
      method: 'OPTIONS',
      headers: { origin: 'https://lautaroponzina.vercel.app' },
    });
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 204);
    assert.equal(
      res.getHeader('access-control-allow-origin'),
      'https://lautaroponzina.vercel.app'
    );
    assert.equal(res.getHeader('access-control-allow-methods'), 'POST, OPTIONS');
    assert.equal(res.getHeader('vary'), 'Origin');
  });

  it('rejects requests from unauthorized CORS origins with 403', async () => {
    const req = createMockReq({
      method: 'POST',
      headers: { origin: 'https://sitio-malicioso.example.com' },
      body: {
        name: 'Juan Perez',
        email: 'juan@example.com',
        message: 'Hola Lautaro, te escribo por una propuesta laboral.',
      },
    });
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 403);
    assert.equal(res.getHeader('access-control-allow-origin'), undefined);
    const data = JSON.parse(res.body) as { ok: boolean; message: string };
    assert.equal(data.ok, false);
  });

  it('validates name, email and message length and format strictly (400)', async () => {
    // 1. Short name
    const resShortName = createMockRes();
    await handler(
      createMockReq({
        headers: { origin: 'https://lautaroponzina.vercel.app' },
        body: {
          name: 'A',
          email: 'valido@dominio.com',
          message: 'Mensaje con longitud suficiente para pasar.',
        },
      }),
      resShortName
    );
    assert.equal(resShortName.statusCode, 400);

    // 2. Invalid email
    const resBadEmail = createMockRes();
    await handler(
      createMockReq({
        headers: { origin: 'https://lautaroponzina.vercel.app' },
        body: {
          name: 'Maria Gomez',
          email: 'correo-invalido@dominio',
          message: 'Mensaje con longitud suficiente para pasar.',
        },
      }),
      resBadEmail
    );
    assert.equal(resBadEmail.statusCode, 400);

    // 3. Short message
    const resShortMsg = createMockRes();
    await handler(
      createMockReq({
        headers: { origin: 'https://lautaroponzina.vercel.app' },
        body: {
          name: 'Maria Gomez',
          email: 'maria@dominio.com',
          message: 'Corto',
        },
      }),
      resShortMsg
    );
    assert.equal(resShortMsg.statusCode, 400);

    // 4. Multi-level domain (.com.ar) is accepted
    const resArEmail = createMockRes();
    await handler(
      createMockReq({
        ip: '198.51.100.99',
        headers: { origin: 'https://lautaroponzina.vercel.app' },
        body: {
          name: 'Maria Gomez',
          email: 'maria.gomez@empresa.com.ar',
          message: 'Mensaje valido desde un dominio argentino .com.ar.',
        },
      }),
      resArEmail
    );
    assert.equal(resArEmail.statusCode, 200);
  });

  it('silently drops spam when honeypot field website is filled without calling Resend', async () => {
    process.env.RESEND_API_KEY = 're_test_mock_key_never_sent';
    let fetchCalled = false;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      fetchCalled = true;
      return new Response('{}', { status: 200 });
    };

    try {
      const req = createMockReq({
        headers: { origin: 'https://lautaroponzina.vercel.app' },
        body: {
          name: 'Spam Bot',
          email: 'bot@spam.com',
          message: 'Este es un mensaje automatico de spam.',
          website: 'https://spam-link.com',
        },
      });
      const res = createMockRes();

      await handler(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(fetchCalled, false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('enforces IP rate limit after 3 requests within the window with 429 and Retry-After', async () => {
    const makeValidReq = () =>
      createMockReq({
        ip: '203.0.113.55',
        headers: { origin: 'https://lautaroponzina.vercel.app' },
        body: {
          name: 'Carlos Ruiz',
          email: 'carlos@empresa.com',
          message: 'Consulta tecnica sobre desarrollo full stack.',
        },
      });

    for (let i = 0; i < 3; i++) {
      const res = createMockRes();
      await handler(makeValidReq(), res);
      assert.equal(res.statusCode, 200);
    }

    const blockedRes = createMockRes();
    await handler(makeValidReq(), blockedRes);
    assert.equal(blockedRes.statusCode, 429);
    assert.ok(blockedRes.getHeader('retry-after'));
    const data = JSON.parse(blockedRes.body) as { ok: boolean; message: string };
    assert.equal(data.ok, false);
  });

  it('sanitizes HTML tags and CRLF header injection before sending payload to Resend (mocked fetch)', async () => {
    process.env.RESEND_API_KEY = 're_mock_unit_test_only';
    process.env.CONTACT_EMAIL = 'ponzinalautaro6@gmail.com';
    process.env.RESEND_FROM_EMAIL = 'onboarding@resend.dev';

    let capturedUrl = '';
    let capturedBody: {
      from: string;
      to: string[];
      reply_to: string;
      subject: string;
      html: string;
      text: string;
    } | null = null;

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: string | URL | Request, init?: RequestInit) => {
      capturedUrl = String(input);
      capturedBody = JSON.parse(String(init?.body ?? '{}'));
      return new Response(JSON.stringify({ id: 'mock_email_id' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    try {
      const req = createMockReq({
        headers: { origin: 'https://lautaroponzina.vercel.app' },
        body: {
          name: 'Ana\r\nBcc: attacker@evil.com <script>alert(1)</script>',
          email: 'ana@empresa.com',
          message: 'Hola <b>Lautaro</b> & equipo, les escribo por un proyecto.',
        },
      });
      const res = createMockRes();

      await handler(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(capturedUrl, 'https://api.resend.com/emails');
      assert.ok(capturedBody);
      const sent = capturedBody as {
        subject: string;
        html: string;
        text: string;
        reply_to: string;
      };
      // Ensure CRLF was stripped from subject
      assert.equal(sent.subject.includes('\r'), false);
      assert.equal(sent.subject.includes('\n'), false);
      // Ensure HTML tags were escaped in HTML body
      assert.equal(sent.html.includes('<script>'), false);
      assert.equal(sent.html.includes('&lt;script&gt;'), true);
      assert.equal(sent.html.includes('&lt;b&gt;Lautaro&lt;/b&gt;'), true);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('exposes pure helper functions for sanitization', () => {
    assert.equal(
      escapeHtml('<img src=x onerror="alert(1)">'),
      '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'
    );
    assert.equal(sanitizeSingleLine('Linea 1\r\nLinea 2\u0000'), 'Linea 1 Linea 2');
    assert.equal(sanitizeText('Hola\u0007 mundo\r\nOK'), 'Hola mundo\nOK');
  });
});
