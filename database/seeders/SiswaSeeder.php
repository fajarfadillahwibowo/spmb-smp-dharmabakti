<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\CalonSiswa;

class SiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat user siswa
        $user = User::create([
            'username' => 'siswa',
            'email' => 'siswa@example.com',
            'password' => Hash::make('password123'),
            'role' => 'siswa',
            'email_verified_at' => now(), // Anggap sudah lolos OTP
        ]);

        // Buat data dasar calon siswa
        CalonSiswa::create([
            'id_user' => $user->id,
            'nama_lengkap' => 'Siswa Pendaftar Demo',
            // Field lainnya dibiarkan kosong agar siswa bisa mengisi sendiri dari dashboard
        ]);
    }
}
