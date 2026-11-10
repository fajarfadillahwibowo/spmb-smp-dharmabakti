<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Controller API untuk menampilkan pengumuman hasil seleksi calon siswa.
 */
class PengumumanController extends Controller
{
    /**
     * Menampilkan hasil seleksi/pengumuman untuk calon siswa yang login.
     */
    public function index(Request $request)
    {
        $calonSiswa  = $request->user()->calonSiswa;
        $pendaftaran = $calonSiswa?->pendaftaran;

        if (!$pendaftaran) {
            return response()->json([
                'success' => false,
                'message' => 'Data pendaftaran tidak ditemukan.',
            ], 404);
        }

        // Muat data seleksi dan pengumuman
        $pendaftaran->load(['seleksi.pengumuman']);
        $seleksi    = $pendaftaran->seleksi;
        $pengumuman = $seleksi?->pengumuman;

        // Cek apakah calon siswa sudah lulus / dinilai seleksi oleh admin
        $isLulus = ($pengumuman && $pengumuman->hasil_pendaftaran === 'Diterima') ||
                   ($seleksi && ($seleksi->status_seleksi === 'diterima' || ($seleksi->nilai_seleksi !== null && $seleksi->status_seleksi !== 'tidak_diterima')));

        $isTidakLulus = ($pengumuman && $pengumuman->hasil_pendaftaran === 'Tidak Diterima') ||
                        ($seleksi && $seleksi->status_seleksi === 'tidak_diterima');

        if ($isLulus) {
            if (!$pengumuman && $seleksi) {
                $pengumuman = $seleksi->pengumuman()->updateOrCreate(
                    ['id_seleksi' => $seleksi->id_seleksi],
                    [
                        'hasil_pendaftaran'  => 'Diterima',
                        'tanggal_pengumuman' => now(),
                    ]
                );
            }
        } elseif ($isTidakLulus) {
            if (!$pengumuman && $seleksi) {
                $pengumuman = $seleksi->pengumuman()->updateOrCreate(
                    ['id_seleksi' => $seleksi->id_seleksi],
                    [
                        'hasil_pendaftaran'  => 'Tidak Diterima',
                        'tanggal_pengumuman' => now(),
                    ]
                );
            }
        } elseif (!$pengumuman) {
            return response()->json([
                'success' => true,
                'data'    => [
                    'status'  => 'belum_diumumkan',
                    'message' => 'Pengumuman hasil seleksi belum tersedia. Silakan tunggu informasi lebih lanjut.',
                ],
            ]);
        }

        $token = $request->bearerToken() ?: $request->query('token');
        $pdfUrl = url('/api/siswa/download-bukti-pdf') . ($token ? '?token=' . $token : '');

        return response()->json([
            'success' => true,
            'data'    => [
                'status'              => 'sudah_diumumkan',
                'nama_lengkap'        => $calonSiswa->nama_lengkap,
                'nomor_pendaftaran'   => $pendaftaran->nomor_pendaftaran,
                'nisn'                => $calonSiswa->nisn,
                'tempat_lahir'        => $calonSiswa->tempat_lahir,
                'tanggal_lahir'       => $calonSiswa->tanggal_lahir ? \Carbon\Carbon::parse($calonSiswa->tanggal_lahir)->translatedFormat('d F Y') : null,
                'jenis_kelamin'       => $calonSiswa->jenis_kelamin,
                'asal_sekolah'        => $pendaftaran->asal_sekolah,
                'nilai_seleksi'       => $seleksi?->nilai_seleksi ?? 85,
                'catatan'             => $seleksi?->catatan,
                'hasil_pendaftaran'   => $isLulus ? 'Diterima' : ($pengumuman?->hasil_pendaftaran ?: 'Tidak Diterima'),
                'tanggal_pengumuman'  => $pengumuman?->tanggal_pengumuman
                    ? \Carbon\Carbon::parse($pengumuman->tanggal_pengumuman)->translatedFormat('d F Y')
                    : \Carbon\Carbon::now()->translatedFormat('d F Y'),
                'bisa_cetak_bukti'    => $isLulus,
                'pdf_url'             => $pdfUrl,
            ],
        ]);
    }
}
