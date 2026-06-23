const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';

async function redisLrange(key) {
  const url = `${REDIS_URL.replace(/\/$/, '')}/lrange/${key}/0/-1`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Redis error: ${res.status}`);
  return res.json();
}

export default async function handler(req, res) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({
      sukses: false,
      pesan: 'Konfigurasi database tidak ditemukan.',
    });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ sukses: false, pesan: 'Method not allowed.' });
  }

  try {
    const data = await redisLrange('pendaftaran');
    return res.status(200).json(data ?? []);
  } catch (e) {
    return res.status(500).json({ sukses: false, pesan: 'Gagal membaca data.' });
  }
}
