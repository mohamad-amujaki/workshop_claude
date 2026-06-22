# Urutan Prompt — Workshop Claude Code

Berikut adalah seluruh prompt yang diketikkan dari awal hingga akhir sesi pembuatan proyek ini.

---

## Prompt 1

Bertindaklah sebagai web developer. Buatkan satu halaman web yang rapi dan modern untuk acara bernama "Workshop Claude Code". WAJIB ada: judul acara, tanggal, lokasi, dan deskripsi singkat yang menarik; form pendaftaran dengan kolom Nama, Email, dan Jumlah Tiket; serta tombol "Beli Tiket". Gunakan HTML, CSS, dan JavaScript sederhana dalam satu proyek yang rapi & mudah dipahami, dan pastikan tampilannya bersih, profesional, serta responsif (nyaman dibuka di HP maupun laptop). Setelah selesai, beri tahu saya file apa saja yang dibuat dan cara melihat hasilnya.

---

## Prompt 2

Jalankan aplikasinya sekarang, lalu beri saya langkah persis untuk membukanya di browser (alamat/port-nya). Kalau ada error saat dijalankan, perbaiki dulu sampai halamannya benar-benar terbuka.

---

## Prompt 3

Perbarui halaman: jadikan tombol "Beli Tiket" berwarna merah, tetapkan harga Rp50.000 per tiket, dan tampilkan TOTAL HARGA yang otomatis dihitung serta langsung berubah saat Jumlah Tiket diubah pengguna. Pastikan perhitungannya benar (mis. 2 tiket = Rp100.000), lalu konfirmasikan hasilnya ke saya.

---

## Prompt 4

Rapikan proyek ini agar mudah dirawat: beri nama file & bagian yang jelas, tambahkan komentar penjelas seperlunya, dan sederhanakan bagian yang terlalu rumit TANPA mengubah cara kerjanya. Setelah itu, jelaskan singkat struktur akhirnya dengan bahasa sederhana.

---

## Prompt 5

Periksa apakah ada bagian kode yang mulai berantakan atau berulang-ulang. Kalau ada, rapikan, pecah jadi bagian-bagian kecil, dan sederhanakan, tanpa mengubah fungsinya. Beri tahu saya apa yang dirapikan.

---

## Prompt 6

Perbaiki code pada file .js agar lulus linting dari library biomejs

---

## Prompt 7

Bertindaklah sebagai QA engineer. Tuliskan tes otomatis untuk form pendaftaran di proyek ini dengan skenario berikut: 1) Nama atau Email kosong saat "Beli Tiket" diklik -> muncul peringatan, data tak terkirim. 2) Jumlah Tiket = 2 -> total harga harus Rp100.000. 3) Format Email salah (mis. "abc") -> tampil pesan error yang jelas. 4) Semua diisi benar -> muncul konfirmasi pendaftaran berhasil. Setelah menulisnya, JALANKAN semua tes itu, lalu laporkan dengan jelas mana yang LULUS (hijau) dan mana yang GAGAL (merah).

---

## Prompt 8

Perbaiki semua tes yang GAGAL (merah), lalu jalankan ulang SELURUH tes sampai semuanya hijau. Jangan berhenti sebelum semua lulus. Laporkan hasil akhirnya ke saya.

---

## Prompt 9

Jelaskan dengan bahasa sederhana untuk orang non-teknis: apa yang diperiksa oleh masing-masing tes tadi, dan kenapa hal itu penting bagi pengguna.

---

## Prompt 10

Uji form ini seperti pengguna yang iseng: coba isi Jumlah Tiket dengan angka minus, huruf, dan angka sangat besar. Tangani SEMUA kasus tidak wajar itu dengan baik (tolak input & beri pesan ramah), lalu tuliskan tesnya juga dan jalankan untuk membuktikan sudah tertangani.

---

## Prompt 11

