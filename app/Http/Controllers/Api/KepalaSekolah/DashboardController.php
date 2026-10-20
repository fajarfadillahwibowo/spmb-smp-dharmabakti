<?php

namespace App\Http\Controllers\Api\KepalaSekolah;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Controller Dashboard Pengawas / Kepala Sekolah (Read-Only).
 * Menghitung metrik eksekutif agregat untuk pendaftaran, seleksi, dan keuangan.
 */
class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $tahunSekarang = date('Y');

        // 1. Metrik Agregat Pendaftaran (Single-Trip Query)
        $statPendaftaran = Pendaftaran::whereYear('tanggal_daftar', $tahunSekarang)
            ->selectRaw("
                COUNT(*) as total_pendaftar,
                SUM(CASE WHEN status_pendaftaran = 'belum_lengkap' THEN 1 ELSE 0 END) as total_belum_lengkap,
                SUM(CASE WHEN status_pendaftaran = 'menunggu_verifikasi' THEN 1 ELSE 0 END) as total_menunggu_verifikasi,
                SUM(CASE WHEN status_pendaftaran = 'terverifikasi' THEN 1 ELSE 0 END) as total_terverifikasi,
                SUM(CASE WHEN status_pendaftaran = 'ditolak' THEN 1 ELSE 0 END) as total_ditolak
            ")->first();

        // 2. Metrik Kelulusan Seleksi
        $statSeleksi = DB::table('seleksis')
            ->join('pendaftarans', 'seleksis.id_pendaftaran', '=', 'pendaftarans.id_pendaftaran')
            ->whereYear('pendaftarans.tanggal_daftar', $tahunSekarang)
            ->selectRaw("
                COUNT(*) as total_ujian,
                SUM(CASE WHEN seleksis.status_seleksi = 'diterima' THEN 1 ELSE 0 END) as lulus,
                SUM(CASE WHEN seleksis.status_seleksi = 'tidak_diterima' THEN 1 ELSE 0 END) as tidak_lulus,
                ROUND(AVG(seleksis.nilai_seleksi), 1) as rata_rata_nilai
            ")->first();

        // 3. Metrik Finansial Pembayaran
        $statKeuangan = Pembayaran::selectRaw("
                COUNT(*) as total_transaksi,
                SUM(CASE WHEN status_pembayaran = 'lunas' THEN 1500000 ELSE 0 END) as total_dana_masuk,
                SUM(CASE WHEN status_pembayaran = 'menunggu' THEN 1 ELSE 0 END) as total_verifikasi_pending,
                SUM(CASE WHEN status_pembayaran = 'lunas' THEN 1 ELSE 0 END) as total_siswa_lunas,
                SUM(CASE WHEN status_pembayaran = 'cicilan' THEN 1 ELSE 0 END) as total_siswa_cicilan
            ")->first();

        // 4. Tren Pendaftaran 7 Hari Terakhir
        $trenHarian = Pendaftaran::where('tanggal_daftar', '>=', now()->subDays(6)->startOfDay())
            ->selectRaw("DATE_FORMAT(tanggal_daftar, '%d/%m') as tanggal, COUNT(*) as jumlah")
            ->groupBy(DB::raw("DATE_FORMAT(tanggal_daftar, '%d/%m')"))
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'tahun_ajaran' => "{$tahunSekarang}/" . ($tahunSekarang + 1),
                'pendaftaran'  => [
                    'total'         => (int) ($statPendaftaran->total_pendaftar ?? 0),
                    'terverifikasi' => (int) ($statPendaftaran->total_terverifikasi ?? 0),
                    'menunggu'      => (int) ($statPendaftaran->total_menunggu_verifikasi ?? 0),
                    'belum_lengkap' => (int) ($statPendaftaran->total_belum_lengkap ?? 0),
                    'ditolak'       => (int) ($statPendaftaran->total_ditolak ?? 0),
                ],
                'seleksi'      => [
                    'peserta'   => (int) ($statSeleksi->total_ujian ?? 0),
                    'diterima'  => (int) ($statSeleksi->lulus ?? 0),
                    'ditolak'   => (int) ($statSeleksi->tidak_lulus ?? 0),
                    'rata_rata' => (float) ($statSeleksi->rata_rata_nilai ?? 0),
                ],
                'keuangan'     => [
                    'dana_terkumpul'      => (int) ($statKeuangan->total_dana_masuk ?? 0),
                    'format_rupiah'       => 'Rp ' . number_format($statKeuangan->total_dana_masuk ?? 0, 0, ',', '.'),
                    'lunas'               => (int) ($statKeuangan->total_siswa_lunas ?? 0),
                    'cicilan'             => (int) ($statKeuangan->total_siswa_cicilan ?? 0),
                    'menunggu_konfirmasi' => (int) ($statKeuangan->total_verifikasi_pending ?? 0),
                ],
                'tren_pendaftaran' => $trenHarian,
            ],
        ]);
    }
}
