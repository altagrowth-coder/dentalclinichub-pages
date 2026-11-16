// Password gate for private client review pages on go.dentalclinichub.com (Vercel Routing Middleware).
// Stores only a SHA-256 of "user:password". Images stay public so emails that embed them keep working.
const GATES = {
  '/34dental-review': '42e7e7d94fd83d3039e11d1db96b8ead23d949fc681da7e04753fab1a817662e',
};

export const config = { matcher: ['/34dental-review', '/34dental-review/:path*'] };

async function sha256(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export default async function middleware(request) {
  const path = new URL(request.url).pathname;
  if (/\.(png|jpe?g|gif|webp|svg|ico)$/i.test(path)) return;
  const key = Object.keys(GATES).find((k) => path === k || path.startsWith(k + '/'));
  if (!key) return;
  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Basic ')) {
    try {
      if ((await sha256(atob(auth.slice(6)))) === GATES[key]) return;
    } catch (e) {}
  }
  return new Response('This page is private. Please enter the username and password you were given.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="34 Dental review", charset="UTF-8"', 'Cache-Control': 'no-store' },
  });
}
