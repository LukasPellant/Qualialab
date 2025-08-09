export interface Env {
  CF_API_TOKEN: string;
  CF_ACCOUNT_ID: string;
  ADMIN_KEY: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context as unknown as { request: Request; env: Env; params: { uid: string } };
  const uid = params.uid;
  if (!uid) return new Response('Missing uid', { status: 400 });

  // CORS for same-origin Pages; adjust if needed
  const corsHeaders = {
    'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
    'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-key',
  } as const;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const apiBase = `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/stream/${uid}`;

  if (request.method === 'GET') {
    const res = await fetch(apiBase, {
      headers: { Authorization: `Bearer ${env.CF_API_TOKEN}` },
    });
    const body = await res.text();
    return new Response(body, { status: res.status, headers: { 'content-type': 'application/json', ...corsHeaders } });
  }

  if (request.method === 'PATCH') {
    const adminKey = request.headers.get('x-admin-key') || '';
    if (!adminKey || adminKey !== env.ADMIN_KEY) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }
    const incoming = await request.json().catch(() => ({}));
    const payload = { meta: incoming.meta ?? incoming };

    const res = await fetch(apiBase, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${env.CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const body = await res.text();
    return new Response(body, { status: res.status, headers: { 'content-type': 'application/json', ...corsHeaders } });
  }

  return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
};


