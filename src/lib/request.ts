import 'server-only';
import { createHash } from 'crypto';
import { env } from './env';

export function getIp(req: Request) {
  const fwd = req.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0] : req.headers.get('x-real-ip'))?.trim() || null;
}

export function hashIp(ip: string | null) {
  return ip ? createHash('sha256').update(env.ipSalt + ip).digest('hex').slice(0, 32) : null;
}

export function readCookie(req: Request, name: string) {
  const raw = req.headers.get('cookie');
  if (!raw) return null;
  const match = raw.split(';').map((c) => c.trim()).find((c) => c.startsWith(name + '='));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}
