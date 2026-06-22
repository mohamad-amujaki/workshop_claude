import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// helper: isi nama & email dengan nilai valid
async function isiNamaEmail(page) {
  await page.fill('#nama', 'Budi Santoso');
  await page.fill('#email', 'budi@example.com');
}

// helper: paksa nilai ke input tiket via JS (untuk kasus yang browser tolak lewat keyboard)
async function paksakanNilaiTiket(page, nilai) {
  await page.evaluate((v) => {
    const el = document.getElementById('tiket');
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
      .set.call(el, v);
    el.dispatchEvent(new InputEvent('input', { bubbles: true }));
  }, nilai);
}

// ─────────────────────────────────────────────────────────────
// Kelompok 1 — Field kosong
// ─────────────────────────────────────────────────────────────
test('1a. Semua field kosong → semua peringatan muncul', async ({ page }) => {
  await page.click('button[type="submit"]');

  await expect(page.locator('#namaError')).toHaveText('Nama tidak boleh kosong.');
  await expect(page.locator('#emailError')).toHaveText('Email tidak boleh kosong.');
  await expect(page.locator('#tiketError')).toHaveText('Masukkan jumlah tiket (1–5).');
  await expect(page).toHaveURL('/');
});

test('1b. Nama diisi, email kosong → hanya error email yang muncul', async ({ page }) => {
  await page.fill('#nama', 'Budi Santoso');
  await page.click('button[type="submit"]');

  await expect(page.locator('#namaError')).toBeEmpty();
  await expect(page.locator('#emailError')).toHaveText('Email tidak boleh kosong.');
  await expect(page).toHaveURL('/');
});

// ─────────────────────────────────────────────────────────────
// Kelompok 2 — Kalkulasi harga
// ─────────────────────────────────────────────────────────────
test('2. Isi 2 tiket → total harga tampil Rp 100.000', async ({ page }) => {
  await expect(page.locator('#totalBox')).toBeHidden();
  await page.fill('#tiket', '2');
  await expect(page.locator('#totalBox')).toBeVisible();
  await expect(page.locator('#totalAmount')).toHaveText('Rp 100.000');
});

test('2b. Ganti dari 2 ke 5 tiket → total berubah jadi Rp 250.000', async ({ page }) => {
  await page.fill('#tiket', '2');
  await expect(page.locator('#totalAmount')).toHaveText('Rp 100.000');
  await page.fill('#tiket', '5');
  await expect(page.locator('#totalAmount')).toHaveText('Rp 250.000');
});

// ─────────────────────────────────────────────────────────────
// Kelompok 3 — Format email salah
// ─────────────────────────────────────────────────────────────
test('3a. Email "abc" (tanpa @) → error format email', async ({ page }) => {
  await page.fill('#nama', 'Budi Santoso');
  await page.fill('#email', 'abc');
  await page.fill('#tiket', '1');
  await page.click('button[type="submit"]');
  await expect(page.locator('#emailError')).toHaveText('Format email tidak valid.');
  await expect(page).toHaveURL('/');
});

test('3b. Email "abc@" (tidak ada domain) → error format email', async ({ page }) => {
  await page.fill('#nama', 'Budi Santoso');
  await page.fill('#email', 'abc@');
  await page.fill('#tiket', '1');
  await page.click('button[type="submit"]');
  await expect(page.locator('#emailError')).toHaveText('Format email tidak valid.');
});

test('3c. Email valid "budi@example.com" → tidak ada error, form berhasil dikirim', async ({ page }) => {
  await page.fill('#nama', 'Budi Santoso');
  await page.fill('#email', 'budi@example.com');
  await page.fill('#tiket', '1');
  // Pastikan tidak ada error email sebelum submit
  await expect(page.locator('#emailError')).toBeEmpty();
  await page.click('button[type="submit"]');
  // Redirect ke /tiket membuktikan email diterima tanpa error
  await page.waitForURL(/\/tiket/);
  await expect(page).toHaveURL(/\/tiket/);
});

// ─────────────────────────────────────────────────────────────
// Kelompok 4 — Submit valid → redirect ke halaman e-tiket
// ─────────────────────────────────────────────────────────────
test('4a. Submit valid → redirect ke /tiket dengan data yang benar', async ({ page }) => {
  await page.fill('#nama', 'Siti Rahayu');
  await page.fill('#email', 'siti@example.com');
  await page.fill('#tiket', '2');
  await page.click('button[type="submit"]');

  await page.waitForURL(/\/tiket/);
  const url = new URL(page.url());

  expect(url.pathname).toBe('/tiket');
  expect(url.searchParams.get('nama')).toBe('Siti Rahayu');
  expect(url.searchParams.get('email')).toBe('siti@example.com');
  expect(url.searchParams.get('qty')).toBe('2');
  expect(url.searchParams.get('kode')).toMatch(/^WCC-\d{8}-[A-F0-9]{6}$/);
});

