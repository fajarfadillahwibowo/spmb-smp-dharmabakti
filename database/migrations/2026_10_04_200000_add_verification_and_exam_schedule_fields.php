<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tambahkan kolom catatan_verifikasi ke tabel pendaftarans jika belum ada
        Schema::table('pendaftarans', function (Blueprint $table) {
            if (!Schema::hasColumn('pendaftarans', 'catatan_verifikasi')) {
                $table->text('catatan_verifikasi')->nullable()->after('status_pendaftaran');
            }
        });

        // Tambahkan waktu_seleksi dan tempat_seleksi ke tabel seleksis jika belum ada
        Schema::table('seleksis', function (Blueprint $table) {
            if (!Schema::hasColumn('seleksis', 'waktu_seleksi')) {
                $table->string('waktu_seleksi', 100)->nullable()->after('tanggal_seleksi');
            }
            if (!Schema::hasColumn('seleksis', 'tempat_seleksi')) {
                $table->string('tempat_seleksi', 255)->nullable()->after('waktu_seleksi');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftarans', function (Blueprint $table) {
            if (Schema::hasColumn('pendaftarans', 'catatan_verifikasi')) {
                $table->dropColumn('catatan_verifikasi');
            }
        });

        Schema::table('seleksis', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('seleksis', 'waktu_seleksi')) {
                $columnsToDrop[] = 'waktu_seleksi';
            }
            if (Schema::hasColumn('seleksis', 'tempat_seleksi')) {
                $columnsToDrop[] = 'tempat_seleksi';
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
