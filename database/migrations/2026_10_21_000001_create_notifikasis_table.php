<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('notifikasis')) {
            Schema::create('notifikasis', function (Blueprint $table) {
                $table->id();
                // Pengirim: admin yang mengirim notifikasi
                $table->foreignId('admin_id')->nullable()->constrained('admins')->nullOnDelete();
                // Penerima: null = broadcast ke semua siswa, isi = ke 1 siswa tertentu
                $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
                $table->string('judul');
                $table->text('pesan');
                $table->enum('tipe', ['info', 'peringatan', 'sukses', 'penting'])->default('info');
                $table->boolean('is_broadcast')->default(false); // true = kirim ke semua siswa
                $table->timestamps();
            });
        }

        // Tabel pivot: track notifikasi mana yang sudah dibaca oleh user tertentu
        if (!Schema::hasTable('notifikasi_reads')) {
            Schema::create('notifikasi_reads', function (Blueprint $table) {
                $table->id();
                $table->foreignId('notifikasi_id')->constrained('notifikasis')->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->timestamp('read_at')->useCurrent();
                $table->unique(['notifikasi_id', 'user_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('notifikasi_reads');
        Schema::dropIfExists('notifikasis');
    }
};
