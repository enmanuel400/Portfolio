import type { APIRoute } from 'astro';
import { SITE } from '../../site.config';

// Ruta en demanda: no se prerenderiza, se ejecuta como función en Vercel.
export const prerender = false;

const DEFAULT_FROM = 'Portfolio <onboarding@resend.dev>';
const LIMITS = { name: 120, email: 200, message: 5000 };

function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function validEmail(value: string): boolean {
  return value.length <= LIMITS.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
  );
}

// Límite básico en memoria (best-effort; en serverless no persiste entre instancias).
const hits = new Map<string, number[]>();
function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
  if (tooMany(ip)) return json({ ok: false, error: 'rate' }, 429);

  let data: Record<string, unknown> = {};
  try {
    const type = request.headers.get('content-type') || '';
    if (type.includes('application/json')) {
      data = (await request.json()) as Record<string, unknown>;
    } else {
      data = Object.fromEntries((await request.formData()).entries());
    }
  } catch {
    return json({ ok: false, error: 'body' }, 400);
  }

  // Honeypot: si un bot lo rellena, respondemos ok y no enviamos nada.
  if (str(data.company, 60)) return json({ ok: true });

  const name = str(data.name, LIMITS.name);
  const email = str(data.email, LIMITS.email);
  const message = str(data.message, LIMITS.message);

  if (!name || !validEmail(email) || message.length < 10) {
    return json({ ok: false, error: 'validation' }, 422);
  }

  const key = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM || import.meta.env.CONTACT_FROM || DEFAULT_FROM;

  if (!key) {
    console.error('Falta RESEND_API_KEY');
    return json({ ok: false, error: 'config' }, 500);
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [SITE.email],
      reply_to: email,
      subject: `Portfolio — ${name}`,
      text: `Nombre: ${name}\nCorreo: ${email}\n\n${message}`,
      html:
        `<p><strong>Nombre:</strong> ${escapeHtml(name)}</p>` +
        `<p><strong>Correo:</strong> ${escapeHtml(email)}</p>` +
        `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }),
  });

  if (!response.ok) {
    console.error('Resend respondió', response.status, await response.text().catch(() => ''));
    return json({ ok: false, error: 'send' }, 502);
  }

  return json({ ok: true });
};

export const GET: APIRoute = () => json({ ok: false, error: 'method' }, 405);
