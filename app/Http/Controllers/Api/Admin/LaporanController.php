<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Controller API untuk laporan data pendaftaran SPMB.
 * Menyediakan pratinjau rekapitulasi data diri, download PDF, dan download berkas foto calon siswa.
 */
class LaporanController extends Controller
{
    /**
     * Mengembalikan data rekapitulasi laporan lengkap dalam format JSON untuk pratinjau mobile.
     */
    public function index(Request $request)
    {
        // Ambil semua data pendaftaran berurutan beserta relasi lengkap
        $pendaftarans = Pendaftaran::with([
            'calonSiswa',
            'seleksi',
            'pembayaran',
            'dokumen',
        ])->orderBy('id_pendaftaran', 'asc')->get();

        $bulanIndo = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];

        // Format data laporan lengkap (semua atribut data diri untuk pratinjau resmi)
        $data = $pendaftarans->map(function ($p, $index) use ($bulanIndo) {
            $cs = $p->calonSiswa;

            $ttl = '-';
            if ($cs?->tempat_lahir || $cs?->tanggal_lahir) {
                $tempat = strtoupper(trim($cs->tempat_lahir ?: '-'));
                if ($cs->tanggal_lahir) {
                    $d = Carbon::parse($cs->tanggal_lahir);
                    $tgl = sprintf('%02d %s %d', $d->day, $bulanIndo[$d->month], $d->year);
                    $ttl = $tempat . ', ' . $tgl;
                } else {
                    $ttl = $tempat;
                }
            }

            $jk = ($cs?->jenis_kelamin === 'Perempuan' || $cs?->jenis_kelamin === 'PR') ? 'PR' : 'LK';

            $ayah = $cs?->nama_ayah ? strtoupper(trim($cs->nama_ayah)) : '';
            $ibu = $cs?->nama_ibu ? strtoupper(trim($cs->nama_ibu)) : '';
            if ($ayah && $ibu) {
                $ortu = "$ayah / $ibu";
            } elseif ($ayah) {
                $ortu = $ayah;
            } elseif ($ibu) {
                $ortu = $ibu;
            } else {
                $ortu = '-';
            }

            return [
                'no'                 => $index + 1,
                'id_pendaftaran'     => $p->id_pendaftaran,
                'nomor_pendaftaran'  => $p->nomor_pendaftaran,
                'nama_lengkap'       => strtoupper($cs?->nama_lengkap ?? '-'),
                'nisn'               => $cs?->nisn ?? '-',
                'nik'                => $cs?->nik ?? '-',
                'no_kk'              => $cs?->no_kk ?? '-',
                'jenis_kelamin'      => $jk,
                'tempat_tanggal_lahir' => $ttl,
                'agama'              => strtoupper($cs?->agama ?? 'ISLAM'),
                'asal_sekolah'       => strtoupper($p->asal_sekolah ?? '-'),
                'nama_orang_tua'     => $ortu,
                'nama_ayah'          => $ayah ?: '-',
                'nama_ibu'           => $ibu ?: '-',
                'no_hp_ortu'         => $cs?->no_hp_ortu ?? '-',
                'alamat'             => $cs?->alamat ?? '-',
                'ukuran_pakaian'     => $cs?->ukuran_pakaian ?? 'M',
                'tanggal_daftar'     => $p->tanggal_daftar?->format('d/m/Y'),
                'status_berkas'      => $p->status_pendaftaran,
                'nilai_seleksi'      => $p->seleksi?->nilai_seleksi ?? '-',
                'status_seleksi'     => $p->seleksi?->status_seleksi ?? 'belum',
                'status_pembayaran'  => $p->pembayaran?->status_pembayaran ?? 'belum',
            ];
        });

        // Ringkasan statistik laporan
        $ringkasan = [
            'total_pendaftar'      => $pendaftarans->count(),
            'total_diterima'       => $pendaftarans->filter(fn($p) => $p->seleksi?->status_seleksi === 'diterima')->count(),
            'total_tidak_diterima' => $pendaftarans->filter(fn($p) => $p->seleksi?->status_seleksi === 'tidak_diterima')->count(),
            'total_lunas'          => $pendaftarans->filter(fn($p) => $p->pembayaran?->status_pembayaran === 'lunas')->count(),
            'tanggal_laporan'      => now()->format('d M Y H:i'),
        ];

