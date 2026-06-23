import express from 'express';
import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const DATA_DIR  = join(__dirname, 'data');
const DATA_FILE = join(DATA_DIR, 'pendaftaran.json');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

if (!existsSync(DATA_DIR)) {
  try { mkdirSync(DATA_DIR); } catch {}
}
if (!existsSync(DATA_FILE)) {
  try { writeFileSync(DATA_FILE, '[]', 'utf8'); } catch {}
}

const bacaData   = () => JSON.parse(readFileSync(DATA_FILE, 'utf8'));
const simpanData = (arr) => writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');

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
}

async function redisLrange(key) {
  const url = `${REDIS_URL.replace(/\/$/, '')}/lrange/${key}/0/-1`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Redis error: ${res.status}`);
  return res.json();
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/daftar', async (req, res) => {
  if (REDIS_URL && REDIS_TOKEN) {
    try {
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
    } catch (e) {
      return res.status(500).json({ sukses: false, pesan: 'Gagal menyimpan ke database.' });
    }
  }

  try {
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
    const daftar = bacaData();
    daftar.push({
      nama: namaBersih,
      email: emailBersih,
      jumlahTiket: qty,
      kodeTiket,
      waktu: new Date().toISOString(),
    });
    simpanData(daftar);

    return res.status(200).json({ sukses: true, kodeTiket });
  } catch (e) {
    return res.status(500).json({ sukses: false, pesan: 'Gagal menyimpan data.' });
  }
});

app.get('/api/pendaftaran', async (_req, res) => {
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const data = await redisLrange('pendaftaran');
      return res.status(200).json(data ?? []);
    } catch {
      return res.status(500).json({ sukses: false, pesan: 'Gagal membaca database.' });
    }
  }

  try {
    return res.status(200).json(bacaData());
  } catch {
    return res.status(500).json({ sukses: false, pesan: 'Gagal membaca data.' });
  }
});

app.get('/tiket', (_req, res) => {
  res.sendFile(join(__dirname, 'tiket.html'));
});

const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server berjalan → http://localhost:${PORT}`));
}

export default app;
