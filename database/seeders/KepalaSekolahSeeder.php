<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class KepalaSekolahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => 'kepsek'],
            [
                'email'             => 'kepsek@smpdharmabakti.sch.id',
                'password'          => Hash::make('password123'),
                'role'              => 'kepala_sekolah',
                'email_verified_at' => now(),
            ]
        );
    }
}
