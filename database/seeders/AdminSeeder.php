<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat user admin
        $user = User::create([
            'username' => 'admin',
            'email' => 'admin@smpdharmabakti.sch.id',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'email_verified_at' => now(), // Admin tidak perlu OTP
        ]);

        // Buat detail admin
        Admin::create([
            'id_user' => $user->id,
            'nama_admin' => 'Administrator',
            'no_hp' => '081234567890',
        ]);
    }
}
