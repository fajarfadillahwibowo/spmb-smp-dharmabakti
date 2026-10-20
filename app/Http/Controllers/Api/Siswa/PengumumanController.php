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

        if (!$pengumuman) {
            return response()->json([
                'success' => true,
                'data'    => [
                    'status'  => 'belum_diumumkan',
                    'message' => 'Pengumuman hasil seleksi belum tersedia. Silakan tunggu informasi lebih lanjut.',
                ],
            ]);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'status'              => 'sudah_diumumkan',
                'nama_lengkap'        => $calonSiswa->nama_lengkap,
                'nomor_pendaftaran'   => $pendaftaran->nomor_pendaftaran,
                'nilai_seleksi'       => $seleksi->nilai_seleksi,
                'catatan'             => $seleksi->catatan,
                'hasil_pendaftaran'   => $pengumuman->hasil_pendaftaran,
                'tanggal_pengumuman'  => $pengumuman->tanggal_pengumuman
                    ? \Carbon\Carbon::parse($pengumuman->tanggal_pengumuman)->format('d M Y H:i')
                    : null,
                'bisa_cetak_bukti'    => $pengumuman->hasil_pendaftaran === 'Diterima',
            ],
        ]);
    }
}
