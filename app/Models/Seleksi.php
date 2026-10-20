<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seleksi extends Model
{
    use HasFactory;

    protected $table = 'seleksis';
    protected $primaryKey = 'id_seleksi';

    protected $fillable = [
        'id_pendaftaran',
        'tanggal_seleksi',
        'waktu_seleksi',
        'tempat_seleksi',
        'nilai_seleksi',
        'status_seleksi',
        'catatan',
    ];

    protected $casts = [
        'tanggal_seleksi' => 'date:Y-m-d',
        'nilai_seleksi' => 'decimal:2',
    ];

    /**
     * Relasi balik ke model Pendaftaran (Belongs-To).
     */
    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class, 'id_pendaftaran', 'id_pendaftaran');
    }

    /**
     * Relasi ke model Pengumuman (One-to-One).
     */
    public function pengumuman()
    {
        return $this->hasOne(Pengumuman::class, 'id_seleksi', 'id_seleksi');
    }
}