test('4b. Halaman e-tiket menampilkan semua info dengan benar', async ({ page }) => {
  await page.fill('#nama', 'Rina Wulandari');
  await page.fill('#email', 'rina@example.com');
  await page.fill('#tiket', '3');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/tiket/);

  await expect(page.locator('#ticketNama')).toHaveText('Rina Wulandari');
  await expect(page.locator('#ticketEmail')).toHaveText('rina@example.com');
  await expect(page.locator('#ticketQty')).toHaveText('3 Tiket');
  await expect(page.locator('#ticketKode')).toHaveText(/^WCC-\d{8}-[A-F0-9]{6}$/);
});

test('4c. QR code pada e-tiket mengarah ke URL qrserver.com dengan kode tiket', async ({ page }) => {
  await page.fill('#nama', 'Andi Kurniawan');
  await page.fill('#email', 'andi@example.com');
  await page.fill('#tiket', '1');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/tiket/);

  const src = await page.locator('#qrImg').getAttribute('src');
  expect(src).toContain('api.qrserver.com');
  expect(src).toContain('WCC-');
});

test('4d. Tombol kembali di e-tiket mengarah ke halaman utama', async ({ page }) => {
  await page.fill('#nama', 'Dewi Lestari');
  await page.fill('#email', 'dewi@example.com');
  await page.fill('#tiket', '1');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/tiket/);

  await page.click('.btn-back');
  await page.waitForURL('/');
  await expect(page.locator('h1')).toContainText('Workshop');
});

test('4e. Data tersimpan di server → GET /api/pendaftaran memuat entri baru', async ({ page, request }) => {
  await page.fill('#nama', 'Fajar Ramadhan');
  await page.fill('#email', 'fajar@example.com');
  await page.fill('#tiket', '4');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/tiket/);

  const res  = await request.get('/api/pendaftaran');
  const data = await res.json();
  const entri = data.find((d) => d.email === 'fajar@example.com');

  expect(entri).toBeDefined();
  expect(entri.nama).toBe('Fajar Ramadhan');
  expect(entri.jumlahTiket).toBe(4);
  expect(entri.kodeTiket).toMatch(/^WCC-\d{8}-[A-F0-9]{6}$/);
});

// ─────────────────────────────────────────────────────────────
// Kelompok 5 — Input tidak wajar pada Jumlah Tiket
// ─────────────────────────────────────────────────────────────
test('5a. Tiket diisi angka minus (-3) → error "Jumlah tiket minimal 1."', async ({ page }) => {
  await isiNamaEmail(page);
  await page.fill('#tiket', '-3');
  await page.click('button[type="submit"]');
  await expect(page.locator('#tiketError')).toHaveText('Jumlah tiket minimal 1.');
  await expect(page).toHaveURL('/');
});

test('5b. Tiket diisi nol (0) → error "Jumlah tiket minimal 1."', async ({ page }) => {
  await isiNamaEmail(page);
  await page.fill('#tiket', '0');
  await page.click('button[type="submit"]');
  await expect(page.locator('#tiketError')).toHaveText('Jumlah tiket minimal 1.');
});

test('5c. Tiket diisi huruf ("abc") → error "Masukkan jumlah tiket (1–5)."', async ({ page }) => {
  await isiNamaEmail(page);
  await paksakanNilaiTiket(page, 'abc');
  await page.click('button[type="submit"]');
  await expect(page.locator('#tiketError')).toHaveText('Masukkan jumlah tiket (1–5).');
});

test('5d. Tiket diisi angka sangat besar (9999) → error "Maksimal 5 tiket per peserta."', async ({ page }) => {
  await isiNamaEmail(page);
  await page.fill('#tiket', '9999');
  await page.click('button[type="submit"]');
  await expect(page.locator('#tiketError')).toHaveText('Maksimal 5 tiket per peserta.');
});

test('5e. Tiket diisi desimal (1.5) → error "Jumlah tiket harus bilangan bulat."', async ({ page }) => {
  await isiNamaEmail(page);
  await paksakanNilaiTiket(page, '1.5');
  await page.click('button[type="submit"]');
  await expect(page.locator('#tiketError')).toHaveText('Jumlah tiket harus bilangan bulat.');
});

test('5f. Total langsung hilang saat nilai tiket jadi tidak valid', async ({ page }) => {
  await page.fill('#tiket', '3');
  await expect(page.locator('#totalBox')).toBeVisible();
  await page.fill('#tiket', '-1');
  await expect(page.locator('#totalBox')).toBeHidden();
});
