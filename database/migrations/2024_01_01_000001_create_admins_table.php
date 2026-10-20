<?php

/**
 * Migrasi untuk tabel admins.
 * Menyimpan data profil admin/panitia SPMB.
 * Berelasi dengan tabel users (one-to-one).
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi — buat tabel admins.
     */
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id('id_admin'); // Primary key
            $table->foreignId('id_user')->constrained('users')->onDelete('cascade'); // FK ke users
            $table->string('nama_admin'); // Nama lengkap admin
            $table->string('nip_nik')->nullable(); // NIP atau NIK admin
            $table->string('no_hp')->nullable(); // Nomor HP admin
            $table->string('jabatan')->nullable(); // Jabatan admin (misal: Panitia SPMB)
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Batalkan migrasi — hapus tabel admins.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
