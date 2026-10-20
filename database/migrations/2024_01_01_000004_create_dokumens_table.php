<?php

/**
 * Migrasi untuk tabel dokumens.
 * Menyimpan path file dokumen persyaratan yang diunggah calon siswa.
 * Berelasi dengan tabel pendaftarans (one-to-one).
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi — buat tabel dokumens.
     */
    public function up(): void
    {
        Schema::create('dokumens', function (Blueprint $table) {
            $table->id('id_dokumen'); // Primary key
            $table->foreignId('id_pendaftaran')->constrained('pendaftarans', 'id_pendaftaran')->onDelete('cascade'); // FK ke pendaftarans
            $table->string('akte_kelahiran')->nullable(); // Path file akte kelahiran
            $table->string('kartu_keluarga')->nullable(); // Path file kartu keluarga
            $table->string('pasfoto')->nullable(); // Path file pas foto
            $table->string('ijazah')->nullable(); // Path file ijazah/SKL
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Batalkan migrasi — hapus tabel dokumens.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumens');
    }
};
