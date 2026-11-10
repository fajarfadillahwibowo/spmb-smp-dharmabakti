<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Siswa;
use App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Api\KepalaSekolah;

/*
|--------------------------------------------------------------------------
| API Routes - SPMB SMP Dharma Bakti
|--------------------------------------------------------------------------
| Semua route di sini otomatis mendapat prefix /api/
| Autentikasi menggunakan Laravel Sanctum (token-based)
|
| Endpoint Publik  : /api/auth/*
| Endpoint Siswa   : /api/siswa/* (membutuhkan token + role siswa)
| Endpoint Admin   : /api/admin/* (membutuhkan token + role admin)
*/

// =========================================================================
// ENDPOINT AUTENTIKASI (Publik - tidak perlu token)
// =========================================================================
Route::prefix('auth')->name('api.auth.')->group(function () {
    // POST /api/auth/register - Registrasi akun siswa baru
    Route::post('/register', [AuthController::class, 'register'])->name('register');

    // POST /api/auth/login - Login dan dapatkan token
    Route::post('/login', [AuthController::class, 'login'])->name('login');

    // POST /api/auth/verify-otp - Verifikasi kode OTP dari email
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])->name('verify-otp');

    // POST /api/auth/resend-otp - Kirim ulang kode OTP
    Route::post('/resend-otp', [AuthController::class, 'resendOtp'])->name('resend-otp');

    // POST /api/auth/forgot-password - Minta kode OTP reset kata sandi ke email
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('forgot-password');

    // POST /api/auth/reset-password - Reset password baru dengan kode OTP
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('reset-password');

    // POST /api/auth/resend-reset-otp - Kirim ulang kode OTP reset password
    Route::post('/resend-reset-otp', [AuthController::class, 'resendResetOtp'])->name('resend-reset-otp');
});

// Endpoint unduh file rekapitulasi Excel admin
Route::get('/admin/download-rekap-excel', [Admin\LaporanController::class, 'exportExcel'])->name('admin.download-excel');
Route::get('/laporan/download-pdf', [Admin\LaporanController::class, 'exportPdf'])->name('api.laporan.download-pdf');
Route::get('/laporan/preview-pdf', [Admin\LaporanController::class, 'previewPdf'])->name('api.laporan.preview-pdf');
Route::get('/admin/download-file', [Admin\LaporanController::class, 'downloadFile'])->name('api.admin.download-file');

