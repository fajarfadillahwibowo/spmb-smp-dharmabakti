<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Controller API Dashboard untuk Portal Siswa.
 * Menampilkan ringkasan status pendaftaran calon siswa.
 */
class DashboardController extends Controller
{
    /**
     * Mengembalikan data ringkasan dashboard calon siswa.
     */
    public function index(Request $request)
    {
        // Ambil data user yang sedang login beserta relasinya
        $user       = $request->user();
        $calonSiswa = $user->calonSiswa;

        // Jika profil belum ada
        if (!$calonSiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Profil calon siswa tidak ditemukan.',
            ], 404);
        }

        // Muat relasi pendaftaran dan dokumen
        $calonSiswa->load(['pendaftaran.dokumen', 'pendaftaran.seleksi.pengumuman', 'pendaftaran.pembayaran']);
        $pendaftaran = $calonSiswa->pendaftaran;

        // Susun data ringkasan untuk ditampilkan di dashboard
        $summary = [
            'nama_lengkap'       => $calonSiswa->nama_lengkap ?: '-',
            'formulir_selesai'   => !empty($calonSiswa->nama_lengkap) && !empty($calonSiswa->nisn),
            'dokumen_lengkap'    => false,
            'status_pendaftaran' => null,
            'status_seleksi'     => null,
            'hasil_pengumuman'   => null,
            'status_pembayaran'  => null,
            'nomor_pendaftaran'  => null,
        ];

        if ($pendaftaran) {
            $summary['nomor_pendaftaran']  = $pendaftaran->nomor_pendaftaran;
            $summary['status_pendaftaran'] = $pendaftaran->status_pendaftaran;
            $summary['catatan_verifikasi'] = $pendaftaran->catatan_verifikasi;

            // Cek kelengkapan dokumen
            $dokumen = $pendaftaran->dokumen;
            if ($dokumen) {
                $summary['dokumen_lengkap'] = $dokumen->akte_kelahiran &&
                    $dokumen->kartu_keluarga &&
                    $dokumen->pasfoto &&
                    $dokumen->ijazah;
            }

            // Status & jadwal seleksi
            if ($pendaftaran->seleksi) {
                $summary['status_seleksi']  = $pendaftaran->seleksi->status_seleksi;
                $summary['tanggal_seleksi'] = $pendaftaran->seleksi->tanggal_seleksi?->translatedFormat('d M Y');
                $summary['waktu_seleksi']   = $pendaftaran->seleksi->waktu_seleksi;
                $summary['tempat_seleksi']  = $pendaftaran->seleksi->tempat_seleksi;
                $summary['catatan_seleksi'] = $pendaftaran->seleksi->catatan;
            }

            // Hasil pengumuman
            if ($pendaftaran->seleksi && $pendaftaran->seleksi->pengumuman) {
                $summary['hasil_pengumuman'] = $pendaftaran->seleksi->pengumuman->hasil_pendaftaran;
            }

            // Status pembayaran
            if ($pendaftaran->pembayaran) {
                $summary['status_pembayaran'] = $pendaftaran->pembayaran->status_pembayaran;
            }
        }

        return response()->json([
            'success' => true,
            'data'    => $summary,
        ]);
    }
}
