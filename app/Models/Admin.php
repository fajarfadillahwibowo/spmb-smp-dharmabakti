<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;

    protected $table = 'admins';
    protected $primaryKey = 'id_admin';

    protected $fillable = [
        'id_user',
        'nama_admin',
        'nip_nik',
        'no_hp',
        'jabatan',
    ];

    /**
     * Relasi balik ke model User (Belongs-To).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
