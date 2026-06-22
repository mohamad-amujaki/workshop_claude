import { Redis } from '@upstash/redis';

let redis;
try {
  redis = Redis.fromEnv();
} catch {
  // redis tetap undefined — akan di-handle di handler
}

export default async function handler(req, res) {
  if (!redis) {
    return res.status(500).json({
      sukses: false,
      pesan: 'Konfigurasi database tidak ditemukan. Pastikan environment variable Redis (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN) sudah diatur di Vercel.',
    });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ sukses: false, pesan: 'Method not allowed.' });
  }
  const data = await redis.lrange('pendaftaran', 0, -1);
  return res.status(200).json(data ?? []);
}
