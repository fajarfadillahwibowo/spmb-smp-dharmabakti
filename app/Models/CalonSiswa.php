<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalonSiswa extends Model
{
    use HasFactory;

    protected $table = 'calon_siswas';
    protected $primaryKey = 'id_calon_siswa';

    protected $fillable = [
        'id_user',
        'nama_lengkap',
        'nisn',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat',
        'nama_ortu_wali',
        'no_hp_ortu',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date:Y-m-d',
    ];

    /**
     * Relasi balik ke model User (Belongs-To).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    /**
     * Relasi ke model Pendaftaran (One-to-One).
     * Seorang calon siswa memiliki satu pendaftaran aktif.
     */
    public function pendaftaran()
    {
        return $this->hasOne(Pendaftaran::class, 'id_calon_siswa', 'id_calon_siswa');
    }
}
