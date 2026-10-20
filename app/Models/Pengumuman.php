<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengumuman extends Model
{
    use HasFactory;

    protected $table = 'pengumumans';
    protected $primaryKey = 'id_pengumuman';

    protected $fillable = [
        'id_seleksi',
        'hasil_pendaftaran',
        'tanggal_pengumuman',
        'cetak_bukti',
    ];

    protected $casts = [
        'tanggal_pengumuman' => 'date:Y-m-d',
        'cetak_bukti' => 'boolean',
    ];

    /**
     * Relasi balik ke model Seleksi (Belongs-To).
     */
    public function seleksi()
    {
        return $this->belongsTo(Seleksi::class, 'id_seleksi', 'id_seleksi');
    }
}
