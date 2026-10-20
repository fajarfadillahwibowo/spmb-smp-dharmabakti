<?php

/**
 * Migrasi untuk tabel pendaftarans.
 * Menyimpan data pendaftaran siswa termasuk nomor pendaftaran dan status.
 * Berelasi dengan tabel calon_siswas (many-to-one).
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi — buat tabel pendaftarans.
     */
    public function up(): void
    {
        Schema::create('pendaftarans', function (Blueprint $table) {
            $table->id('id_pendaftaran'); // Primary key
            $table->foreignId('id_calon_siswa')->constrained('calon_siswas', 'id_calon_siswa')->onDelete('cascade'); // FK ke calon_siswas
            $table->string('nomor_pendaftaran')->unique(); // Nomor pendaftaran unik (format: SPMB-YYYY-XXXX)
            $table->date('tanggal_daftar'); // Tanggal pendaftaran
            $table->string('asal_sekolah')->nullable(); // Nama asal sekolah (SD/MI)
            $table->enum('status_pendaftaran', [
                'belum_lengkap',        // Data belum lengkap
                'menunggu_verifikasi',  // Menunggu verifikasi admin
                'terverifikasi',        // Berkas sudah diverifikasi
                'ditolak'               // Berkas ditolak
            ])->default('belum_lengkap'); // Status default: belum lengkap
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Batalkan migrasi — hapus tabel pendaftarans.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftarans');
    }
};