        return response()->json([
            'success'   => true,
            'ringkasan' => $ringkasan,
            'data'      => $data,
        ]);
    }

    /**
     * Download Berkas Rekapitulasi Data Diri Calon Siswa dalam format PDF Resmi.
     */
    public function exportPdf(Request $request)
    {
        $pendaftarans = Pendaftaran::with(['calonSiswa', 'seleksi', 'pembayaran'])
            ->orderBy('id_pendaftaran', 'asc')
            ->get();

        $ringkasan = [
            'total_pendaftar'      => $pendaftarans->count(),
            'total_diterima'       => $pendaftarans->filter(fn($p) => $p->seleksi?->status_seleksi === 'diterima')->count(),
            'total_tidak_diterima' => $pendaftarans->filter(fn($p) => $p->seleksi?->status_seleksi === 'tidak_diterima')->count(),
            'total_lunas'          => $pendaftarans->filter(fn($p) => $p->pembayaran?->status_pembayaran === 'lunas')->count(),
            'tanggal_cetak'        => now()->translatedFormat('d F Y'),
        ];

        $pdf = Pdf::loadView('admin.cetak-laporan.pdf', compact('pendaftarans', 'ringkasan'))
                  ->setPaper('a4', 'landscape')
                  ->setOption([
                      'isHtml5ParserEnabled' => true,
                      'isRemoteEnabled' => true,
                      'defaultFont' => 'sans-serif',
                  ]);

        return $pdf->download('REKAPITULASI_DATA_DIRI_CALON_SISWA_2026-2027.pdf');
    }

    /**
     * Stream / Pratinjau PDF langsung di browser sebelum mengunduh.
     */
    public function previewPdf(Request $request)
    {
        $pendaftarans = Pendaftaran::with(['calonSiswa', 'seleksi', 'pembayaran'])
            ->orderBy('id_pendaftaran', 'asc')
            ->get();

        $ringkasan = [
            'total_pendaftar'      => $pendaftarans->count(),
            'total_diterima'       => $pendaftarans->filter(fn($p) => $p->seleksi?->status_seleksi === 'diterima')->count(),
            'total_tidak_diterima' => $pendaftarans->filter(fn($p) => $p->seleksi?->status_seleksi === 'tidak_diterima')->count(),
            'total_lunas'          => $pendaftarans->filter(fn($p) => $p->pembayaran?->status_pembayaran === 'lunas')->count(),
            'tanggal_cetak'        => now()->translatedFormat('d F Y'),
        ];

        $pdf = Pdf::loadView('admin.cetak-laporan.pdf', compact('pendaftarans', 'ringkasan'))
                  ->setPaper('a4', 'landscape')
                  ->setOption([
                      'isHtml5ParserEnabled' => true,
                      'isRemoteEnabled' => true,
                      'defaultFont' => 'sans-serif',
                  ]);

        return $pdf->stream('REKAPITULASI_DATA_DIRI_CALON_SISWA_2026-2027.pdf');
    }

    /**
     * Download berkas foto yang diunggah oleh calon siswa (Pasfoto, Akte, KK, Ijazah, Bukti Bayar) untuk Admin.
     */
    public function downloadFile(Request $request)
    {
        $path = $request->query('path');
        $name = $request->query('name', 'dokumen_pendaftar');

        if (!$path) {
            return response()->json(['message' => 'Path berkas tidak diberikan'], 400);
        }

        // Hilangkan URL host jika ada
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            $parsed = parse_url($path);
            $path = $parsed['path'] ?? '';
        }

        // Bersihkan prefix storage
        $cleanPath = preg_replace('/^\/?(storage\/)?/', '', $path);
        $fullPath = storage_path('app/public/' . $cleanPath);

        if (!file_exists($fullPath)) {
            $fullPath = public_path($cleanPath);
        }

        if (!file_exists($fullPath) || is_dir($fullPath)) {
            return response()->json(['message' => 'Berkas tidak ditemukan di server.'], 404);
        }

        // Pastikan path berada dalam storage/app/public atau public
        $realFullPath = realpath($fullPath);
        $storageBase = realpath(storage_path('app/public'));
        $publicBase = realpath(public_path());
        if (!$realFullPath || (!str_starts_with($realFullPath, $storageBase) && !str_starts_with($realFullPath, $publicBase))) {
            return response()->json(['message' => 'Akses berkas ditolak.'], 403);
        }

        $ext = pathinfo($realFullPath, PATHINFO_EXTENSION) ?: 'jpg';
        $safeName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $name);
        if (!str_ends_with(strtolower($safeName), '.' . strtolower($ext))) {
            $safeName .= '.' . $ext;
        }

        $mime = mime_content_type($realFullPath) ?: 'application/octet-stream';

        return response()->download($realFullPath, $safeName, [
            'Content-Type' => $mime,
        ]);
    }

    /**
     * Download data pendaftar dalam format Excel / CSV resmi T.P 2026-2027.
     */
    public function exportExcel(Request $request)
    {
        $response = new StreamedResponse(function () use ($request) {
            $handle = fopen('php://output', 'w');
            
            // Header CSV (Tambahkan BOM UTF-8)
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
                        $d = Carbon::parse($cs->tanggal_lahir);
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
