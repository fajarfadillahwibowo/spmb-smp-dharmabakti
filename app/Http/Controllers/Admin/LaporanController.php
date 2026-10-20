<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanController extends Controller
{
    /**
     * Menampilkan halaman rekapitulasi data pendaftaran.
     */
    public function index()
    {
        $pendaftarans = Pendaftaran::with(['calonSiswa', 'seleksi', 'pembayaran'])->get();

        return view('admin.cetak-laporan.index', compact('pendaftarans'));
    }

    /**
     * Generate laporan PDF secara menyeluruh.
     */
    public function generatePdf()
    {
        // Ambil semua data dengan relasi lengkap
        $pendaftarans = Pendaftaran::with(['calonSiswa', 'seleksi.pengumuman', 'pembayaran'])->get();

        $pdf = Pdf::loadView('admin.cetak-laporan.pdf', compact('pendaftarans'))
                  ->setPaper('a4', 'landscape');
        
        return $pdf->download('Laporan_Pendaftaran_SPMB_' . date('Y') . '.pdf');
    }
}
