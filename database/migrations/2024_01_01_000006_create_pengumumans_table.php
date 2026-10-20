<?php

/**
 * Migrasi untuk tabel pengumumans.
 * Menyimpan data pengumuman hasil seleksi yang dipublikasikan.
 * Berelasi dengan tabel seleksis (one-to-one).
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi — buat tabel pengumumans.
     */
    public function up(): void
    {
        Schema::create('pengumumans', function (Blueprint $table) {
            $table->id('id_pengumuman'); // Primary key
            $table->foreignId('id_seleksi')->constrained('seleksis', 'id_seleksi')->onDelete('cascade'); // FK ke seleksis
            $table->string('hasil_pendaftaran'); // Hasil: Diterima / Tidak Diterima
            $table->date('tanggal_pengumuman'); // Tanggal pengumuman dipublikasikan
            $table->boolean('cetak_bukti')->default(false); // Apakah bukti sudah dicetak
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Batalkan migrasi — hapus tabel pengumumans.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengumumans');
    }
};
