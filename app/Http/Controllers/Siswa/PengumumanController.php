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

        $isLulus = ($pengumuman && $pengumuman->hasil_pendaftaran === 'Diterima') ||
                   ($seleksi && ($seleksi->status_seleksi === 'diterima' || ($seleksi->nilai_seleksi !== null && $seleksi->status_seleksi !== 'tidak_diterima')));

        if ($isLulus && !$pengumuman && $seleksi) {
            $pengumuman = $seleksi->pengumuman()->updateOrCreate(
                ['id_seleksi' => $seleksi->id_seleksi],
                [
                    'hasil_pendaftaran'  => 'Diterima',
                    'tanggal_pengumuman' => now(),
                ]
            );
        }

        return view('siswa.pengumuman', compact('calonSiswa', 'pendaftaran', 'seleksi', 'pengumuman'));
    }
}