Tambahkan "API sendiri" di proyek ini: sebuah endpoint backend sederhana (mis. /api/daftar) yang menerima data form pendaftaran (nama, email, jumlah tiket), menyimpannya ke sebuah file data lokal, dan mengembalikan respons sukses berisi kode tiket unik. Sambungkan tombol "Beli Tiket" ke endpoint ini, dan pastikan data benar-benar tersimpan saat saya coba. Tidak perlu layanan luar atau API key. Konfirmasikan saat sudah berfungsi.

---

## Prompt 12

Setelah pengguna mengisi form dan klik "Beli Tiket", buatkan halaman e-tiket yang rapi dan profesional berisi: nama pendaftar, jumlah tiket, dan kode tiket unik. WAJIB tampilkan juga GAMBAR QR CODE dari kode tiket itu menggunakan API gratis https://api.qrserver.com (tanpa perlu API key). Pastikan e-tiket mudah dibaca dan bisa di-screenshot, lalu konfirmasikan ke saya saat sudah jadi.

---

## Prompt 13

Lakukan uji coba: daftar satu tiket atas nama "Charlie" sejumlah 2 tiket. Pastikan e-tiket muncul dengan data yang benar dan QR code-nya tampil sempurna. Kalau ada yang gagal, perbaiki sampai berhasil, lalu beri tahu saya hasilnya.

---

## Prompt 14

Tambahkan peta lokasi acara di halaman menggunakan OpenStreetMap (embed iframe), tepat mengarah ke alamat: Grand Indonesia Mall. Letakkan rapi di bawah deskripsi acara dan pastikan petanya benar-benar muncul saat halaman dibuka. Tidak perlu API key.

---

## Prompt 15

Rapikan proyek ini agar mudah dirawat: beri nama file & bagian yang jelas, kelompokkan, tambahkan komentar penjelas seperlunya, dan sederhanakan bagian yang terlalu rumit TANPA mengubah cara kerjanya. Lakukan refactoring jika diperlukan. Setelah itu, jelaskan singkat struktur akhirnya dengan bahasa sederhana.

---

## Prompt 16

Bertindaklah sebagai engineer yang menyiapkan rilis ke produksi. Periksa proyek ini secara menyeluruh dan siapkan agar 100% siap di-deploy ke Vercel. Pastikan: struktur folder benar, semua file konfigurasi yang dibutuhkan ada (mis. package.json & skrip build), tidak ada dependensi yang hilang, dan perintah build selesai tanpa error. Perbaiki SEMUA masalah yang Anda temukan, jangan hanya melaporkannya. Di akhir, beri saya ringkasan singkat: apa yang diperbaiki, dan apakah masih ada yang butuh tindakan dari saya.

---

## Prompt 17

Jalankan build versi PRODUKSI persis seperti yang akan dijalankan Vercel. Tangkap semua error dan warning penting, lalu perbaiki sampai build benar-benar bersih. Jangan berhenti sampai sukses. Konfirmasikan dengan jelas bahwa build sudah berhasil.

---

## Prompt 18

Lakukan pemeriksaan tampilan akhir secara teliti: cek di layar lebar DAN di layar HP. Pastikan tidak ada teks contoh, placeholder, data uji coba, tautan rusak, atau elemen yang berantakan/ terpotong. Rapikan semua yang perlu agar terlihat profesional. Lalu sebutkan apa yang diubah.

---

## Prompt 19

Lakukan audit keamanan sebelum proyek ini di-online-kan. Pastikan TIDAK ADA kunci rahasia, password, atau file .env yang akan ikut terunggah ke GitHub. Buat atau perbaiki .gitignore agar mengecualikan .env dan semua file sensitif. Setelah itu, daftarkan untuk saya: kunci/ variabel rahasia apa saja (kalau ada) yang nanti harus saya isi di pengaturan Vercel, lengkap dengan nama persisnya.

---

## Prompt 20

buatkan file prompt.md di dalam folder docs yang isinya adalah urutan prompt yang saya ketikkan dari awal sampai terakhir
