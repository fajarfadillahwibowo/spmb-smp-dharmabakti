<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengaturan_pembayarans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_bank', 100)->default('BANK BNI');
            $table->string('nomor_rekening', 100)->default('1234 5678 9012');
            $table->string('atas_nama', 150)->default('SMP DHARMA BAKTI');
            $table->string('jumlah_biaya', 100)->default('Rp 1.500.000');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // Insert baris default awal
        DB::table('pengaturan_pembayarans')->insert([
            'nama_bank'      => 'BANK BNI',
            'nomor_rekening' => '1234 5678 9012',
            'atas_nama'      => 'SMP DHARMA BAKTI',
            'jumlah_biaya'   => 'Rp 1.500.000',
            'keterangan'     => 'Biaya Pendaftaran SPMB Tahun Ajaran 2025/2026',
            'created_at'     => now(),
            'updated_at'     => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengaturan_pembayarans');
    }
};
