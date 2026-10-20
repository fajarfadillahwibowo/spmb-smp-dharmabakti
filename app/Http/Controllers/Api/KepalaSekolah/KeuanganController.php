<?php

namespace App\Http\Controllers\Api\KepalaSekolah;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Controller Monitoring Keuangan untuk Kepala Sekolah (Read-Only).
 * Menampilkan arus transaksi pembayaran pendaftaran tanpa hak verifikasi/mutasi.
 */
class KeuanganController extends Controller
{
    /**
     * Menampilkan daftar riwayat pembayaran dan status verifikasinya.
     */
    public function index(Request $request)
    {
        $query = Pembayaran::with(['pendaftaran.calonSiswa']);

        // Filter status pembayaran (menunggu, lunas, cicilan, ditolak)
        if ($request->filled('status')) {
            $query->where('status_pembayaran', $request->status);
        }

        $pembayarans = $query->latest('tanggal_upload')->paginate(20);

        $data = $pembayarans->through(function ($p) {
            return [
                'id_pembayaran'     => $p->id_pembayaran,
                'status_pembayaran' => $p->status_pembayaran,
                'tanggal_upload'    => $p->tanggal_upload?->format('d M Y'),
                'bukti_url'         => $p->bukti_pembayaran
                    ? Storage::url($p->bukti_pembayaran)
                    : null,
                'catatan_admin'     => $p->catatan_admin,
                'pendaftaran'       => [
                    'id_pendaftaran'    => $p->pendaftaran?->id_pendaftaran,
                    'nomor_pendaftaran' => $p->pendaftaran?->nomor_pendaftaran,
                    'nama_siswa'        => $p->pendaftaran?->calonSiswa?->nama_lengkap,
                    'asal_sekolah'      => $p->pendaftaran?->asal_sekolah,
                ],
            ];
        });

        // Ringkasan metrik keuangan
        $summary = [
            'total_transaksi'     => Pembayaran::count(),
            'lunas'               => Pembayaran::where('status_pembayaran', 'lunas')->count(),
            'cicilan'             => Pembayaran::where('status_pembayaran', 'cicilan')->count(),
            'menunggu'            => Pembayaran::where('status_pembayaran', 'menunggu')->count(),
            'ditolak'             => Pembayaran::where('status_pembayaran', 'ditolak')->count(),
            'estimasi_dana_masuk' => Pembayaran::where('status_pembayaran', 'lunas')->count() * 1500000,
            'format_rupiah'       => 'Rp ' . number_format(
                Pembayaran::where('status_pembayaran', 'lunas')->count() * 1500000,
                0,
                ',',
                '.'
            ),
        ];

        return response()->json([
            'success' => true,
            'summary' => $summary,
            'data'    => $data,
        ]);
    }
}
