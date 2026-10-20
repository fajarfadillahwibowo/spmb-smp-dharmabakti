<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;

/**
 * Controller API untuk laporan data pendaftaran SPMB.
 * Mengembalikan data rekapitulasi yang bisa diekspor dari mobile.
 */
class LaporanController extends Controller
{
    /**
     * Mengembalikan data rekapitulasi laporan dalam format JSON.
     * Aplikasi mobile akan menampilkan data ini dan menyediakan opsi export.
     */
    public function index(Request $request)
    {
        // Ambil semua data pendaftaran beserta relasinya
        $pendaftarans = Pendaftaran::with([
            'calonSiswa',
            'seleksi',
            'pembayaran',
        ])->latest()->get();

        // Format data laporan
        $data = $pendaftarans->map(function ($p) {
            return [
                'nomor_pendaftaran'  => $p->nomor_pendaftaran,
                'nama_lengkap'       => $p->calonSiswa?->nama_lengkap ?? '-',
                'nisn'               => $p->calonSiswa?->nisn ?? '-',
                'asal_sekolah'       => $p->asal_sekolah ?? '-',
                'tanggal_daftar'     => $p->tanggal_daftar?->format('d/m/Y'),
                'status_berkas'      => $p->status_pendaftaran,
                'nilai_seleksi'      => $p->seleksi?->nilai_seleksi ?? '-',
                'status_seleksi'     => $p->seleksi?->status_seleksi ?? 'belum',
                'status_pembayaran'  => $p->pembayaran?->status_pembayaran ?? 'belum',
            ];
        });

        // Ringkasan statistik laporan
        $ringkasan = [
            'total_pendaftar'    => $pendaftarans->count(),
            'total_diterima'     => $pendaftarans->filter(fn($p) => $p->seleksi?->status_seleksi === 'diterima')->count(),
            'total_tidak_diterima' => $pendaftarans->filter(fn($p) => $p->seleksi?->status_seleksi === 'tidak_diterima')->count(),
            'total_lunas'        => $pendaftarans->filter(fn($p) => $p->pembayaran?->status_pembayaran === 'lunas')->count(),
            'tanggal_laporan'    => now()->format('d M Y H:i'),
        ];

        return response()->json([
            'success'   => true,
            'ringkasan' => $ringkasan,
            'data'      => $data,
        ]);
    }
}
