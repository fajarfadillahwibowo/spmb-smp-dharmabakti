<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Controller API untuk menampilkan status seleksi calon siswa.
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
}
