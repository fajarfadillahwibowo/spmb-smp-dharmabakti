<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * Controller API untuk mendapatkan URL unduhan bukti penerimaan PDF dan generate PDF langsung.
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
        $seleksi    = $pendaftaran->seleksi;
        $pengumuman = $seleksi?->pengumuman;

        $isLulus = ($pengumuman && $pengumuman->hasil_pendaftaran === 'Diterima') ||
                   ($seleksi && ($seleksi->status_seleksi === 'diterima' || ($seleksi->nilai_seleksi !== null && $seleksi->status_seleksi !== 'tidak_diterima')));

        // Pastikan siswa sudah dinyatakan diterima
        if (!$isLulus) {
            return response()->json([
                'success' => false,
                'message' => 'Surat bukti kelulusan hanya tersedia untuk siswa yang dinyatakan diterima.',
            ], 403);
        }

        if (!$pengumuman && $seleksi) {
            $pengumuman = $seleksi->pengumuman()->updateOrCreate(
                ['id_seleksi' => $seleksi->id_seleksi],
                [
                    'hasil_pendaftaran'  => 'Diterima',
                    'tanggal_pengumuman' => now(),
                ]
            );
        }

        $token = $request->bearerToken() ?: $request->query('token');
        $pdfUrl = url('/api/siswa/download-bukti-pdf') . ($token ? '?token=' . $token : '');

        return response()->json([
            'success' => true,
            'data'    => [
                'pdf_url'           => $pdfUrl,
                'nomor_pendaftaran' => $pendaftaran->nomor_pendaftaran,
                'nama_lengkap'      => $calonSiswa->nama_lengkap,
                'nisn'              => $calonSiswa->nisn,
                'tempat_lahir'      => $calonSiswa->tempat_lahir,
                'tanggal_lahir'     => $calonSiswa->tanggal_lahir ? \Carbon\Carbon::parse($calonSiswa->tanggal_lahir)->translatedFormat('d F Y') : null,
                'jenis_kelamin'     => $calonSiswa->jenis_kelamin == 'L' ? 'Laki-laki' : 'Perempuan',
                'asal_sekolah'      => $pendaftaran->asal_sekolah,
                'nilai_seleksi'     => $seleksi?->nilai_seleksi,
                'tanggal_pengumuman'=> $pengumuman?->tanggal_pengumuman ? \Carbon\Carbon::parse($pengumuman->tanggal_pengumuman)->translatedFormat('d F Y') : now()->translatedFormat('d F Y'),
            ],
            'message' => 'Tautan unduh Bukti Penerimaan berhasil digenerate.',
        ]);
    }

    /**
     * Endpoint streaming/download PDF Bukti Penerimaan.
     */
    public function downloadPdf(Request $request)
    {
        $user = null;

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

        $pendaftaran->load(['seleksi.pengumuman']);
        $seleksi    = $pendaftaran->seleksi;
        $pengumuman = $seleksi?->pengumuman;

        $isLulus = ($pengumuman && $pengumuman->hasil_pendaftaran === 'Diterima') ||
                   ($seleksi && ($seleksi->status_seleksi === 'diterima' || ($seleksi->nilai_seleksi !== null && $seleksi->status_seleksi !== 'tidak_diterima')));

        if (!$isLulus) {
            abort(403, 'Surat bukti kelulusan hanya tersedia untuk siswa yang dinyatakan diterima.');
        }

        if (!$pengumuman && $seleksi) {
            $pengumuman = $seleksi->pengumuman()->updateOrCreate(
                ['id_seleksi' => $seleksi->id_seleksi],
                [
                    'hasil_pendaftaran'  => 'Diterima',
                    'tanggal_pengumuman' => now(),
                ]
            );
        }

        // Tandai bahwa bukti sudah dicetak
        if (!$pengumuman->cetak_bukti) {
            $pengumuman->update(['cetak_bukti' => true]);
        }

        $pdf = Pdf::loadView('siswa.cetak-bukti', compact('calonSiswa', 'pendaftaran', 'pengumuman'));
        
        $filename = 'Bukti_Penerimaan_' . $pendaftaran->nomor_pendaftaran . '.pdf';

        if ($request->query('stream') === '1') {
            return $pdf->stream($filename);
        }

        return $pdf->download($filename);
    }
}
