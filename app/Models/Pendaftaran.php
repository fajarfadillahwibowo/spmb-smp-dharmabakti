<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pendaftaran extends Model
{
    use HasFactory;

    protected $table = 'pendaftarans';
    protected $primaryKey = 'id_pendaftaran';

    protected $fillable = [
        'id_calon_siswa',
        'nomor_pendaftaran',
        'tanggal_daftar',
        'asal_sekolah',
        'status_pendaftaran',
        'catatan_verifikasi',
    ];

    protected $casts = [
        'tanggal_daftar' => 'date:Y-m-d',
    ];

    /**
     * Relasi balik ke model CalonSiswa (Belongs-To).
     */
    public function calonSiswa()
    {
        return $this->belongsTo(CalonSiswa::class, 'id_calon_siswa', 'id_calon_siswa');
    }

    /**
     * Relasi ke model Dokumen (One-to-One).
     */
    public function dokumen()
    {
        return $this->hasOne(Dokumen::class, 'id_pendaftaran', 'id_pendaftaran');
    }

    /**
     * Relasi ke model Seleksi (One-to-One).
     */
    public function seleksi()
    {
        return $this->hasOne(Seleksi::class, 'id_pendaftaran', 'id_pendaftaran');
    }

    /**
     * Relasi ke model Pembayaran (One-to-One).
     */
    public function pembayaran()
    {
        return $this->hasOne(Pembayaran::class, 'id_pendaftaran', 'id_pendaftaran');
    }
}
