// ── Konfigurasi ─────────────────────────────────────────────
// Ubah nilai di sini; total akan otomatis menyesuaikan.
const HARGA_PER_TIKET = 50000;
const MAKS_TIKET      = 5;

// ── Referensi elemen DOM ──────────────────────────────────────
const form       = document.getElementById('registerForm');
const inputNama  = document.getElementById('nama');
const inputEmail = document.getElementById('email');
const inputTiket = document.getElementById('tiket');
const totalBox   = document.getElementById('totalBox');
const totalAmt   = document.getElementById('totalAmount');
const btnSubmit  = document.getElementById('btnSubmit');
const apiErrorEl = document.getElementById('apiError');

// ── Perbarui total secara real-time saat jumlah tiket diketik ─
inputTiket.addEventListener('input', () => {
  if (errorTiket(inputTiket.value)) {
    totalBox.style.display = 'none';
    return;
  }
  totalAmt.textContent   = formatRupiah(getQty() * HARGA_PER_TIKET);
  totalBox.style.display = 'block';
});

// ── Validasi & kirim ke API ───────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  apiErrorEl.textContent = '';

  const fields = [
    { input: inputNama,  errorId: 'namaError',  pesan: errorNama(inputNama.value)   },
    { input: inputEmail, errorId: 'emailError', pesan: errorEmail(inputEmail.value) },
    { input: inputTiket, errorId: 'tiketError', pesan: errorTiket(inputTiket.value) },
  ];

  // map (bukan every) agar SEMUA field diproses dan semua error tampil sekaligus
  const valid = fields.map(({ input, errorId, pesan }) => tampilkanError(input, errorId, pesan)).every(Boolean);
  if (!valid) return;

  btnSubmit.disabled    = true;
  btnSubmit.textContent = 'Memproses...';

  try {
    const res  = await fetch('/api/daftar', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        nama:        inputNama.value.trim(),
        email:       inputEmail.value.trim(),
        jumlahTiket: getQty(),
      }),
    });
    const data = await res.json();

    if (!data.sukses) {
      apiErrorEl.textContent = data.pesan ?? 'Terjadi kesalahan. Coba lagi.';
      return;
    }

    // Redirect ke halaman e-tiket dengan data sebagai URL params
    const params = new URLSearchParams({
      kode:  data.kodeTiket,
      nama:  inputNama.value.trim(),
      email: inputEmail.value.trim(),
      qty:   String(getQty()),
    });
    window.location.href = `/tiket?${params.toString()}`;

  } catch (err) {
    apiErrorEl.textContent = 'Gagal memproses pendaftaran. Coba lagi atau hubungi panitia.';
    console.error('Fetch error:', err);
  } finally {
    btnSubmit.disabled    = false;
    btnSubmit.textContent = 'Beli Tiket →';
  }
});

// ── Helpers ───────────────────────────────────────────────────

function getQty() {
  return parseInt(inputTiket.value, 10) || 0;
}

// Tampilkan atau hapus pesan error pada satu field.
// Mengembalikan true jika field valid (tidak ada pesan error).
function tampilkanError(input, errorId, pesan) {
  document.getElementById(errorId).textContent = pesan;
  input.classList.toggle('is-error', !!pesan);
  return !pesan;
}

// Kembalikan pesan error untuk field Nama, atau '' jika valid.
function errorNama(v) {
  const s = v.trim();
  if (!s)           return 'Nama tidak boleh kosong.';
  if (s.length < 2) return 'Nama minimal 2 karakter.';
  return '';
}

// Kembalikan pesan error untuk field Email, atau '' jika valid.
function errorEmail(v) {
  if (!v.trim())                              return 'Email tidak boleh kosong.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Format email tidak valid.';
  return '';
}

// Kembalikan pesan error untuk field Tiket, atau '' jika valid.
// Menangani semua input tidak wajar: kosong, huruf, minus, nol, desimal, terlalu besar.
function errorTiket(v) {
  const n = Number(v);
  if (v.trim() === '' || !Number.isFinite(n)) return 'Masukkan jumlah tiket (1–5).';
  if (!Number.isInteger(n))                   return 'Jumlah tiket harus bilangan bulat.';
  if (n < 1)                                  return 'Jumlah tiket minimal 1.';
  if (n > MAKS_TIKET)                         return `Maksimal ${MAKS_TIKET} tiket per peserta.`;
  return '';
}

function formatRupiah(n) {
  return `Rp ${n.toLocaleString('id-ID')}`;
}
