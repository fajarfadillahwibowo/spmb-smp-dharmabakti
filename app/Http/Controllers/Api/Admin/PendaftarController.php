<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Controller API untuk manajemen data pendaftar oleh Admin.
 * Mencakup: list, detail, dan export CSV.
 */
class PendaftarController extends Controller
{
    /**
     * Menampilkan daftar semua pendaftar dengan fitur pencarian dan filter.
     */
    public function index(Request $request)
    {
        $query = Pendaftaran::with(['calonSiswa', 'seleksi', 'pembayaran']);

        // Filter berdasarkan status pendaftaran
        if ($request->filled('status')) {
            $query->where('status_pendaftaran', $request->status);
        }

        // Pencarian berdasarkan nama atau nomor pendaftaran
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_pendaftaran', 'like', "%{$search}%")
                    ->orWhereHas('calonSiswa', function ($qCS) use ($search) {
                        $qCS->where('nama_lengkap', 'like', "%{$search}%")
                            ->orWhere('nisn', 'like', "%{$search}%");
                    });
            });
        }

        // Ambil dengan paginasi, 20 per halaman
        $pendaftarans = $query->latest()->paginate(20);

        // Format data untuk response JSON
        $data = $pendaftarans->through(function ($p) {
            return [
                'id_pendaftaran'     => $p->id_pendaftaran,
                'nomor_pendaftaran'  => $p->nomor_pendaftaran,
                'tanggal_daftar'     => $p->tanggal_daftar?->format('d M Y'),
                'asal_sekolah'       => $p->asal_sekolah,
                'status_pendaftaran' => $p->status_pendaftaran,
                'calon_siswa'        => $p->calonSiswa ? [
                    'nama_lengkap' => $p->calonSiswa->nama_lengkap,
                    'nisn'         => $p->calonSiswa->nisn,
                ] : null,
                'status_seleksi'     => $p->seleksi?->status_seleksi,
                'status_pembayaran'  => $p->pembayaran?->status_pembayaran,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    /**
     * Menampilkan detail lengkap seorang pendaftar.
     */
    public function show($id)
    {
        $pendaftaran = Pendaftaran::with([
            'calonSiswa.user',
            'dokumen',
            'seleksi.pengumuman',
            'pembayaran',
        ])->findOrFail($id);

        $dokumen = $pendaftaran->dokumen;

        return response()->json([
            'success' => true,
            'data'    => [
                'pendaftaran'       => [
                    'id_pendaftaran'     => $pendaftaran->id_pendaftaran,
                    'nomor_pendaftaran'  => $pendaftaran->nomor_pendaftaran,
                    'tanggal_daftar'     => $pendaftaran->tanggal_daftar?->format('d M Y'),
                    'asal_sekolah'       => $pendaftaran->asal_sekolah,
                    'status_pendaftaran' => $pendaftaran->status_pendaftaran,
                    'catatan_verifikasi' => $pendaftaran->catatan_verifikasi,
                ],
                'calon_siswa'       => $pendaftaran->calonSiswa,
                'dokumen'           => $dokumen ? [
                    'akte_kelahiran' => $dokumen->akte_kelahiran ? Storage::url($dokumen->akte_kelahiran) : null,
                    'kartu_keluarga' => $dokumen->kartu_keluarga ? Storage::url($dokumen->kartu_keluarga) : null,
                    'pasfoto'        => $dokumen->pasfoto ? Storage::url($dokumen->pasfoto) : null,
                    'ijazah'         => $dokumen->ijazah ? Storage::url($dokumen->ijazah) : null,
                ] : null,
                'seleksi'           => $pendaftaran->seleksi,
                'pengumuman'        => $pendaftaran->seleksi?->pengumuman,
                'pembayaran'        => $pendaftaran->pembayaran ? [
                    'status_pembayaran' => $pendaftaran->pembayaran->status_pembayaran,
                    'tanggal_upload'    => $pendaftaran->pembayaran->tanggal_upload?->format('d M Y'),
                    'catatan_admin'     => $pendaftaran->pembayaran->catatan_admin,
                    'bukti_url'         => $pendaftaran->pembayaran->bukti_pembayaran
                        ? Storage::url($pendaftaran->pembayaran->bukti_pembayaran)
                        : null,
                ] : null,
            ],
        ]);
    }
}
