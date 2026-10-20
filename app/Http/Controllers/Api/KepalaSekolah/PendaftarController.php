<?php

namespace App\Http\Controllers\Api\KepalaSekolah;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Controller Monitoring Data Pendaftar untuk Kepala Sekolah (Read-Only).
 * Hanya melayani pembacaan data tanpa fitur mutasi/edit/hapus.
 */
class PendaftarController extends Controller
{
    /**
     * Menampilkan daftar seluruh calon pendaftar dengan filter dan pencarian.
     */
    public function index(Request $request)
    {
        $query = Pendaftaran::with(['calonSiswa', 'dokumen', 'seleksi', 'pembayaran']);

        // Filter berdasarkan status pendaftaran
        if ($request->filled('status')) {
            $query->where('status_pendaftaran', $request->status);
        }

        // Pencarian nama, nomor pendaftaran, atau asal sekolah
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_pendaftaran', 'LIKE', "%{$search}%")
                  ->orWhere('asal_sekolah', 'LIKE', "%{$search}%")
                  ->orWhereHas('calonSiswa', function ($cs) use ($search) {
                      $cs->where('nama_lengkap', 'LIKE', "%{$search}%")
                         ->orWhere('nisn', 'LIKE', "%{$search}%");
                  });
            });
        }

        $pendaftarans = $query->latest('tanggal_daftar')->paginate(20);

        $data = $pendaftarans->through(function ($p) {
            return [
                'id_pendaftaran'     => $p->id_pendaftaran,
                'nomor_pendaftaran'  => $p->nomor_pendaftaran,
                'tanggal_daftar'     => $p->tanggal_daftar?->format('d M Y'),
                'status_pendaftaran' => $p->status_pendaftaran,
                'asal_sekolah'       => $p->asal_sekolah,
                'nama_lengkap'       => $p->calonSiswa?->nama_lengkap ?: '-',
                'nisn'               => $p->calonSiswa?->nisn ?: '-',
                'jenis_kelamin'      => $p->calonSiswa?->jenis_kelamin ?: '-',
                'status_seleksi'     => $p->seleksi?->status_seleksi,
                'nilai_seleksi'      => $p->seleksi?->nilai_seleksi,
                'status_pembayaran'  => $p->pembayaran?->status_pembayaran ?: 'belum_bayar',
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    /**
     * Menampilkan detail lengkap satu calon pendaftar beserta seluruh berkasnya.
     */
    public function show($id)
    {
        $pendaftaran = Pendaftaran::with([
            'calonSiswa',
            'dokumen',
            'seleksi.pengumuman',
            'pembayaran',
        ])->findOrFail($id);

        $dokumen = $pendaftaran->dokumen;
        $dokumenUrls = [
            'akte_kelahiran' => $dokumen?->akte_kelahiran ? Storage::url($dokumen->akte_kelahiran) : null,
            'kartu_keluarga' => $dokumen?->kartu_keluarga ? Storage::url($dokumen->kartu_keluarga) : null,
            'pasfoto'        => $dokumen?->pasfoto ? Storage::url($dokumen->pasfoto) : null,
            'ijazah'         => $dokumen?->ijazah ? Storage::url($dokumen->ijazah) : null,
        ];

        return response()->json([
            'success' => true,
            'data'    => [
                'pendaftaran'  => [
                    'id_pendaftaran'     => $pendaftaran->id_pendaftaran,
                    'nomor_pendaftaran'  => $pendaftaran->nomor_pendaftaran,
                    'tanggal_daftar'     => $pendaftaran->tanggal_daftar?->format('d F Y'),
                    'asal_sekolah'       => $pendaftaran->asal_sekolah,
                    'status_pendaftaran' => $pendaftaran->status_pendaftaran,
                ],
                'calon_siswa'  => $pendaftaran->calonSiswa,
                'dokumen'      => $dokumenUrls,
                'seleksi'      => $pendaftaran->seleksi ? [
                    'nilai_seleksi'      => $pendaftaran->seleksi->nilai_seleksi,
                    'status_seleksi'     => $pendaftaran->seleksi->status_seleksi,
                    'tanggal_seleksi'    => $pendaftaran->seleksi->tanggal_seleksi?->format('d M Y'),
                    'catatan'            => $pendaftaran->seleksi->catatan,
                    'hasil_pengumuman'   => $pendaftaran->seleksi->pengumuman?->hasil_pendaftaran,
                ] : null,
                'pembayaran'   => $pendaftaran->pembayaran ? [
                    'status_pembayaran'  => $pendaftaran->pembayaran->status_pembayaran,
                    'tanggal_upload'     => $pendaftaran->pembayaran->tanggal_upload?->format('d M Y'),
                    'bukti_url'          => $pendaftaran->pembayaran->bukti_pembayaran
                        ? Storage::url($pendaftaran->pembayaran->bukti_pembayaran)
                        : null,
                    'catatan_admin'      => $pendaftaran->pembayaran->catatan_admin,
                ] : null,
            ],
        ]);
    }
}
