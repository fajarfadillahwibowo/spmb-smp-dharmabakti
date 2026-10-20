<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Menampilkan dashboard utama calon siswa.
     */
    public function index()
    {
        $user = Auth::user();
        $calonSiswa = $user->calonSiswa;
        
        // Eager load relasi untuk meminimalisir query
        $pendaftaran = $calonSiswa ? $calonSiswa->pendaftaran()->with(['dokumen', 'seleksi.pengumuman', 'pembayaran'])->first() : null;

        return view('siswa.dashboard', compact('calonSiswa', 'pendaftaran'));
    }
}
