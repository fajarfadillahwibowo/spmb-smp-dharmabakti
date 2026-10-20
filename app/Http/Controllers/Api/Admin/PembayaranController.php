<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Controller API untuk verifikasi bukti pembayaran oleh admin.
 */
class PembayaranController extends Controller
{
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
     * Memperbarui status verifikasi pembayaran (lunas, cicilan, ditolak).
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
        ]);
    }
}
