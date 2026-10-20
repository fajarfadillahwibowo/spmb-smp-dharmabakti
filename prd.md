Act as a Senior and Expert Fullstack Web Developer. Tugas Anda adalah merancang dan membangun sebuah sistem berbasis web tanpa error dengan kualitas production-ready, clean code, dan terstruktur.

Saya membutuhkan Anda untuk membuat kode untuk "Sistem Informasi Penerimaan Murid Baru (SPMB) Berbasis Web pada SMP Dharma Bakti".

**TEKNOLOGI YANG HARUS DIGUNAKAN:**
- Backend: Laravel versi 11, PHP.
- Database: MySQL (manajemen via phpMyAdmin).
- Frontend: HTML murni, Tailwind-CSS, dan JavaScript murni (TIDAK menggunakan framework JS apapun seperti react dan vue). 
- Desain UI/UX: Buat tampilan antarmuka yang bersih, responsif, user-friendly, dengan gaya desain modern menggunakan pendekatan card-based layout dan elemen warna yang rapi, gunakan bahasa indonesia dalam penulisan, gunakan kombinasi animasi GSAP untuk transisi halaman.

Berikut adalah Product Requirements Document (PRD) kompleks untuk tahap pertama pengembangan yang berfokus pada 2 Portal Login (Calon Siswa dan Admin):

### 1. AKTOR & HAK AKSES
Sistem ini menggunakan arsitektur autentikasi berbasis role yang melibatkan dua aktor utama:
A. **Calon Siswa**: Aktor yang mendaftar secara online, mengisi formulir, mengunggah dokumen, melihat pengumuman, mencetak bukti pendaftaran/lulus, dan mengunggah bukti pembayaran[cite: 1].
B. **Admin (Panitia SPMB)**: Aktor pengelola yang memiliki hak akses penuh untuk mengelola data pendaftar, memverifikasi dokumen persyaratan, melakukan penilaian dan seleksi, menentukan kelulusan, memverifikasi pembayaran, serta mencetak laporan akhir[cite: 1].

### 2. STRUKTUR MENU & SIDEBAR (STRICTLY REQUIRED)
Anda dilarang keras menambahi fitur/menu lain atau mengurangi fitur di bawah ini. Patuhi menu berikut yang diadaptasi dari flowchart dan use case sistem[cite: 1]:

**PORTAL CALON SISWA (Sidebar & Navigasi):**
1. **Registrasi Akun**: Pendaftaran menggunakan nama, username, password, dan email aktif. Wajib menyertakan sistem verifikasi OTP (One-Time Password) via email[cite: 1].
2. **Login Pengguna**[cite: 1].
3. **Formulir Pendaftaran**: Halaman pengisian data diri, nisn, data orang tua/wali, dan data asal sekolah[cite: 1].
4. **Upload Dokumen Persyaratan**: Form untuk mengunggah dokumen (pasfoto, akta kelahiran, kartu keluarga, dan ijazah/SKL) beserta sistem validasi format dan ukuran file[cite: 1].
5. **Pengumuman / Hasil Seleksi**: Halaman bagi siswa untuk mengecek status seleksi (Diterima / Tidak Diterima)[cite: 1].
6. **Cetak Bukti Penerimaan**: Fitur mengunduh dan mencetak surat bukti penerimaan kelulusan dalam format PDF[cite: 1].
7. **Pembayaran Pendaftaran**: Halaman informasi nomor rekening sekolah dan form upload foto/file bukti transfer pembayaran[cite: 1].

**PORTAL ADMIN (Sidebar & Navigasi):**
1. **Login Admin**[cite: 1].
2. **Dashboard Admin**: Halaman utama yang menampilkan ringkasan/statistik sistem[cite: 1].
3. **Kelola Data Pendaftar**: Halaman untuk melihat, mencari, memfilter, dan mengedit data calon siswa. Wajib ada fitur Ekspor Data ke Excel[cite: 1].
4. **Verifikasi Berkas & Seleksi**: Halaman khusus untuk memeriksa validitas/kesesuaian dokumen pendaftar, memberikan catatan, memproses penilaian seleksi, serta mengubah status kelulusan (Diterima / Tidak Diterima)[cite: 1].
5. **Verifikasi Pembayaran**: Halaman untuk meninjau bukti transfer dari pendaftar yang lulus, serta mengubah status pembayaran menjadi "Cicilan" atau "Lunas"[cite: 1].
6. **Cetak Laporan**: Fitur untuk mencetak dan mengekspor rekapitulasi data pendaftaran/siswa secara menyeluruh[cite: 1].

### 3. DATABASE SCHEMA & RELATIONSHIPS
Buatkan struktur skema Migration Laravel yang merepresentasikan Class Diagram dan ERD berikut[cite: 1]:
- `users`: id, username, email, password, role (admin/siswa).
- `admins`: id_admin, id_user, nama_admin, nip_nik, no_hp, jabatan.
- `calon_siswas`: id_calon_siswa, id_user, nama_lengkap, nisn, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, nama_ortu_wali, no_hp_ortu.
- `pendaftarans`: id_pendaftaran, id_calon_siswa, nomor_pendaftaran, tanggal_daftar, asal_sekolah, status_pendaftaran.
- `dokumens`: id_dokumen, id_pendaftaran, akte_kelahiran, kartu_keluarga, pasfoto, ijazah.
- `seleksis`: id_seleksi, id_pendaftaran, tanggal_seleksi, nilai_seleksi, status_seleksi.
- `pengumumans`: id_pengumuman, id_seleksi, hasil_pendaftaran, tanggal_pengumuman, cetak_bukti.

### 4. INSTRUKSI PENGERJAAN & OUTPUT KODE
Tolong berikan respons selangkah demi selangkah yang mencakup:
1. **Setup & Struktur Folders**: Penjelasan struktur MVC yang digunakan.
2. **Migrations & Models**: Kode lengkap untuk file migrasi database beserta penulisan relasi (HasOne, BelongsTo, HasMany) di dalam Model.
3. **Routing (`routes/web.php`)**: Susunan rute lengkap yang sudah dilindungi oleh middleware auth dan dibatasi hak aksesnya berdasarkan role (admin vs siswa).
4. **Controllers Implementation**: Tuliskan implementasi kode PHP untuk 2 Controller krusial: `AdminPendaftarController` (termasuk fitur verifikasi dan export ke Excel) dan `SiswaPendaftaranController` (termasuk fitur upload berkas tervalidasi).
5. **UI/UX Dasar (HTML & Tailwind CSS)**: Berikan kode snippet untuk file `layout.blade.php` yang berisi struktur Sidebar navigasi yang presisi dengan daftar menu di atas menggunakan custom tailwind CSS. Gunakan kombinasi animasi GSAP untuk transisi halaman.

Berikan kode yang rapi dan ada docstring / komentar di setiap baris kode, utamakan keamanan (enkripsi password, proteksi route, validasi form input, validasi file upload, dll), dan pastikan logika alurnya sempurna. Hindari penggunaan library/package pihak ketiga jika tidak diperlukan. dan menggunakan bahasa indonesia dalam penulisan kode, termasuk pada komentar dan dokumentasi. 