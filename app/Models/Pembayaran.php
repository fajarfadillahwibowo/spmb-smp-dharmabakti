<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory;

    protected $table = 'pembayarans';
    protected $primaryKey = 'id_pembayaran';

    protected $fillable = [
        'id_pendaftaran',
        'bukti_pembayaran',
        'tanggal_upload',
        'status_pembayaran',
        'catatan_admin',
    ];

    protected $casts = [
        'tanggal_upload' => 'date:Y-m-d',
    ];

    /**
     * Relasi balik ke model Pendaftaran (Belongs-To).
     */
    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class, 'id_pendaftaran', 'id_pendaftaran');
    }
}
