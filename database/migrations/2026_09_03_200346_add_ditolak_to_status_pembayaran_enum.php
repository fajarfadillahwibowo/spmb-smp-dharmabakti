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
        DB::statement("ALTER TABLE pembayarans MODIFY COLUMN status_pembayaran ENUM('belum_bayar', 'menunggu', 'cicilan', 'lunas', 'ditolak') DEFAULT 'belum_bayar'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE pembayarans MODIFY COLUMN status_pembayaran ENUM('belum_bayar', 'menunggu', 'cicilan', 'lunas') DEFAULT 'belum_bayar'");
    }
};
