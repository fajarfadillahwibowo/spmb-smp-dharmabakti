# Panduan Menjalankan SPMB Mobile (React Native + Laravel 11)

Aplikasi SPMB SMP Dharma Bakti Mobile dibangun menggunakan **React Native (Expo)** yang terhubung langsung dengan backend **Laravel 11 REST API** dan database **MySQL**.

---

## 1. Menjalankan Backend Laravel API

Pastikan MySQL (Laragon / XAMPP) sudah berjalan, lalu buka terminal di root project:

```bash
# Di folder root: d:\laragon\www\spmb-smp-dharma-bakti
php artisan serve --host=0.0.0.0 --port=8000
```
> Menggunakan `--host=0.0.0.0` penting agar server Laravel dapat diakses oleh smartphone/HP yang berada di jaringan WiFi yang sama.

---

## 2. Menjalankan Aplikasi Mobile (React Native)

Buka terminal di folder `mobile`:

```bash
cd d:\laragon\www\spmb-smp-dharma-bakti\mobile
npx.cmd expo start
```

### Opsi Pengujian:
1. **Di Smartphone Fisik (Android / iOS):**
   - Unduh aplikasi **Expo Go** dari Google Play Store atau Apple App Store.
   - Sambungkan HP ke jaringan WiFi yang sama dengan laptop.
   - Scan QR code yang tampil di terminal / browser.
   - Masukkan IP Laptop Anda di ikon gear ⚙️ pada layar login (contoh: `http://192.168.1.50:8000/api`).

2. **Di Emulator Android:**
   - Buka Android Studio Emulator.
   - Tekan tombol `a` di terminal expo.
   - Default URL API untuk emulator: `http://10.0.2.2:8000/api`.

3. **Di Browser Web:**
   - Tekan tombol `w` di terminal expo untuk preview web.

---

## 3. Akun Pengujian Bawaan

| Role | Username | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `password` | Akses penuh verifikasi berkas, penilaian seleksi, pembayaran, & laporan |
| **Calon Siswa** | *(Daftar Baru)* | *(Password Anda)* | Daftar akun via form registrasi mobile, verifikasi OTP, & isi formulir |

---

## 4. Struktur Endpoint API Laravel

| Method | Endpoint | Fungsi |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Pendaftaran akun calon siswa baru |
| `POST` | `/api/auth/verify-otp` | Verifikasi kode OTP email |
| `POST` | `/api/auth/login` | Login user & return Sanctum Token |
| `POST` | `/api/auth/logout` | Revoke token autentikasi |
| `GET` | `/api/auth/me` | Ambil profil user yang sedang aktif |
| `GET/POST` | `/api/siswa/formulir` | Ambil / simpan formulir pendaftaran |
| `GET/POST` | `/api/siswa/dokumen` | Cek status / upload 4 dokumen berkas |
| `GET` | `/api/siswa/seleksi` | Status jadwal dan nilai seleksi |
| `GET` | `/api/siswa/pengumuman` | Pengumuman hasil kelulusan SPMB |
| `GET` | `/api/siswa/cetak-bukti` | Link unduh PDF surat penerimaan |
| `GET/POST` | `/api/siswa/pembayaran` | Info rekening & upload bukti transfer |
| `GET` | `/api/admin/dashboard` | Statistik dan data ringkasan SPMB |
| `GET/SHOW` | `/api/admin/pendaftar` | List dan detail lengkap calon siswa |
| `GET/PUT` | `/api/admin/verifikasi-berkas` | Verifikasi (approve/reject) dokumen |
| `GET/PUT` | `/api/admin/verifikasi-seleksi` | Input nilai seleksi & kelulusan |
| `GET/PUT` | `/api/admin/pembayaran` | Verifikasi bukti pembayaran |
| `GET` | `/api/admin/laporan` | Rekapitulasi laporan seluruh data |
