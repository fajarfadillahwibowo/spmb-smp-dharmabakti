<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\PengaturanPembayaran;
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
     * Dapat diakses oleh seluruh calon siswa yang terdaftar.
     */
    public function show(Request $request)
    {
        $calonSiswa  = $request->user()->calonSiswa;
        $pendaftaran = $calonSiswa?->pendaftaran;
        $pembayaran  = $pendaftaran?->pembayaran;
        $rek         = PengaturanPembayaran::getPengaturan();

        return response()->json([
            'success' => true,
            'data'    => [
                // Informasi rekening sekolah dinamis yang diatur oleh admin
                'info_rekening' => [
                    'nama_bank'      => $rek->nama_bank,
                    'nomor_rekening' => $rek->nomor_rekening,
                    'atas_nama'      => $rek->atas_nama,
                    'jumlah_biaya'   => $rek->jumlah_biaya,
                    'keterangan'     => $rek->keterangan,
                ],
                'nomor_pendaftaran' => $pendaftaran?->nomor_pendaftaran,
                // Status pembayaran yang sudah ada (jika sudah ada pendaftaran)
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
            return response()->json([
                'success' => false,
                'message' => 'Silakan lengkapi formulir pendaftaran terlebih dahulu sebelum mengunggah bukti pembayaran.',
            ], 422);
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
