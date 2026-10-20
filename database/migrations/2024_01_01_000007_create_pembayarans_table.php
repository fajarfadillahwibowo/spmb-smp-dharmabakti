<?php

/**
 * Migrasi untuk tabel pembayarans.
 * Menyimpan data bukti pembayaran dan status verifikasi pembayaran.
 * Tabel tambahan yang tidak ada di PRD tetapi diperlukan untuk fitur pembayaran.
 * Berelasi dengan tabel pendaftarans (one-to-one).
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi — buat tabel pembayarans.
     */
    public function up(): void
    {
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->id('id_pembayaran'); // Primary key
            $table->foreignId('id_pendaftaran')->constrained('pendaftarans', 'id_pendaftaran')->onDelete('cascade'); // FK ke pendaftarans
            $table->string('bukti_pembayaran')->nullable(); // Path file bukti transfer
            $table->date('tanggal_upload')->nullable(); // Tanggal upload bukti
            $table->enum('status_pembayaran', [
                'belum_bayar',  // Belum ada pembayaran
                'menunggu',     // Menunggu verifikasi admin
                'cicilan',      // Pembayaran cicilan (belum lunas)
                'lunas'         // Pembayaran lunas
            ])->default('belum_bayar'); // Status default: belum bayar
            $table->text('catatan_admin')->nullable(); // Catatan dari admin mengenai pembayaran
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Batalkan migrasi — hapus tabel pembayarans.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};
