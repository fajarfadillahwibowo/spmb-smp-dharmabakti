<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengaturanPembayaran extends Model
{
    use HasFactory;

    protected $table = 'pengaturan_pembayarans';

    protected $fillable = [
        'nama_bank',
        'nomor_rekening',
        'atas_nama',
        'jumlah_biaya',
        'keterangan',
    ];

    /**
     * Dapatkan pengaturan aktif saat ini (selalu baris pertama)
     */
    public static function getPengaturan(): self
    {
        return self::firstOrCreate(
            ['id' => 1],
            [
                'nama_bank'      => 'BANK BNI',
                'nomor_rekening' => '1234 5678 9012',
                'atas_nama'      => 'SMP DHARMA BAKTI',
                'jumlah_biaya'   => 'Rp 1.500.000',
                'keterangan'     => 'Biaya Pendaftaran SPMB Tahun Ajaran 2025/2026',
            ]
        );
    }
}
