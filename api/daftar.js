import { randomBytes } from 'node:crypto';

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';

function buatKodeTiket() {
  const tgl  = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const acak = randomBytes(3).toString('hex').toUpperCase();
  return `WCC-${tgl}-${acak}`;
}

async function redisRpush(key, value) {
  const url = `${REDIS_URL.replace(/\/$/, '')}/rpush/${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['element', JSON.stringify(value)]),
  });
  if (!res.ok) throw new Error(`Redis error: ${res.status}`);
  return res.json();
}

export default async function handler(req, res) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({
      sukses: false,
      pesan: 'Konfigurasi database tidak ditemukan. Pastikan environment variable Redis (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN) sudah diatur di Vercel.',
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ sukses: false, pesan: 'Method not allowed.' });
  }

  const { nama, email, jumlahTiket } = req.body ?? {};
  const namaBersih  = (nama  ?? '').trim();
  const emailBersih = (email ?? '').trim();
  const qty         = Number(jumlahTiket);

  if (!namaBersih || !emailBersih) {
    return res.status(400).json({ sukses: false, pesan: 'Nama dan email wajib diisi.' });
  }
  if (!Number.isInteger(qty) || qty < 1 || qty > 5) {
    return res.status(400).json({ sukses: false, pesan: 'Jumlah tiket tidak valid (1–5).' });
  }

  const kodeTiket = buatKodeTiket();
  await redisRpush('pendaftaran', {
    nama: namaBersih,
    email: emailBersih,
    jumlahTiket: qty,
    kodeTiket,
    waktu: new Date().toISOString(),
  });

  return res.status(200).json({ sukses: true, kodeTiket });
}
