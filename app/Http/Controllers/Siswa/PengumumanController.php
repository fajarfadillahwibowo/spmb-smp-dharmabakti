<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class PengumumanController extends Controller
{
    /**
     * Menampilkan pengumuman hasil seleksi.
     */
    public function index()
    {
        $calonSiswa = Auth::user()->calonSiswa;
        $pendaftaran = $calonSiswa ? $calonSiswa->pendaftaran : null;
        $seleksi = $pendaftaran ? $pendaftaran->seleksi : null;
        $pengumuman = $seleksi ? $seleksi->pengumuman : null;

        return view('siswa.pengumuman', compact('pendaftaran', 'seleksi', 'pengumuman'));
    }
}
