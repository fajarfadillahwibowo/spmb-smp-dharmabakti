<?php

/**
 * Migrasi untuk tabel calon_siswas.
 * Menyimpan data pribadi calon siswa yang mendaftar.
 * Berelasi dengan tabel users (one-to-one).
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi — buat tabel calon_siswas.
     */
    public function up(): void
    {
        Schema::create('calon_siswas', function (Blueprint $table) {
            $table->id('id_calon_siswa'); // Primary key
            $table->foreignId('id_user')->constrained('users')->onDelete('cascade'); // FK ke users
            $table->string('nama_lengkap'); // Nama lengkap calon siswa
            $table->string('nisn')->nullable(); // Nomor Induk Siswa Nasional
            $table->string('tempat_lahir')->nullable(); // Tempat lahir
            $table->date('tanggal_lahir')->nullable(); // Tanggal lahir
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan'])->nullable(); // Jenis kelamin
            $table->text('alamat')->nullable(); // Alamat lengkap
            $table->string('nama_ortu_wali')->nullable(); // Nama orang tua/wali
            $table->string('no_hp_ortu')->nullable(); // No HP orang tua/wali
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Batalkan migrasi — hapus tabel calon_siswas.
     */
    public function down(): void
    {
        Schema::dropIfExists('calon_siswas');
    }
};
