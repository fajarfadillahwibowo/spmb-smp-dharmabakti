<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\Pembayaran;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Menampilkan dashboard admin dengan statistik.
     */
    public function index()
    {
        $admin = Auth::user()->admin;

        // Hitung statistik
        $totalPendaftar = Pendaftaran::count();
        $belumLengkap = Pendaftaran::where('status_pendaftaran', 'belum_lengkap')->count();
        $menungguVerifikasi = Pendaftaran::where('status_pendaftaran', 'menunggu_verifikasi')->count();
        $terverifikasi = Pendaftaran::where('status_pendaftaran', 'terverifikasi')->count();

        // Statistik seleksi
        $diterima = Pendaftaran::whereHas('seleksi', function ($query) {
            $query->where('status_seleksi', 'diterima');
        })->count();
        
        $ditolak = Pendaftaran::whereHas('seleksi', function ($query) {
            $query->where('status_seleksi', 'tidak_diterima');
        })->count();

        // Statistik pembayaran
        $totalLunas = Pembayaran::where('status_pembayaran', 'lunas')->count();
        $totalCicilan = Pembayaran::where('status_pembayaran', 'cicilan')->count();
        $menungguPembayaran = Pembayaran::where('status_pembayaran', 'menunggu')->count();

        return view('admin.dashboard', compact(
            'admin',
            'totalPendaftar',
            'belumLengkap',
            'menungguVerifikasi',
            'terverifikasi',
            'diterima',
            'ditolak',
            'totalLunas',
            'totalCicilan',
            'menungguPembayaran'
        ));
    }
}
