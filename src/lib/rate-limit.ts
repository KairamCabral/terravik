/**
 * Rate limiter in-memory (por instância).
 * Em produção com múltiplas réplicas, considerar Redis.
 */

const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000;       // 1 minuto
const AUTH_WINDOW_MS = 15 * 60 * 1000; // 15 minutos

function getKey(ip: string, path: string): string {
  return `${ip}:${path}`;
}

function getWindow(path: string): number {
  if (path.startsWith('/api/upload')) return WINDOW_MS;
  if (path.startsWith('/api/contact') || path.startsWith('/api/newsletter')) return WINDOW_MS;
  if (path === '/login' || path === '/cadastro') return AUTH_WINDOW_MS;
  return WINDOW_MS;
}

function getLimit(path: string): number {
  if (path.startsWith('/api/upload')) return 20;
  if (path.startsWith('/api/contact') || path.startsWith('/api/newsletter')) return 5;
  if (path === '/login' || path === '/cadastro') return 10;
  return 60;
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const xri = request.headers.get('x-real-ip');
  if (xri) return xri.trim();
  return 'unknown';
}

export function getPathPrefix(request: Request): string {
  const url = new URL(request.url);
  const path = url.pathname;
  if (path.startsWith('/api/upload')) return '/api/upload';
  if (path.startsWith('/api/contact')) return '/api/contact';
  if (path.startsWith('/api/newsletter')) return '/api/newsletter';
  if (path === '/login' || path === '/cadastro') return path;
  return path;
}

/**
 * Retorna true se dentro do limite; false se excedeu (deve retornar 429).
 */
export function checkRateLimit(request: Request): { allowed: boolean; retryAfter: number } {
  const ip = getClientIp(request);
  const path = getPathPrefix(request);
  const key = getKey(ip, path);
  const now = Date.now();
  const windowMs = getWindow(path);
  const limit = getLimit(path);

  let entry = store.get(key);
  if (!entry || now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return { allowed: true, retryAfter: Math.ceil(windowMs / 1000) };
  }
  entry.count++;
  if (entry.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
}
