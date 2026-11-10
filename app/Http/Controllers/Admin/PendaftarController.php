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
     * Export data pendaftar ke format Excel/CSV resmi SMP Dharma Bakti T.P 2026-2027.
     */
    public function exportCsv(Request $request)
    {
        $response = new StreamedResponse(function () use ($request) {
            $handle = fopen('php://output', 'w');
            
            // Header CSV (Tambahkan BOM agar Excel membaca UTF-8 dengan benar)
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));
            
            // Baris 1: Judul
            fputcsv($handle, ['DATA PESERTA DIDIK BARU TAHUN PELAJARAN 2026-2027', '', '', '', '', '', '', '', '', '', '', '', '', '']);
            // Baris 2: Baris kosong
            fputcsv($handle, ['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
            
            // Baris 3: Header Kolom Resmi Sesuai Template Sekolah
            fputcsv($handle, [
                'NO',
                'NISN',
                'NAMA PESERTA DIDIK ',
                'Jenis Kelamin',
                'TEMPAT/ TANGGAL LAHIR ',
                'AGAMA ',
                'STATUS ',
                'ALAMAT PESERTA DIDIK ',
                'NAMA AYAH ',
                'NAMA IBU ',
                'NO TELEPON ',
                'ASAL SEKOLAH ',
                'NO KK',
                'NIK'
            ]);

            $bulanIndo = [
                1 => 'JANUARI', 2 => 'FEBRUARI', 3 => 'MARET', 4 => 'APRIL',
                5 => 'MEI', 6 => 'JUNI', 7 => 'JULI', 8 => 'AGUSTUS',
                9 => 'SEPTEMBER', 10 => 'OKTOBER', 11 => 'NOVEMBER', 12 => 'DESEMBER'
            ];

            $query = Pendaftaran::with(['calonSiswa'])->orderBy('id_pendaftaran', 'asc');
            
            if ($request->filled('status')) {
                $query->where('status_pendaftaran', $request->status);
            }

            $pendaftarans = $query->get();
            $no = 1;

            foreach ($pendaftarans as $p) {
                $cs = $p->calonSiswa;

                $ttl = '-';
                if ($cs?->tempat_lahir || $cs?->tanggal_lahir) {
                    $tempat = strtoupper(trim($cs->tempat_lahir ?: '-'));
                    if ($cs->tanggal_lahir) {
                        $d = \Carbon\Carbon::parse($cs->tanggal_lahir);
                        $tgl = sprintf('%02d %s %d', $d->day, $bulanIndo[$d->month], $d->year);
                        $ttl = $tempat . ', ' . $tgl;
                    } else {
                        $ttl = $tempat;
                    }
                }

                $jk = ($cs?->jenis_kelamin === 'Perempuan' || $cs?->jenis_kelamin === 'PR') ? 'PR' : 'LK';

                fputcsv($handle, [
                    $no,
                    $cs?->nisn ?? '-',
                    strtoupper($cs?->nama_lengkap ?? '-'),
                    $jk,
                    $ttl,
                    strtoupper($cs?->agama ?? 'ISLAM'),
                    'KANDUNG',
                    strtoupper($cs?->alamat ?? '-'),
                    strtoupper($cs?->nama_ayah ?: '-'),
                    strtoupper($cs?->nama_ibu ?: '-'),
                    $cs?->no_hp_ortu ?? '-',
                    strtoupper($p->asal_sekolah ?? '-'),
                    $cs?->no_kk ?? '-',
                    $cs?->nik ?? '-'
                ]);

                $no++;
            }

            // Tambahkan baris kosong bernomor sampai nomor 40 (sesuai template buku induk)
            for ($k = $no; $k <= 40; $k++) {
                fputcsv($handle, [$k, '', '', '', '', '', '', '', '', '', '', '', '', '']);
            }

            // Bagian pembagian kelas (sesuai template resmi)
            fputcsv($handle, ['', '', '', '', '', '', '', '']);
            fputcsv($handle, ['KELAS VII.A', '', 'NIS', '', '', 'KELAS VII.B', '', 'NIS']);
            for ($k = 1; $k <= 21; $k++) {
                fputcsv($handle, [$k, '', '', '', '', $k, '', '']);
            }
            fputcsv($handle, ['22', '', '', '', '', '', '', '']);

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="DATA_PESERTA_DIDIK_BARU_2026-2027.csv"',
        ]);

        return $response;
    }
}
