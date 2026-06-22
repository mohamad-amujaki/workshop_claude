import { Redis } from '@upstash/redis';
import { randomBytes } from 'node:crypto';

const redis = Redis.fromEnv();

function buatKodeTiket() {
  const tgl  = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const acak = randomBytes(3).toString('hex').toUpperCase();
  return `WCC-${tgl}-${acak}`;
}

export default async function handler(req, res) {
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
  await redis.rpush('pendaftaran', {
    nama: namaBersih,
    email: emailBersih,
    jumlahTiket: qty,
    kodeTiket,
    waktu: new Date().toISOString(),
  });

  return res.status(200).json({ sukses: true, kodeTiket });
}
