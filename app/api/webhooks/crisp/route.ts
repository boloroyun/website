import crypto from 'crypto';

function valid(raw: string, secret: string, sig: string | null) {
  if (!sig) return false;
  const dig = crypto.createHmac('sha256', secret).update(raw).digest('hex');

  // Convert both to Uint8Array to avoid Buffer compatibility issues
  const digBuffer = new Uint8Array(Buffer.from(dig));
  const sigBuffer = new Uint8Array(Buffer.from(sig));

  // Make sure they have the same length before comparison
  if (digBuffer.length !== sigBuffer.length) return false;

  return crypto.timingSafeEqual(digBuffer, sigBuffer);
}

export async function POST(req: Request) {
  const secret = process.env.CRISP_WEBHOOK_SECRET!;
  if (!secret) return new Response('no secret', { status: 500 });
  const raw = await req.text();
  if (!valid(raw, secret, req.headers.get('x-crisp-signature')))
    return new Response('bad sig', { status: 401 });
  const body = JSON.parse(raw);

  if (body.event === 'message:send' && body?.data?.origin === 'user') {
    const payload = {
      source: 'crisp',
      websiteId: body.website_id,
      sessionId: body.session_id,
      message: body.data?.content ?? '',
      email: body.data?.user?.email ?? null,
      name: body.data?.user?.nickname ?? null,
      phone: body.data?.user?.phone ?? null,
      segments: body.data?.session?.segments ?? [],
      sessionData: body.data?.session?.data ?? {},
      page: body.data?.fingerprint?.page?.url ?? null,
      userAgent: body.data?.fingerprint?.useragent ?? null,
      ip: body.data?.fingerprint?.ip ?? null,
    };

    const res = await fetch(`${process.env.ADMIN_API_BASE}/quotes/crisp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });
    return new Response(res.ok ? 'ok' : 'admin error', {
      status: res.ok ? 200 : 202,
    });
  }
  return new Response('ignored', { status: 200 });
}
