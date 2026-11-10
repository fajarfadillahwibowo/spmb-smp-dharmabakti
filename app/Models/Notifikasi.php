<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Notifikasi extends Model
{
    protected $table = 'notifikasis';

    protected $fillable = [
        'admin_id',
        'user_id',
        'judul',
        'pesan',
        'tipe',
        'is_broadcast',
    ];

    protected $casts = [
        'is_broadcast' => 'boolean',
    ];

    /** Admin pengirim notifikasi */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    /** User penerima spesifik (nullable jika broadcast) */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Users yang sudah membaca notifikasi ini */
    public function readers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'notifikasi_reads', 'notifikasi_id', 'user_id')
                    ->withPivot('read_at');
    }
}
