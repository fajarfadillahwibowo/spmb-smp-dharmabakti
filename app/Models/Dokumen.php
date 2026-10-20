<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dokumen extends Model
{
    use HasFactory;

    protected $table = 'dokumens';
    protected $primaryKey = 'id_dokumen';

    protected $fillable = [
        'id_pendaftaran',
        'akte_kelahiran',
        'kartu_keluarga',
        'pasfoto',
        'ijazah',
    ];

    /**
     * Relasi balik ke model Pendaftaran (Belongs-To).
     */
    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class, 'id_pendaftaran', 'id_pendaftaran');
    }
}
