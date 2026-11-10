<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi penambahan kolom formulir PPDB lengkap.
     */
    public function up(): void
    {
        Schema::table('calon_siswas', function (Blueprint $table) {
            $table->string('no_kk', 20)->nullable()->after('tanggal_lahir');
            $table->string('nik', 20)->nullable()->after('no_kk');
            $table->string('agama', 50)->nullable()->after('jenis_kelamin');
            $table->string('nama_ayah', 255)->nullable()->after('alamat');
            $table->string('pekerjaan_ayah', 100)->nullable()->after('nama_ayah');
            $table->text('alamat_ayah')->nullable()->after('pekerjaan_ayah');
            $table->string('nama_ibu', 255)->nullable()->after('alamat_ayah');
            $table->string('pekerjaan_ibu', 100)->nullable()->after('nama_ibu');
            $table->text('alamat_ibu')->nullable()->after('pekerjaan_ibu');
            $table->string('ukuran_pakaian', 10)->nullable()->after('no_hp_ortu');
        });
    }

    /**
     * Batalkan migrasi.
     */
    public function down(): void
    {
        Schema::table('calon_siswas', function (Blueprint $table) {
            $table->dropColumn([
                'no_kk',
                'nik',
                'agama',
                'nama_ayah',
                'pekerjaan_ayah',
                'alamat_ayah',
                'nama_ibu',
                'pekerjaan_ibu',
                'alamat_ibu',
                'ukuran_pakaian',
            ]);
        });
    }
};

