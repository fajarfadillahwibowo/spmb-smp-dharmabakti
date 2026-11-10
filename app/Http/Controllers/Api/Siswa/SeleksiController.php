<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * Controller API untuk menampilkan status seleksi dan mengunduh Kartu Ujian Seleksi PDF.
 */
class SeleksiController extends Controller
{
    /**
     * Menampilkan data seleksi calon siswa yang sedang login.
     */
    public function index(Request $request)
    {
        $calonSiswa  = $request->user()->calonSiswa;
        $pendaftaran = $calonSiswa?->pendaftaran;

        if (!$pendaftaran) {
            return response()->json([
                'success' => false,
                'message' => 'Data pendaftaran belum ada.',
            ], 404);
        }

        // Muat data seleksi
        $pendaftaran->load('seleksi');
        $seleksi = $pendaftaran->seleksi;

        $data = [
            'nomor_pendaftaran'  => $pendaftaran->nomor_pendaftaran,
            'status_pendaftaran' => $pendaftaran->status_pendaftaran,
            'catatan_verifikasi' => $pendaftaran->catatan_verifikasi,
            'nama_lengkap'       => $calonSiswa->nama_lengkap,
            'asal_sekolah'       => $pendaftaran->asal_sekolah,
            'seleksi'            => null,
            'can_print_kartu'    => ($pendaftaran->status_pendaftaran === 'terverifikasi' && $seleksi && $seleksi->tanggal_seleksi),
        ];

        if ($seleksi) {
            $data['seleksi'] = [
                'tanggal_seleksi' => $seleksi->tanggal_seleksi?->format('d M Y'),
                'tanggal_raw'     => $seleksi->tanggal_seleksi?->format('Y-m-d'),
                'waktu_seleksi'   => $seleksi->waktu_seleksi,
                'tempat_seleksi'  => $seleksi->tempat_seleksi,
                'status_seleksi'  => $seleksi->status_seleksi,
                'nilai_seleksi'   => $seleksi->nilai_seleksi,
                'catatan'         => $seleksi->catatan,
            ];
        }

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    /**
     * Mengembalikan URL untuk mengunduh PDF kartu ujian seleksi.
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

        $pendaftaran->load('seleksi');
        $seleksi = $pendaftaran->seleksi;

        if ($pendaftaran->status_pendaftaran !== 'terverifikasi' || !$seleksi || !$seleksi->tanggal_seleksi) {
            return response()->json([
                'success' => false,
                'message' => 'Kartu ujian seleksi hanya dapat diunduh jika berkas Anda telah terverifikasi dan panitia telah menetapkan jadwal ujian.',
            ], 403);
        }

        $token = $request->bearerToken() ?: $request->query('token');
        $pdfUrl = url('/api/siswa/seleksi/download-kartu-pdf') . ($token ? '?token=' . $token : '');

        return response()->json([
            'success' => true,
            'data'    => [
                'pdf_url'           => $pdfUrl,
                'nomor_pendaftaran' => $pendaftaran->nomor_pendaftaran,
                'nama_lengkap'      => $calonSiswa->nama_lengkap,
            ],
            'message' => 'Tautan unduh Kartu Ujian Seleksi berhasil digenerate.',
        ]);
    }

    /**
     * Endpoint download PDF Kartu Ujian Seleksi.
     * Dapat diakses dari aplikasi mobile browser via query token atau Authorization header.
     */
    public function downloadPdf(Request $request)
    {
        $user = null;

        // Cek bearer token atau query parameter token
        $rawToken = $request->bearerToken() ?: $request->query('token') ?: $request->query('api_token');
        if ($rawToken) {
            $accessToken = PersonalAccessToken::findToken($rawToken);
            if ($accessToken) {
                $user = $accessToken->tokenable;
            }
        }

        if (!$user && $request->user()) {
            $user = $request->user();
        }

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak terautentikasi.',
            ], 401);
        }

        $calonSiswa  = $user->calonSiswa;
        $pendaftaran = $calonSiswa?->pendaftaran;

        if (!$pendaftaran) {
            abort(404, 'Data pendaftaran tidak ditemukan.');
        }

        $pendaftaran->load(['seleksi', 'dokumen']);
        $seleksi = $pendaftaran->seleksi;

        if ($pendaftaran->status_pendaftaran !== 'terverifikasi' || !$seleksi || !$seleksi->tanggal_seleksi) {
            abort(403, 'Kartu ujian seleksi belum dapat diunduh. Berkas Anda harus terverifikasi terlebih dahulu.');
        }

        $pdf = Pdf::loadView('siswa.cetak-kartu', compact('calonSiswa', 'pendaftaran', 'seleksi'));
        
        $filename = 'Kartu_Ujian_Seleksi_' . $pendaftaran->nomor_pendaftaran . '.pdf';

        // Jika di browser mobile dibuka langsung, stream inline agar bisa dipreview dan dicetak langsung
        if ($request->query('stream') === '1') {
            return $pdf->stream($filename);
        }

        return $pdf->download($filename);
    }
}
