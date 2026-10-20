<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;

/**
 * Controller API Dashboard untuk Portal Admin.
 * Menampilkan statistik dan ringkasan data SPMB.
 */
class DashboardController extends Controller
{
    /**
     * Mengembalikan data statistik untuk dashboard admin.
     */
    public function index(Request $request)
    {
        $admin = $request->user()->admin;

        // =====================================================
        // Statistik status pendaftaran/berkas
        // =====================================================
        $totalPendaftar      = Pendaftaran::count();
        $belumLengkap        = Pendaftaran::where('status_pendaftaran', 'belum_lengkap')->count();
        $menungguVerifikasi  = Pendaftaran::where('status_pendaftaran', 'menunggu_verifikasi')->count();
        $terverifikasi       = Pendaftaran::where('status_pendaftaran', 'terverifikasi')->count();
        $ditolakBerkas       = Pendaftaran::where('status_pendaftaran', 'ditolak')->count();

        // =====================================================
        // Statistik hasil seleksi
        // =====================================================
        $diterima = Pendaftaran::whereHas('seleksi', function ($q) {
            $q->where('status_seleksi', 'diterima');
        })->count();

        $tidakDiterima = Pendaftaran::whereHas('seleksi', function ($q) {
            $q->where('status_seleksi', 'tidak_diterima');
        })->count();

        // =====================================================
        // Statistik pembayaran
        // =====================================================
        $totalLunas            = Pembayaran::where('status_pembayaran', 'lunas')->count();
        $totalCicilan          = Pembayaran::where('status_pembayaran', 'cicilan')->count();
        $menungguPembayaran    = Pembayaran::where('status_pembayaran', 'menunggu_verifikasi')->count();

        return response()->json([
            'success' => true,
            'data'    => [
                'admin_info' => $admin ? [
                    'nama'    => $admin->nama_admin,
                    'jabatan' => $admin->jabatan,
                ] : null,
                'statistik_pendaftaran' => [
                    'total'               => $totalPendaftar,
                    'belum_lengkap'       => $belumLengkap,
                    'menunggu_verifikasi' => $menungguVerifikasi,
                    'terverifikasi'       => $terverifikasi,
                    'ditolak'             => $ditolakBerkas,
                ],
                'statistik_seleksi' => [
                    'diterima'        => $diterima,
                    'tidak_diterima'  => $tidakDiterima,
                    'menunggu'        => $terverifikasi - ($diterima + $tidakDiterima),
                ],
                'statistik_pembayaran' => [
                    'lunas'               => $totalLunas,
                    'cicilan'             => $totalCicilan,
                    'menunggu_verifikasi' => $menungguPembayaran,
                ],
            ],
        ]);
    }
}
