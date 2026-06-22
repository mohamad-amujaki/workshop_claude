import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ sukses: false, pesan: 'Method not allowed.' });
  }
  const data = await redis.lrange('pendaftaran', 0, -1);
  return res.status(200).json(data ?? []);
}
