<?php

/**
 * Migrasi untuk tabel seleksis.
 * Menyimpan data hasil seleksi calon siswa oleh admin.
 * Berelasi dengan tabel pendaftarans (one-to-one).
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi — buat tabel seleksis.
     */
    public function up(): void
    {
        Schema::create('seleksis', function (Blueprint $table) {
            $table->id('id_seleksi'); // Primary key
            $table->foreignId('id_pendaftaran')->constrained('pendaftarans', 'id_pendaftaran')->onDelete('cascade'); // FK ke pendaftarans
            $table->date('tanggal_seleksi')->nullable(); // Tanggal dilakukan seleksi
            $table->decimal('nilai_seleksi', 5, 2)->nullable(); // Nilai hasil seleksi (0.00 - 100.00)
            $table->enum('status_seleksi', [
                'menunggu',         // Belum diseleksi
                'diterima',         // Diterima
                'tidak_diterima'    // Tidak diterima
            ])->default('menunggu'); // Status default: menunggu
            $table->text('catatan')->nullable(); // Catatan admin mengenai seleksi
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Batalkan migrasi — hapus tabel seleksis.
     */
    public function down(): void
    {
        Schema::dropIfExists('seleksis');
    }
};
