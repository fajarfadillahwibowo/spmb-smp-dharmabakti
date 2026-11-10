<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotifikasiController extends Controller
{
    /**
     * GET /api/admin/notifikasi
     * Ambil semua notifikasi yang pernah dikirim admin (untuk panel riwayat).
     */
    public function index()
    {
        $notifikasi = Notifikasi::with('admin', 'user')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($n) {
                return [
                    'id'           => $n->id,
                    'judul'        => $n->judul,
                    'pesan'        => $n->pesan,
                    'tipe'         => $n->tipe,
                    'is_broadcast' => $n->is_broadcast,
                    'penerima'     => $n->is_broadcast ? 'Semua Siswa' : ($n->user?->username ?? '-'),
                    'pengirim'     => $n->admin?->nama_admin ?? 'Admin',
                    'waktu'        => $n->created_at->format('d/m/Y H:i'),
                    'created_at'   => $n->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data'    => $notifikasi,
        ]);
    }

    /**
     * POST /api/admin/notifikasi
     * Kirim notifikasi ke semua siswa (broadcast) atau ke siswa tertentu.
     *
     * Body JSON:
     *   judul        : string (required)
     *   pesan        : string (required)
     *   tipe         : info|peringatan|sukses|penting (default: info)
     *   is_broadcast : boolean (default: false)
     *   user_id      : integer (required jika is_broadcast = false)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul'        => 'required|string|max:255',
            'pesan'        => 'required|string',
            'tipe'         => 'in:info,peringatan,sukses,penting',
            'is_broadcast' => 'boolean',
            'user_id'      => 'required_if:is_broadcast,false|nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $adminId = $request->user()->admin?->id;

        $notifikasi = Notifikasi::create([
            'admin_id'     => $adminId,
            'user_id'      => $request->boolean('is_broadcast') ? null : $request->user_id,
            'judul'        => $request->judul,
            'pesan'        => $request->pesan,
            'tipe'         => $request->tipe ?? 'info',
            'is_broadcast' => $request->boolean('is_broadcast', false),
        ]);

        $penerima = $notifikasi->is_broadcast
            ? 'Semua Siswa'
            : (User::find($request->user_id)?->username ?? 'Siswa');

        return response()->json([
            'success' => true,
            'message' => "Notifikasi berhasil dikirim ke {$penerima}.",
            'data'    => [
                'id'           => $notifikasi->id,
                'judul'        => $notifikasi->judul,
                'is_broadcast' => $notifikasi->is_broadcast,
                'penerima'     => $penerima,
                'waktu'        => $notifikasi->created_at->format('d/m/Y H:i'),
            ],
        ], 201);
    }

    /**
     * DELETE /api/admin/notifikasi/{id}
     * Hapus notifikasi.
     */
    public function destroy($id)
    {
        $notifikasi = Notifikasi::findOrFail($id);
        $notifikasi->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi berhasil dihapus.',
        ]);
    }
}
