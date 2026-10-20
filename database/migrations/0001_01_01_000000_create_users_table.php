<?php

/**
 * Migrasi untuk tabel users, password_reset_tokens, dan sessions.
 * Tabel users telah dimodifikasi untuk mendukung sistem SPMB
 * dengan kolom tambahan: username, role, otp_code, otp_expires_at.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi — buat tabel users, password_reset_tokens, dan sessions.
     */
    public function up(): void
    {
        // Tabel utama pengguna sistem (admin & calon siswa)
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // Primary key auto-increment
            $table->string('username')->unique(); // Username unik untuk login
            $table->string('email')->unique(); // Email unik untuk verifikasi OTP
            $table->timestamp('email_verified_at')->nullable(); // Waktu verifikasi email
            $table->string('password'); // Password terenkripsi (bcrypt)
            $table->enum('role', ['admin', 'siswa'])->default('siswa'); // Peran pengguna
            $table->string('otp_code')->nullable(); // Kode OTP 6 digit
            $table->timestamp('otp_expires_at')->nullable(); // Waktu kedaluwarsa OTP
            $table->rememberToken(); // Token "remember me"
            $table->timestamps(); // created_at & updated_at
        });

        // Tabel token reset password
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary(); // Email sebagai primary key
            $table->string('token'); // Token reset password
            $table->timestamp('created_at')->nullable(); // Waktu pembuatan token
        });

        // Tabel sesi pengguna (untuk session driver database)
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary(); // ID sesi
            $table->foreignId('user_id')->nullable()->index(); // Relasi ke users
            $table->string('ip_address', 45)->nullable(); // Alamat IP pengguna
            $table->text('user_agent')->nullable(); // Informasi browser
            $table->longText('payload'); // Data sesi
            $table->integer('last_activity')->index(); // Waktu aktivitas terakhir
        });
    }

    /**
     * Batalkan migrasi — hapus tabel.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
