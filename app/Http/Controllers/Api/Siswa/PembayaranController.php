<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Controller API untuk halaman pembayaran pendaftaran calon siswa.
 * Menampilkan informasi rekening dan menerima upload bukti transfer.
 */
class PembayaranController extends Controller
{
    /**
     * Menampilkan informasi pembayaran dan status bukti yang sudah diupload.
     */
    public function show(Request $request)
    {
        $calonSiswa  = $request->user()->calonSiswa;
        $pendaftaran = $calonSiswa?->pendaftaran;

        if (!$pendaftaran) {
            return response()->json([
                'success' => false,
                'message' => 'Data pendaftaran tidak ditemukan.',
            ], 404);
        }

        // Cek apakah siswa sudah diterima (syarat untuk akses halaman pembayaran)
        $pendaftaran->load(['seleksi.pengumuman', 'pembayaran']);
        $pengumuman = $pendaftaran->seleksi?->pengumuman;

        if (!$pengumuman || $pengumuman->hasil_pendaftaran !== 'Diterima') {
            return response()->json([
                'success' => false,
                'message' => 'Halaman pembayaran hanya tersedia untuk siswa yang dinyatakan diterima.',
            ], 403);
        }

        $pembayaran = $pendaftaran->pembayaran;

        return response()->json([
            'success' => true,
            'data'    => [
                // Informasi rekening sekolah
                'info_rekening' => [
                    'nama_bank'     => 'BNI',
                    'nomor_rekening'=> '1234567890',
                    'atas_nama'     => 'SMP Dharma Bakti',
                    'jumlah_biaya'  => 'Rp 1.500.000',
                    'keterangan'    => 'Biaya Pendaftaran SPMB Tahun Ajaran 2025/2026',
                ],
                // Status pembayaran yang sudah ada
                'pembayaran'    => $pembayaran ? [
                    'status_pembayaran' => $pembayaran->status_pembayaran,
                    'tanggal_upload'    => $pembayaran->tanggal_upload?->format('d M Y'),
                    'catatan_admin'     => $pembayaran->catatan_admin,
                    'bukti_url'         => $pembayaran->bukti_pembayaran
                        ? Storage::url($pembayaran->bukti_pembayaran)
                        : null,
                ] : null,
            ],
        ]);
    }

    /**
     * Menerima dan menyimpan upload bukti pembayaran dari calon siswa.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'bukti_pembayaran' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $calonSiswa  = $request->user()->calonSiswa;
        $pendaftaran = $calonSiswa?->pendaftaran;

        if (!$pendaftaran) {
            return response()->json(['success' => false, 'message' => 'Data pendaftaran tidak ditemukan.'], 404);
        }

        // Cek apakah siswa diterima
        $pendaftaran->load(['seleksi.pengumuman']);
        $pengumuman = $pendaftaran->seleksi?->pengumuman;

        if (!$pengumuman || $pengumuman->hasil_pendaftaran !== 'Diterima') {
            return response()->json(['success' => false, 'message' => 'Akses ditolak.'], 403);
        }

        // Ambil atau buat record pembayaran
        $pembayaran = $pendaftaran->pembayaran()->firstOrNew([]);

        // Hapus file lama jika ada
        if ($pembayaran->bukti_pembayaran && Storage::disk('public')->exists($pembayaran->bukti_pembayaran)) {
            Storage::disk('public')->delete($pembayaran->bukti_pembayaran);
        }

        // Simpan file bukti pembayaran
        $path = $request->file('bukti_pembayaran')
            ->store('pembayaran/' . $pendaftaran->nomor_pendaftaran, 'public');

        $pembayaran->fill([
            'id_pendaftaran'    => $pendaftaran->id_pendaftaran,
            'bukti_pembayaran'  => $path,
            'tanggal_upload'    => now(),
            'status_pembayaran' => 'menunggu',
        ])->save();

        return response()->json([
            'success' => true,
            'message' => 'Bukti pembayaran berhasil diunggah. Mohon tunggu konfirmasi dari admin.',
            'data'    => [
                'status_pembayaran' => $pembayaran->status_pembayaran,
                'bukti_url'         => Storage::url($path),
            ],
        ]);
    }
}
