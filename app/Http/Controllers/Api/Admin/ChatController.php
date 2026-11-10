<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ChatController extends Controller
{
    /**
     * GET /api/admin/chat/conversations - Daftar semua siswa yang berinteraksi chat
     */
    public function conversations(Request $request)
    {
        $admin = $request->user();

        // Cari semua siswa yang memiliki riwayat chat atau terdaftar
        $siswaUsers = User::where('role', 'siswa')
            ->with(['calonSiswa.pendaftaran'])
            ->get();

        $list = [];

        foreach ($siswaUsers as $siswa) {
            $lastMsg = ChatMessage::where(function ($q) use ($siswa, $admin) {
                    $q->where('sender_id', $siswa->id)->where('receiver_id', $admin->id);
                })
                ->orWhere(function ($q) use ($siswa, $admin) {
                    $q->where('sender_id', $admin->id)->where('receiver_id', $siswa->id);
                })
                ->orderBy('created_at', 'desc')
                ->first();

            $unreadCount = ChatMessage::where('sender_id', $siswa->id)
                ->where('receiver_id', $admin->id)
                ->where('is_read', false)
                ->count();

            $nama = $siswa->calonSiswa?->nama_lengkap ?? $siswa->name ?? $siswa->username;
            $nomorDaftar = $siswa->calonSiswa?->pendaftaran?->nomor_pendaftaran ?? 'Belum ada nomor';

            // Masukkan siswa jika pernah chat atau jika siswa terdaftar
            if ($lastMsg || $siswa->calonSiswa) {
                $list[] = [
                    'siswa_id' => $siswa->id,
                    'nama' => $nama,
                    'nomor_pendaftaran' => $nomorDaftar,
                    'foto_profil_url' => $siswa->foto_profil_url,
                    'last_message' => $lastMsg ? $lastMsg->pesan : 'Mulai percakapan dengan calon siswa ini',
                    'last_time' => $lastMsg ? Carbon::parse($lastMsg->created_at)->timezone('Asia/Jakarta')->format('H:i') : null,
                    'last_date' => $lastMsg ? Carbon::parse($lastMsg->created_at)->timezone('Asia/Jakarta')->translatedFormat('d M') : null,
                    'last_timestamp' => $lastMsg ? $lastMsg->created_at->timestamp : 0,
                    'unread_count' => $unreadCount,
                ];
            }
        }

        // Urutkan berdasarkan timestamp pesan terakhir paling baru
        usort($list, function ($a, $b) {
            return $b['last_timestamp'] <=> $a['last_timestamp'];
        });

        return response()->json([
            'success' => true,
            'data' => $list,
        ]);
    }

    /**
     * GET /api/admin/chat/{siswa_id} - Detail riwayat chat dengan 1 siswa
     */
    public function messages(Request $request, $siswa_id)
    {
        $admin = $request->user();
        $siswa = User::where('id', $siswa_id)->where('role', 'siswa')->first();

        if (!$siswa) {
            return response()->json([
                'success' => false,
                'message' => 'Calon siswa tidak ditemukan.',
            ], 404);
        }

        // Tandai pesan dari siswa ke admin ini sebagai sudah dibaca
        ChatMessage::where('sender_id', $siswa->id)
            ->where('receiver_id', $admin->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = ChatMessage::where(function ($q) use ($siswa, $admin) {
                $q->where('sender_id', $siswa->id)->where('receiver_id', $admin->id);
            })
            ->orWhere(function ($q) use ($siswa, $admin) {
                $q->where('sender_id', $admin->id)->where('receiver_id', $siswa->id);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($msg) use ($admin) {
                return [
                    'id' => $msg->id,
                    'pesan' => $msg->pesan,
                    'is_me' => $msg->sender_id === $admin->id,
                    'is_read' => $msg->is_read,
                    'waktu' => Carbon::parse($msg->created_at)->timezone('Asia/Jakarta')->format('H:i'),
                    'tanggal' => Carbon::parse($msg->created_at)->timezone('Asia/Jakarta')->translatedFormat('d M Y'),
                    'created_at' => $msg->created_at->toISOString(),
                ];
            });

        $namaSiswa = $siswa->calonSiswa?->nama_lengkap ?? $siswa->name ?? $siswa->username;

        return response()->json([
            'success' => true,
            'data' => [
                'siswa' => [
                    'id' => $siswa->id,
                    'nama' => $namaSiswa,
                    'nomor_pendaftaran' => $siswa->calonSiswa?->pendaftaran?->nomor_pendaftaran ?? '-',
                    'foto_profil_url' => $siswa->foto_profil_url,
                ],
                'messages' => $messages,
            ]
        ]);
    }

    /**
     * POST /api/admin/chat/{siswa_id} - Balas pesan ke siswa
     */
    public function send(Request $request, $siswa_id)
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

        $admin = $request->user();
        $siswa = User::where('id', $siswa_id)->where('role', 'siswa')->first();

        if (!$siswa) {
            return response()->json([
                'success' => false,
                'message' => 'Calon siswa tidak ditemukan.',
            ], 404);
        }

        $chat = ChatMessage::create([
            'sender_id' => $admin->id,
            'receiver_id' => $siswa->id,
            'pesan' => trim($request->pesan),
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pesan balasan berhasil terkirim.',
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
     * GET /api/admin/chat/unread-count - Hitung seluruh pesan unread untuk admin
     */
    public function unreadCount(Request $request)
    {
        $admin = $request->user();

        $count = ChatMessage::where('receiver_id', $admin->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'unread_count' => $count,
        ]);
    }
}
