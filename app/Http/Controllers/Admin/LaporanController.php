<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanController extends Controller
{
    /**
     * Menampilkan halaman rekapitulasi data pendaftaran web.
     */
    public function index()
    {
        $pendaftarans = Pendaftaran::with(['calonSiswa', 'seleksi', 'pembayaran'])->orderBy('id_pendaftaran', 'asc')->get();

        return view('admin.cetak-laporan.index', compact('pendaftarans'));
    }

    /**
     * Generate laporan PDF secara menyeluruh untuk diunduh.
     */
    public function generatePdf()
    {
        $pendaftarans = Pendaftaran::with(['calonSiswa', 'seleksi', 'pembayaran'])->orderBy('id_pendaftaran', 'asc')->get();

        $pdf = Pdf::loadView('admin.cetak-laporan.pdf', compact('pendaftarans'))
                  ->setPaper('a4', 'landscape')
                  ->setOption([
                      'isHtml5ParserEnabled' => true,
                      'isRemoteEnabled' => true,
                      'defaultFont' => 'sans-serif',
                  ]);
        
        return $pdf->download('REKAPITULASI_DATA_DIRI_CALON_SISWA_2026-2027.pdf');
    }

    /**
     * Pratinjau laporan PDF di browser.
     */
    public function previewPdf()
    {
        $pendaftarans = Pendaftaran::with(['calonSiswa', 'seleksi', 'pembayaran'])->orderBy('id_pendaftaran', 'asc')->get();

        $pdf = Pdf::loadView('admin.cetak-laporan.pdf', compact('pendaftarans'))
                  ->setPaper('a4', 'landscape')
                  ->setOption([
                      'isHtml5ParserEnabled' => true,
                      'isRemoteEnabled' => true,
                      'defaultFont' => 'sans-serif',
                  ]);
        
        return $pdf->stream('REKAPITULASI_DATA_DIRI_CALON_SISWA_2026-2027.pdf');
    }
}
