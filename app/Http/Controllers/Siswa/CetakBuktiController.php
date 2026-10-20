<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class CetakBuktiController extends Controller
{
    /**
     * Generate dan unduh PDF bukti penerimaan.
     */
    public function generatePdf()
    {
        $calonSiswa = Auth::user()->calonSiswa;
        $pendaftaran = $calonSiswa ? $calonSiswa->pendaftaran : null;
        $seleksi = $pendaftaran ? $pendaftaran->seleksi : null;
        $pengumuman = $seleksi ? $seleksi->pengumuman : null;

        if (!$pengumuman || $pengumuman->hasil_pendaftaran !== 'Diterima') {
            return redirect()->route('siswa.pengumuman.index')->with('error', 'Anda belum dapat mencetak bukti penerimaan.');
        }

        // Tandai bahwa bukti sudah dicetak
        if (!$pengumuman->cetak_bukti) {
            $pengumuman->update(['cetak_bukti' => true]);
        }

        $pdf = Pdf::loadView('siswa.cetak-bukti', compact('calonSiswa', 'pendaftaran', 'pengumuman'));
        
        return $pdf->download('Bukti_Penerimaan_' . $pendaftaran->nomor_pendaftaran . '.pdf');
    }
}
