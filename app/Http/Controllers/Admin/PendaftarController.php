<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PendaftarController extends Controller
{
    /**
     * Menampilkan daftar semua pendaftar.
     */
    public function index(Request $request)
    {
        $query = Pendaftaran::with(['calonSiswa']);

        // Filter berdasarkan status pendaftaran
        if ($request->filled('status')) {
            $query->where('status_pendaftaran', $request->status);
        }

        // Search berdasarkan nama atau nomor pendaftaran
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nomor_pendaftaran', 'like', "%{$search}%")
                  ->orWhereHas('calonSiswa', function($qCS) use ($search) {
                      $qCS->where('nama_lengkap', 'like', "%{$search}%")
                          ->orWhere('nisn', 'like', "%{$search}%");
                  });
            });
        }

        $pendaftarans = $query->latest()->paginate(15)->withQueryString();

        return view('admin.data-pendaftar.index', compact('pendaftarans'));
    }

    /**
     * Menampilkan detail lengkap seorang pendaftar.
     */
    public function show($id)
    {
        $pendaftaran = Pendaftaran::with(['calonSiswa.user', 'dokumen', 'seleksi', 'pembayaran'])->findOrFail($id);
        
        return view('admin.data-pendaftar.show', compact('pendaftaran'));
    }

    /**
     * Export data pendaftar ke CSV (bisa dibuka di Excel).
     */
    public function exportCsv(Request $request)
    {
        $response = new StreamedResponse(function () use ($request) {
            $handle = fopen('php://output', 'w');
            
            // Header CSV (Tambahkan BOM agar Excel membaca UTF-8 dengan benar)
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));
            
            fputcsv($handle, [
                'No. Pendaftaran', 
                'Nama Lengkap', 
                'NISN', 
                'Asal Sekolah', 
                'Tanggal Daftar', 
                'Status Berkas',
                'Status Seleksi',
                'Status Pembayaran'
            ]);

            $query = Pendaftaran::with(['calonSiswa', 'seleksi', 'pembayaran']);
            
            // Terapkan filter yang sama jika ada
            if ($request->filled('status')) {
                $query->where('status_pendaftaran', $request->status);
            }

            // Chunk untuk efisiensi memori
            $query->chunk(500, function ($pendaftarans) use ($handle) {
                foreach ($pendaftarans as $p) {
                    $statusSeleksi = $p->seleksi ? $p->seleksi->status_seleksi : 'Belum';
                    $statusPembayaran = $p->pembayaran ? $p->pembayaran->status_pembayaran : 'Belum';

                    fputcsv($handle, [
                        $p->nomor_pendaftaran,
                        $p->calonSiswa->nama_lengkap,
                        $p->calonSiswa->nisn ?? '-',
                        $p->asal_sekolah ?? '-',
                        $p->tanggal_daftar->format('Y-m-d'),
                        $p->status_pendaftaran,
                        $statusSeleksi,
                        $statusPembayaran
                    ]);
                }
            });

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="Data_Pendaftar_SPMB.csv"',
        ]);

        return $response;
    }
}
