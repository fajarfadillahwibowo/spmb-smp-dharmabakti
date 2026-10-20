<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'name',
        'email',
        'password',
        'role',
        'foto_profil',
        'email_verified_at',
        'otp_code',
        'otp_expires_at',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['foto_profil_url'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'otp_code', // Sembunyikan OTP
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'otp_expires_at' => 'datetime',
        ];
    }

    /**
     * Relasi ke model Admin (One-to-One).
     * Hanya berlaku jika role = 'admin'.
     */
    public function admin()
    {
        return $this->hasOne(Admin::class, 'id_user');
    }

    /**
     * Relasi ke model CalonSiswa (One-to-One).
     * Hanya berlaku jika role = 'siswa'.
     */
    public function calonSiswa()
    {
        return $this->hasOne(CalonSiswa::class, 'id_user');
    }

    /**
     * Cek apakah user adalah admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Cek apakah user adalah siswa.
     */
    public function isSiswa(): bool
    {
        return $this->role === 'siswa';
    }

    /**
     * URL Foto Profil lengkap
     */
    public function getFotoProfilUrlAttribute(): ?string
    {
        if ($this->foto_profil) {
            return asset('storage/' . $this->foto_profil);
        }
        return null;
    }
}
