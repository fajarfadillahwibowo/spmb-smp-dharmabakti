<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\PengaturanPembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Controller API untuk verifikasi bukti pembayaran dan pengaturan rekening bank oleh admin.
 */
class PembayaranController extends Controller
{
    /**
     * Mengambil konfigurasi rekening bank dan biaya pendaftaran.
     */
    public function getPengaturan()
    {
        $pengaturan = PengaturanPembayaran::getPengaturan();

        return response()->json([
            'success' => true,
            'data'    => $pengaturan,
        ]);
    }

    /**
     * Mengubah konfigurasi rekening bank dan biaya pendaftaran oleh admin.
     */
    public function updatePengaturan(Request $request)
    {
        $request->validate([
            'nama_bank'      => 'required|string|max:100',
            'nomor_rekening' => 'required|string|max:100',
            'atas_nama'      => 'required|string|max:150',
            'jumlah_biaya'   => 'required|string|max:100',
            'keterangan'     => 'nullable|string|max:500',
        ]);

        $pengaturan = PengaturanPembayaran::getPengaturan();
        $pengaturan->update([
            'nama_bank'      => $request->nama_bank,
            'nomor_rekening' => $request->nomor_rekening,
            'atas_nama'      => $request->atas_nama,
            'jumlah_biaya'   => $request->jumlah_biaya,
            'keterangan'     => $request->keterangan,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan rekening dan biaya berhasil disimpan.',
            'data'    => $pengaturan,
        ]);
    }

    /**
     * Menampilkan daftar pembayaran yang perlu diverifikasi.
     */
    public function index(Request $request)
    {
        $query = Pembayaran::with(['pendaftaran.calonSiswa']);

        // Filter berdasarkan status
        if ($request->filled('status')) {
            $query->where('status_pembayaran', $request->status);
        }

        $pembayarans = $query->latest()->paginate(20);

        $data = $pembayarans->through(function ($p) {
            return [
                'id_pembayaran'     => $p->id_pembayaran,
                'status_pembayaran' => $p->status_pembayaran,
                'tanggal_upload'    => $p->tanggal_upload?->format('d M Y'),
                'bukti_url'         => $p->bukti_pembayaran
                    ? Storage::url($p->bukti_pembayaran)
                    : null,
                'catatan_admin'     => $p->catatan_admin,
                'pendaftaran'       => [
                    'nomor_pendaftaran' => $p->pendaftaran?->nomor_pendaftaran,
                    'nama_siswa'        => $p->pendaftaran?->calonSiswa?->nama_lengkap,
                ],
            ];
        });

        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Memperbarui status verifikasi pembayaran (lunas, cicilan, ditolak, dll) beserta catatan admin.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'status_pembayaran' => 'required|in:belum_bayar,menunggu,cicilan,lunas,ditolak',
            'catatan_admin'     => 'nullable|string|max:500',
        ]);

        $pembayaran = Pembayaran::findOrFail($id);

        $pembayaran->update([
            'status_pembayaran' => $request->status_pembayaran,
            'catatan_admin'     => $request->catatan_admin,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Status pembayaran berhasil diperbarui menjadi: ' . $request->status_pembayaran,
            'data'    => [
                'id_pembayaran'     => $pembayaran->id_pembayaran,
                'status_pembayaran' => $pembayaran->status_pembayaran,
                'catatan_admin'     => $pembayaran->catatan_admin,
            ]
        ]);
    }
}
