<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Controller API untuk mendapatkan URL unduhan bukti penerimaan PDF.
 * PDF dihasilkan oleh web route yang sudah ada (memanfaatkan kembali logic lama).
 */
class CetakBuktiController extends Controller
{
    /**
     * Mengembalikan URL untuk mengunduh PDF bukti penerimaan.
     * Siswa harus sudah dinyatakan "Diterima" untuk bisa cetak bukti.
     */
    public function getUrl(Request $request)
    {
        $calonSiswa  = $request->user()->calonSiswa;
        $pendaftaran = $calonSiswa?->pendaftaran;

        if (!$pendaftaran) {
            return response()->json([
                'success' => false,
                'message' => 'Data pendaftaran tidak ditemukan.',
            ], 404);
        }

        // Muat relasi seleksi dan pengumuman
        $pendaftaran->load(['seleksi.pengumuman']);
        $pengumuman = $pendaftaran->seleksi?->pengumuman;

        // Pastikan siswa sudah dinyatakan diterima
        if (!$pengumuman || $pengumuman->hasil_pendaftaran !== 'Diterima') {
            return response()->json([
                'success' => false,
                'message' => 'Bukti penerimaan hanya tersedia untuk siswa yang dinyatakan diterima.',
            ], 403);
        }

        // URL ke endpoint PDF yang sudah ada di web routes
        // Mobile app akan membuka URL ini menggunakan WebBrowser/PDF viewer
        $pdfUrl = url('/siswa/cetak-bukti') . '?api_token=' . $request->bearerToken();

        return response()->json([
            'success' => true,
            'data'    => [
                'pdf_url'           => $pdfUrl,
                'nomor_pendaftaran' => $pendaftaran->nomor_pendaftaran,
                'nama_lengkap'      => $calonSiswa->nama_lengkap,
            ],
            'message' => 'Gunakan URL ini untuk membuka dan mengunduh PDF bukti penerimaan.',
        ]);
    }
}
