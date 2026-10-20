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
     * Generate dan unduh PDF kartu ujian seleksi.
     */
    public function cetakKartu()
    {
        $calonSiswa = Auth::user()->calonSiswa;
        $pendaftaran = $calonSiswa ? $calonSiswa->pendaftaran : null;
        $seleksi = $pendaftaran ? $pendaftaran->seleksi : null;

        if (!$pendaftaran || $pendaftaran->status_pendaftaran !== 'terverifikasi' || !$seleksi || !$seleksi->tanggal_seleksi) {
            return redirect()->route('siswa.seleksi.index')->with('error', 'Anda belum dapat mencetak kartu ujian seleksi. Pastikan berkas Anda telah diverifikasi.');
        }

        $pdf = Pdf::loadView('siswa.cetak-kartu', compact('calonSiswa', 'pendaftaran', 'seleksi'));
        
        return $pdf->download('Kartu_Ujian_Seleksi_' . $pendaftaran->nomor_pendaftaran . '.pdf');
    }
}