// =========================================================================
// ENDPOINT YANG MEMBUTUHKAN AUTENTIKASI TOKEN (auth:sanctum)
// =========================================================================
Route::middleware('auth:sanctum')->group(function () {

    // GET  /api/auth/me     - Ambil data user yang sedang login
    // POST /api/auth/logout - Logout dan cabut token
    Route::get('/auth/me', [AuthController::class, 'me'])->name('api.auth.me');
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('api.auth.logout');
    Route::post('/auth/profile', [AuthController::class, 'updateProfile'])->name('api.auth.profile.update');
    Route::delete('/auth/profile/photo', [AuthController::class, 'deleteProfilePhoto'])->name('api.auth.profile.photo.delete');

    // Info rekening pembayaran sekolah dinamis (bisa diakses oleh seluruh pengguna)
    Route::get('/pengaturan-pembayaran', [Admin\PembayaranController::class, 'getPengaturan'])->name('api.pengaturan-pembayaran');

    // =====================================================================
    // PORTAL SISWA - Hanya bisa diakses oleh user dengan role 'siswa'
    // =====================================================================
    Route::middleware('role:siswa')->prefix('siswa')->name('api.siswa.')->group(function () {

        // GET  /api/siswa/dashboard - Ringkasan status pendaftaran
        Route::get('/dashboard', [Siswa\DashboardController::class, 'index'])->name('dashboard');

        // GET  /api/siswa/formulir - Ambil data formulir yang sudah diisi
        // POST /api/siswa/formulir - Simpan/perbarui data formulir pendaftaran
        Route::get('/formulir', [Siswa\PendaftaranController::class, 'show'])->name('formulir.show');
        Route::post('/formulir', [Siswa\PendaftaranController::class, 'store'])->name('formulir.store');

        // GET  /api/siswa/dokumen  - Cek status dokumen yang sudah diupload
        // POST /api/siswa/dokumen  - Upload dokumen persyaratan (multipart/form-data)
        // POST /api/siswa/dokumen/ajukan-ulang - Ajukan ulang verifikasi setelah revisi
        Route::get('/dokumen', [Siswa\DokumenController::class, 'show'])->name('dokumen.show');
        Route::post('/dokumen', [Siswa\DokumenController::class, 'upload'])->name('dokumen.upload');
        Route::post('/dokumen/ajukan-ulang', [Siswa\DokumenController::class, 'ajukanUlang'])->name('dokumen.ajukan-ulang');

        // GET  /api/siswa/seleksi  - Data jadwal dan status seleksi
        // GET  /api/siswa/seleksi/cetak-kartu - URL unduh kartu ujian PDF
        Route::get('/seleksi', [Siswa\SeleksiController::class, 'index'])->name('seleksi.index');
        Route::get('/seleksi/cetak-kartu', [Siswa\SeleksiController::class, 'getUrl'])->name('seleksi.cetak-kartu');

        // GET  /api/siswa/pengumuman - Hasil pengumuman kelulusan
        Route::get('/pengumuman', [Siswa\PengumumanController::class, 'index'])->name('pengumuman.index');

        // GET  /api/siswa/cetak-bukti - URL untuk mengunduh PDF bukti penerimaan
        Route::get('/cetak-bukti', [Siswa\CetakBuktiController::class, 'getUrl'])->name('cetak-bukti');

        // GET  /api/siswa/pembayaran  - Info rekening dan status pembayaran
        // POST /api/siswa/pembayaran  - Upload bukti transfer pembayaran
        Route::get('/pembayaran', [Siswa\PembayaranController::class, 'show'])->name('pembayaran.show');
        Route::post('/pembayaran', [Siswa\PembayaranController::class, 'upload'])->name('pembayaran.upload');

        // GET  /api/siswa/notifikasi          - Ambil notifikasi dari admin (broadcast + personal)
        // POST /api/siswa/notifikasi/{id}/read - Tandai satu notifikasi sudah dibaca
        // POST /api/siswa/notifikasi/read-all  - Tandai semua notifikasi sudah dibaca
        Route::get('/notifikasi', [Siswa\NotifikasiController::class, 'index'])->name('notifikasi.index');
        Route::post('/notifikasi/{id}/read', [Siswa\NotifikasiController::class, 'markRead'])->name('notifikasi.read');
        Route::post('/notifikasi/read-all', [Siswa\NotifikasiController::class, 'markAllRead'])->name('notifikasi.read-all');

        // GET  /api/siswa/chat              - Riwayat chat langsung dengan admin
        // POST /api/siswa/chat              - Kirim pesan ke admin
        // GET  /api/siswa/chat/unread-count - Jumlah pesan belum dibaca
        Route::get('/chat', [Siswa\ChatController::class, 'index'])->name('chat.index');
        Route::post('/chat', [Siswa\ChatController::class, 'send'])->name('chat.send');
        Route::get('/chat/unread-count', [Siswa\ChatController::class, 'unreadCount'])->name('chat.unread');
    });

    // =====================================================================
    // PORTAL ADMIN - Hanya bisa diakses oleh user dengan role 'admin'
    // =====================================================================
    Route::middleware('role:admin')->prefix('admin')->name('api.admin.')->group(function () {

        // GET  /api/admin/dashboard - Statistik dan ringkasan data SPMB
        Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

        // GET  /api/admin/pendaftar       - Daftar semua pendaftar (dengan search & filter)
        // GET  /api/admin/pendaftar/{id}  - Detail satu pendaftar
        Route::get('/pendaftar', [Admin\PendaftarController::class, 'index'])->name('pendaftar.index');
        Route::get('/pendaftar/{id}', [Admin\PendaftarController::class, 'show'])->name('pendaftar.show');

        // GET  /api/admin/verifikasi-berkas       - Daftar pendaftar untuk verifikasi berkas
        // PUT  /api/admin/verifikasi-berkas/{id}  - Approve/reject berkas
        Route::get('/verifikasi-berkas', [Admin\VerifikasiController::class, 'berkasIndex'])->name('verifikasi.berkas.index');
        Route::put('/verifikasi-berkas/{id}', [Admin\VerifikasiController::class, 'berkasUpdate'])->name('verifikasi.berkas.update');

        // GET  /api/admin/verifikasi-seleksi       - Daftar pendaftar untuk dinilai
        // PUT  /api/admin/verifikasi-seleksi/{id}  - Input nilai dan tentukan kelulusan
        Route::get('/verifikasi-seleksi', [Admin\VerifikasiController::class, 'seleksiIndex'])->name('verifikasi.seleksi.index');
        Route::put('/verifikasi-seleksi/{id}', [Admin\VerifikasiController::class, 'seleksiUpdate'])->name('verifikasi.seleksi.update');

        // GET  /api/admin/pembayaran       - Daftar pembayaran yang perlu diverifikasi
        // PUT  /api/admin/pembayaran/{id}  - Update status pembayaran
        Route::get('/pembayaran', [Admin\PembayaranController::class, 'index'])->name('pembayaran.index');
        Route::put('/pembayaran/{id}', [Admin\PembayaranController::class, 'update'])->name('pembayaran.update');

        // GET  /api/admin/pengaturan-pembayaran - Ambil setting rekening bank & biaya
        // PUT  /api/admin/pengaturan-pembayaran - Simpan setting rekening bank & biaya
        Route::get('/pengaturan-pembayaran', [Admin\PembayaranController::class, 'getPengaturan'])->name('pembayaran.pengaturan.get');
        Route::put('/pengaturan-pembayaran', [Admin\PembayaranController::class, 'updatePengaturan'])->name('pembayaran.pengaturan.update');

        // GET  /api/admin/laporan - Data rekapitulasi laporan lengkap
        Route::get('/laporan', [Admin\LaporanController::class, 'index'])->name('laporan.index');
        Route::get('/laporan/export-excel', [Admin\LaporanController::class, 'exportExcel'])->name('laporan.export');

        // GET    /api/admin/notifikasi       - Riwayat semua notifikasi yang terkirim
        // POST   /api/admin/notifikasi       - Kirim notifikasi baru (broadcast/personal)
        // DELETE /api/admin/notifikasi/{id}  - Hapus notifikasi
        Route::get('/notifikasi', [Admin\NotifikasiController::class, 'index'])->name('notifikasi.index');
        Route::post('/notifikasi', [Admin\NotifikasiController::class, 'store'])->name('notifikasi.store');
        Route::delete('/notifikasi/{id}', [Admin\NotifikasiController::class, 'destroy'])->name('notifikasi.destroy');

        // GET  /api/admin/chat/conversations  - Daftar percakapan dengan calon siswa
        // GET  /api/admin/chat/unread-count   - Total pesan belum dibaca untuk admin
        // GET  /api/admin/chat/{siswa_id}     - Riwayat percakapan dengan 1 siswa
        // POST /api/admin/chat/{siswa_id}     - Balas pesan ke 1 siswa
        Route::get('/chat/conversations', [Admin\ChatController::class, 'conversations'])->name('chat.conversations');
        Route::get('/chat/unread-count', [Admin\ChatController::class, 'unreadCount'])->name('chat.unread');
        Route::get('/chat/{siswa_id}', [Admin\ChatController::class, 'messages'])->name('chat.messages');
        Route::post('/chat/{siswa_id}', [Admin\ChatController::class, 'send'])->name('chat.send');
    });

    // =====================================================================
    // PORTAL KEPALA SEKOLAH - Pengawasan Eksekutif (100% Read-Only)
    // =====================================================================
    Route::middleware('role:kepala_sekolah')->prefix('kepala-sekolah')->name('api.kepala-sekolah.')->group(function () {

        // GET  /api/kepala-sekolah/dashboard - Metrik ringkasan agregat eksekutif
        Route::get('/dashboard', [KepalaSekolah\DashboardController::class, 'index'])->name('dashboard');

        // GET  /api/kepala-sekolah/pendaftar      - Daftar seluruh pendaftar (search & filter)
        // GET  /api/kepala-sekolah/pendaftar/{id} - Rincian lengkap calon siswa (Read-Only)
        Route::get('/pendaftar', [KepalaSekolah\PendaftarController::class, 'index'])->name('pendaftar.index');
        Route::get('/pendaftar/{id}', [KepalaSekolah\PendaftarController::class, 'show'])->name('pendaftar.show');

        // GET  /api/kepala-sekolah/keuangan - Monitoring arus transaksi & uang masuk
        Route::get('/keuangan', [KepalaSekolah\KeuanganController::class, 'index'])->name('keuangan.index');

        // GET  /api/kepala-sekolah/laporan - Laporan rekapan akhir calon siswa (identik dengan admin)
        Route::get('/laporan', [Admin\LaporanController::class, 'index'])->name('laporan.index');
        Route::get('/laporan/download-pdf', [Admin\LaporanController::class, 'exportPdf'])->name('laporan.download-pdf');
        Route::get('/laporan/preview-pdf', [Admin\LaporanController::class, 'previewPdf'])->name('laporan.preview-pdf');
    });
});

// =========================================================================
// PUBLIC / TOKENIZED PDF DOWNLOAD ENDPOINTS
// Dapat diakses langsung oleh browser ponsel (mendukung ?token=... / header)
// =========================================================================
Route::get('/siswa/seleksi/download-kartu-pdf', [Siswa\SeleksiController::class, 'downloadPdf'])->name('api.siswa.seleksi.download-pdf');
Route::get('/siswa/download-bukti-pdf', [Siswa\CetakBuktiController::class, 'downloadPdf'])->name('api.siswa.download-bukti-pdf');

