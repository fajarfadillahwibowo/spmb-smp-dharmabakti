<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class SeleksiController extends Controller
{
    /**
     * Menampilkan halaman informasi seleksi.
     */
    public function index()
    {
        $calonSiswa = Auth::user()->calonSiswa;
        $pendaftaran = $calonSiswa ? $calonSiswa->pendaftaran : null;
        $seleksi = $pendaftaran ? $pendaftaran->seleksi : null;

        return view('siswa.seleksi', compact('calonSiswa', 'pendaftaran', 'seleksi'));
    }

    /**
     * Halaman Khusus Kartu Ujian Seleksi (3D Modern View)
     */
    public function kartuUjian()
    {
        $calonSiswa  = Auth::user()->calonSiswa;
        $pendaftaran = $calonSiswa ? $calonSiswa->pendaftaran : null;
        $seleksi     = $pendaftaran ? $pendaftaran->seleksi : null;

        return view('siswa.kartu-ujian', compact('calonSiswa', 'pendaftaran', 'seleksi'));
    }

    /**
     * Generate dan unduh PDF kartu ujian seleksi.
     */
    public function cetakKartu()
    {
        $calonSiswa = Auth::user()->calonSiswa;
        $pendaftaran = $calonSiswa ? $calonSiswa->pendaftaran : null;
        $seleksi = $pendaftaran ? $pendaftaran->seleksi : null;

        if (!$pendaftaran) {
            return redirect()->route('siswa.dashboard')->with('error', 'Data pendaftaran belum ditemukan. Harap isi formulir terlebih dahulu.');
        }

        $pdf = Pdf::loadView('siswa.cetak-kartu', compact('calonSiswa', 'pendaftaran', 'seleksi'));
        
        return $pdf->download('Kartu_Ujian_Seleksi_' . $pendaftaran->nomor_pendaftaran . '.pdf');
    }
}
