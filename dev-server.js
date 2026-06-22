import express          from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { randomBytes }  from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const DATA_DIR   = join(__dirname, 'data');
const DATA_FILE  = join(DATA_DIR, 'pendaftaran.json');
const PORT       = 3000;

// ── Inisialisasi ──────────────────────────────────────────────
if (!existsSync(DATA_DIR))  mkdirSync(DATA_DIR);
if (!existsSync(DATA_FILE)) writeFileSync(DATA_FILE, '[]', 'utf8');

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // sajikan index.html, style.css, script.js

// ── Helpers data ──────────────────────────────────────────────
const bacaData   = ()    => JSON.parse(readFileSync(DATA_FILE, 'utf8'));
const simpanData = (arr) => writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');

// Format: WCC-20260622-A3F9C1
function buatKodeTiket() {
  const tgl  = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const acak = randomBytes(3).toString('hex').toUpperCase();
  return `WCC-${tgl}-${acak}`;
}

// ── POST /api/daftar ──────────────────────────────────────────
app.post('/api/daftar', (req, res) => {
  const { nama, email, jumlahTiket } = req.body ?? {};

  // Validasi server-side (lapisan kedua setelah validasi di browser)
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
  const entri = {
    nama:        namaBersih,
    email:       emailBersih,
    jumlahTiket: qty,
    kodeTiket,
    waktu:       new Date().toISOString(),
  };

  const daftar = bacaData();
  daftar.push(entri);
  simpanData(daftar);

  return res.json({ sukses: true, kodeTiket });
});

// ── GET /tiket — halaman e-tiket ─────────────────────────────
app.get('/tiket', (_req, res) => {
  res.sendFile(join(__dirname, 'tiket.html'));
});

// ── GET /api/pendaftaran — lihat semua data tersimpan ─────────
app.get('/api/pendaftaran', (_req, res) => {
  res.json(bacaData());
});

app.listen(PORT, () => console.log(`Server berjalan → http://localhost:${PORT}`));
