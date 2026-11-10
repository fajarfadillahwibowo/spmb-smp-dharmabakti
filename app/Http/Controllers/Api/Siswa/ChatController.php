<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ChatController extends Controller
{
    /**
     * Helper untuk mendapatkan user Admin penanggung jawab chat
     */
    private function getAdminUser()
    {
        return User::where('role', 'admin')->first() ?? User::where('role', 'superadmin')->first();
    }

    /**
     * GET /api/siswa/chat - Ambil semua riwayat chat antara siswa & admin
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $admin = $this->getAdminUser();

        if (!$admin) {
            return response()->json([
                'success' => true,
                'data' => [
                    'admin' => [
                        'name' => 'Panitia SPMB',
                        'role' => 'Panitia Penerimaan Siswa Baru',
                        'is_online' => true,
                    ],
                    'messages' => [],
                ]
            ]);
        }

        // Tandai pesan dari admin ke siswa ini sudah dibaca
        ChatMessage::where('sender_id', $admin->id)
            ->where('receiver_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        // Ambil semua pesan dua arah
        $messages = ChatMessage::where(function ($q) use ($user, $admin) {
                $q->where('sender_id', $user->id)->where('receiver_id', $admin->id);
            })
            ->orWhere(function ($q) use ($user, $admin) {
                $q->where('sender_id', $admin->id)->where('receiver_id', $user->id);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($msg) use ($user) {
                return [
                    'id' => $msg->id,
                    'pesan' => $msg->pesan,
                    'is_me' => $msg->sender_id === $user->id,
                    'is_read' => $msg->is_read,
                    'waktu' => Carbon::parse($msg->created_at)->timezone('Asia/Jakarta')->format('H:i'),
                    'tanggal' => Carbon::parse($msg->created_at)->timezone('Asia/Jakarta')->translatedFormat('d M Y'),
                    'created_at' => $msg->created_at->toISOString(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'admin' => [
                    'id' => $admin->id,
                    'name' => $admin->name ?? 'Panitia SPMB',
                    'role' => 'Panitia PMB SMP Dharma Bakti',
                    'foto_profil_url' => $admin->foto_profil_url,
                    'is_online' => true,
                ],
                'messages' => $messages,
            ]
        ]);
    }

    /**
     * POST /api/siswa/chat - Kirim pesan dari siswa ke admin
     */
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pesan' => 'required|string|max:3000',
        ], [
            'pesan.required' => 'Pesan tidak boleh kosong.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $user = $request->user();
        $admin = $this->getAdminUser();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin panitia belum tersedia saat ini.',
            ], 500);
        }

        $chat = ChatMessage::create([
            'sender_id' => $user->id,
            'receiver_id' => $admin->id,
            'pesan' => trim($request->pesan),
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil terkirim.',
            'data' => [
                'id' => $chat->id,
                'pesan' => $chat->pesan,
                'is_me' => true,
                'is_read' => false,
                'waktu' => Carbon::parse($chat->created_at)->timezone('Asia/Jakarta')->format('H:i'),
                'tanggal' => Carbon::parse($chat->created_at)->timezone('Asia/Jakarta')->translatedFormat('d M Y'),
                'created_at' => $chat->created_at->toISOString(),
            ]
        ], 201);
    }

    /**
     * GET /api/siswa/chat/unread-count - Hitung pesan belum dibaca
     */
    public function unreadCount(Request $request)
    {
        $user = $request->user();
        $admin = $this->getAdminUser();

        $count = $admin ? ChatMessage::where('sender_id', $admin->id)
            ->where('receiver_id', $user->id)
            ->where('is_read', false)
            ->count() : 0;

        return response()->json([
            'success' => true,
            'unread_count' => $count,
        ]);
    }
}
