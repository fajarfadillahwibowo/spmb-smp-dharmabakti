<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    /**
     * GET /api/siswa/notifikasi
     * Ambil semua notifikasi untuk siswa yang login:
     *   - Notifikasi broadcast (is_broadcast = true)
     *   - Notifikasi khusus untuk user ini
     * Dilengkapi status is_read per notifikasi.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $notifikasi = Notifikasi::where(function ($q) use ($userId) {
                $q->where('is_broadcast', true)
                  ->orWhere('user_id', $userId);
            })
            ->with(['readers' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($n) use ($userId) {
                $isRead = $n->readers->isNotEmpty();
                return [
                    'id'         => $n->id,
                    'judul'      => $n->judul,
                    'pesan'      => $n->pesan,
                    'tipe'       => $n->tipe,
                    'is_read'    => $isRead,
                    'waktu'      => $n->created_at->diffForHumans(),
                    'waktu_raw'  => $n->created_at->format('d/m/Y H:i'),
                ];
            });

        $unreadCount = $notifikasi->where('is_read', false)->count();

        return response()->json([
            'success'      => true,
            'unread_count' => $unreadCount,
            'data'         => $notifikasi->values(),
        ]);
    }

    /**
     * POST /api/siswa/notifikasi/{id}/read
     * Tandai satu notifikasi sebagai sudah dibaca.
     */
    public function markRead(Request $request, $id)
    {
        $userId = $request->user()->id;

        $notifikasi = Notifikasi::where(function ($q) use ($userId) {
            $q->where('is_broadcast', true)->orWhere('user_id', $userId);
        })->findOrFail($id);

        // Insert ignore jika sudah pernah dibaca
        $notifikasi->readers()->syncWithoutDetaching([$userId => ['read_at' => now()]]);

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi ditandai sudah dibaca.',
        ]);
    }

    /**
     * POST /api/siswa/notifikasi/read-all
     * Tandai semua notifikasi sebagai sudah dibaca.
     */
    public function markAllRead(Request $request)
    {
        $userId = $request->user()->id;

        $notifikasis = Notifikasi::where(function ($q) use ($userId) {
            $q->where('is_broadcast', true)->orWhere('user_id', $userId);
        })->get();

        foreach ($notifikasis as $n) {
            $n->readers()->syncWithoutDetaching([$userId => ['read_at' => now()]]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Semua notifikasi telah ditandai dibaca.',
        ]);
    }
}
