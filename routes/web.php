<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\OtpController;
use App\Http\Controllers\Siswa;
use App\Http\Controllers\Admin;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
})->name('home');

// === Guest / Publik ===
Route::middleware('guest')->group(function () {
    // Login
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);

    // Register Siswa
    Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [RegisterController::class, 'register']);

    // Verifikasi OTP (Hanya untuk guest yang baru register)
    Route::get('/verifikasi-otp', [OtpController::class, 'showOtpForm'])->name('verifikasi-otp.form');
    Route::post('/verifikasi-otp', [OtpController::class, 'verify'])->name('verifikasi-otp.verify');
    Route::post('/kirim-ulang-otp', [OtpController::class, 'resend'])->name('verifikasi-otp.resend');
});

// Logout (Harus login dulu)
Route::post('/logout', [LoginController::class, 'logout'])->name('logout')->middleware('auth');

// === Portal Siswa ===
Route::middleware(['auth', 'role:siswa'])->prefix('siswa')->name('siswa.')->group(function () {
    Route::get('/dashboard', [Siswa\DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/formulir-pendaftaran', [Siswa\PendaftaranController::class, 'create'])->name('formulir.create');
    Route::post('/formulir-pendaftaran', [Siswa\PendaftaranController::class, 'store'])->name('formulir.store');
    
    Route::get('/upload-dokumen', [Siswa\DokumenController::class, 'create'])->name('dokumen.create');
    Route::post('/upload-dokumen', [Siswa\DokumenController::class, 'store'])->name('dokumen.store');
    
    Route::get('/seleksi', [Siswa\SeleksiController::class, 'index'])->name('seleksi.index');
    Route::get('/seleksi/cetak-kartu', [Siswa\SeleksiController::class, 'cetakKartu'])->name('seleksi.cetak-kartu');
    
    Route::get('/pengumuman', [Siswa\PengumumanController::class, 'index'])->name('pengumuman.index');
    Route::get('/cetak-bukti', [Siswa\CetakBuktiController::class, 'generatePdf'])->name('cetak-bukti');
    
    Route::get('/pembayaran', [Siswa\PembayaranController::class, 'create'])->name('pembayaran.create');
    Route::post('/pembayaran', [Siswa\PembayaranController::class, 'store'])->name('pembayaran.store');
});

// === Portal Admin ===
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');
    
    // Data Pendaftar
    Route::get('/data-pendaftar', [Admin\PendaftarController::class, 'index'])->name('pendaftar.index');
    Route::get('/data-pendaftar/export', [Admin\PendaftarController::class, 'exportCsv'])->name('pendaftar.export');
    Route::get('/data-pendaftar/{id}', [Admin\PendaftarController::class, 'show'])->name('pendaftar.show');
    
    // Verifikasi Berkas & Seleksi
    Route::get('/verifikasi-berkas', [Admin\VerifikasiController::class, 'berkasIndex'])->name('verifikasi.berkas.index');
    Route::put('/verifikasi-berkas/{id}', [Admin\VerifikasiController::class, 'berkasUpdate'])->name('verifikasi.berkas.update');
    
    Route::get('/verifikasi-seleksi', [Admin\VerifikasiController::class, 'seleksiIndex'])->name('verifikasi.seleksi.index');
    Route::put('/verifikasi-seleksi/{id}', [Admin\VerifikasiController::class, 'seleksiUpdate'])->name('verifikasi.seleksi.update');
    
    // Verifikasi Pembayaran & Pengaturan Rekening
    Route::get('/verifikasi-pembayaran', [Admin\PembayaranController::class, 'index'])->name('pembayaran.index');
    Route::put('/verifikasi-pembayaran/{id}', [Admin\PembayaranController::class, 'update'])->name('pembayaran.update');
    Route::post('/verifikasi-pembayaran/pengaturan', [Admin\PembayaranController::class, 'updatePengaturan'])->name('pembayaran.pengaturan');
    
    // Cetak Laporan
    Route::get('/cetak-laporan', [Admin\LaporanController::class, 'index'])->name('laporan.index');
    Route::get('/cetak-laporan/pdf', [Admin\LaporanController::class, 'generatePdf'])->name('laporan.pdf');
    Route::get('/cetak-laporan/preview', [Admin\LaporanController::class, 'previewPdf'])->name('laporan.preview');
});
