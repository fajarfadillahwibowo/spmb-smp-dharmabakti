<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Mail\JadwalSeleksiMail;
use App\Mail\RevisiBerkasMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

/**
 * Controller API untuk verifikasi berkas dan seleksi oleh admin.
 */
class VerifikasiController extends Controller
{
    /**
     * Menampilkan daftar pendaftar yang perlu diverifikasi berkasnya.
     */
    public function berkasIndex(Request $request)
    {
        $pendaftarans = Pendaftaran::whereIn('status_pendaftaran', [
            'menunggu_verifikasi',
            'terverifikasi',
            'ditolak',
        ])->with(['calonSiswa.user', 'dokumen', 'seleksi.pengumuman'])->latest()->paginate(50);

        $data = $pendaftarans->through(function ($p) {
            $dok = $p->dokumen;
            return [
                'id_pendaftaran'     => $p->id_pendaftaran,
                'nomor_pendaftaran'  => $p->nomor_pendaftaran,
                'status_pendaftaran' => $p->status_pendaftaran,
                'catatan_verifikasi' => $p->catatan_verifikasi,
                'calon_siswa'        => [
                    'nama_lengkap'   => $p->calonSiswa?->nama_lengkap,
                    'nisn'           => $p->calonSiswa?->nisn,
                    'asal_sekolah'   => $p->asal_sekolah,
                    'email'          => $p->calonSiswa?->user?->email,
                    'no_kk'          => $p->calonSiswa?->no_kk,
                    'nik'            => $p->calonSiswa?->nik,
                    'tempat_lahir'   => $p->calonSiswa?->tempat_lahir,
                    'tanggal_lahir'  => $p->calonSiswa?->tanggal_lahir?->format('d-m-Y'),
                    'jenis_kelamin'  => $p->calonSiswa?->jenis_kelamin,
                    'agama'          => $p->calonSiswa?->agama,
                    'alamat'         => $p->calonSiswa?->alamat,
                    'nama_ayah'      => $p->calonSiswa?->nama_ayah,
                    'pekerjaan_ayah' => $p->calonSiswa?->pekerjaan_ayah,
                    'alamat_ayah'    => $p->calonSiswa?->alamat_ayah,
                    'nama_ibu'       => $p->calonSiswa?->nama_ibu,
                    'pekerjaan_ibu'  => $p->calonSiswa?->pekerjaan_ibu,
                    'alamat_ibu'     => $p->calonSiswa?->alamat_ibu,
                    'no_hp_ortu'     => $p->calonSiswa?->no_hp_ortu,
                    'ukuran_pakaian' => $p->calonSiswa?->ukuran_pakaian,
                ],
                'dokumen'            => $dok ? [
                    'akte_kelahiran' => $dok->akte_kelahiran ? Storage::url($dok->akte_kelahiran) : null,
                    'kartu_keluarga' => $dok->kartu_keluarga ? Storage::url($dok->kartu_keluarga) : null,
                    'pasfoto'        => $dok->pasfoto ? Storage::url($dok->pasfoto) : null,
                    'ijazah'         => $dok->ijazah ? Storage::url($dok->ijazah) : null,
                ] : null,
                'dokumen_lengkap'    => $dok &&
                    $dok->akte_kelahiran &&
                    $dok->kartu_keluarga &&
                    $dok->pasfoto &&
                    $dok->ijazah,
                'seleksi'            => $p->seleksi ? [
                    'id_seleksi'       => $p->seleksi->id_seleksi,
                    'tanggal_seleksi'  => $p->seleksi->tanggal_seleksi?->format('Y-m-d'),
                    'tanggal_format'   => $p->seleksi->tanggal_seleksi?->translatedFormat('d M Y'),
                    'waktu_seleksi'    => $p->seleksi->waktu_seleksi,
                    'tempat_seleksi'   => $p->seleksi->tempat_seleksi,
                    'nilai_seleksi'    => $p->seleksi->nilai_seleksi,
                    'status_seleksi'   => $p->seleksi->status_seleksi,
                    'catatan'          => $p->seleksi->catatan,
                    'hasil_pengumuman' => $p->seleksi->pengumuman?->hasil_pendaftaran,
                ] : null,
            ];
        });

        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Memproses verifikasi berkas (approve dengan jadwal seleksi / reject dengan catatan manual).
     */
    public function berkasUpdate(Request $request, $id)
    {
        $request->validate([
            'status_pendaftaran' => 'required|in:terverifikasi,ditolak',
            'tanggal_seleksi'    => 'nullable|date',
            'waktu_seleksi'      => 'nullable|string|max:100',
            'tempat_seleksi'     => 'nullable|string|max:255',
            'catatan_seleksi'    => 'nullable|string|max:500',
            'catatan_verifikasi' => 'required_if:status_pendaftaran,ditolak|nullable|string|max:1000',
            'nilai_seleksi'      => 'nullable|numeric|min:0|max:100',
            'status_seleksi'     => 'nullable|in:diterima,tidak_diterima,menunggu',
            'catatan_kelulusan'  => 'nullable|string|max:500',
        ]);

        $pendaftaran = Pendaftaran::with(['calonSiswa.user', 'seleksi'])->findOrFail($id);

        if ($request->status_pendaftaran === 'terverifikasi') {
            // 1. Update status pendaftaran menjadi terverifikasi
            $pendaftaran->update([
                'status_pendaftaran' => 'terverifikasi',
                'catatan_verifikasi' => 'Berkas telah diverifikasi dan dinyatakan valid.',
            ]);

            // 2. Terbitkan / perbarui jadwal seleksi
            $tanggalSeleksi = $request->tanggal_seleksi
                ? Carbon::parse($request->tanggal_seleksi)->startOfDay()
                : now()->addDays(7)->startOfDay();

            $waktuSeleksi  = $request->waktu_seleksi ?: '08:00 - 10:00 WIB';
            $tempatSeleksi = $request->tempat_seleksi ?: 'Ruang CBT / Lab Komputer SMP Dharma Bakti';
            $catatan       = $request->catatan_seleksi ?: 'Harap hadir 30 menit sebelum jadwal, membawa kartu peserta pendaftaran dan seragam asal.';

            $seleksiData = [
                'tanggal_seleksi' => $tanggalSeleksi,
                'waktu_seleksi'   => $waktuSeleksi,
                'tempat_seleksi'  => $tempatSeleksi,
                'catatan'         => $catatan,
            ];

            // Jika admin langsung memberikan nilai & kelulusan
            if ($request->filled('nilai_seleksi') && $request->filled('status_seleksi') && in_array($request->status_seleksi, ['diterima', 'tidak_diterima'])) {
                $seleksiData['nilai_seleksi']  = $request->nilai_seleksi;
                $seleksiData['status_seleksi'] = $request->status_seleksi;
                if ($request->filled('catatan_kelulusan')) {
                    $seleksiData['catatan'] = $request->catatan_kelulusan;
                }
            } else {
                $seleksiData['status_seleksi'] = 'menunggu';
            }

            $seleksi = $pendaftaran->seleksi()->updateOrCreate(
                ['id_pendaftaran' => $pendaftaran->id_pendaftaran],
                $seleksiData
            );

            // Jika langsung dinilai dan lulus/tidak lulus, otomatis buat pengumuman kelulusan
            if ($request->filled('nilai_seleksi') && in_array($request->status_seleksi, ['diterima', 'tidak_diterima'])) {
                $seleksi->pengumuman()->updateOrCreate(
                    ['id_seleksi' => $seleksi->id_seleksi],
                    [
                        'hasil_pendaftaran'  => $request->status_seleksi === 'diterima' ? 'Diterima' : 'Tidak Diterima',
                        'tanggal_pengumuman' => now(),
                    ]
                );
            }

            // 3. Kirim notifikasi in-app ke siswa
            $userId = $pendaftaran->calonSiswa?->id_user;
            if ($userId) {
                $isGraded = $request->filled('nilai_seleksi') && in_array($request->status_seleksi, ['diterima', 'tidak_diterima']);
                \App\Models\Notifikasi::create([
                    'user_id' => $userId,
                    'judul'   => $isGraded ? 'Hasil Kelulusan SPMB Diterbitkan' : 'Berkas Terverifikasi & Jadwal Tes',
                    'pesan'   => $isGraded
                        ? "Selamat, nilai seleksi Anda telah dimasukkan ({$request->nilai_seleksi}) dengan status: " . ($request->status_seleksi === 'diterima' ? 'LULUS (Diterima)' : 'Tidak Diterima') . ". Silakan cek di menu Pengumuman."
                        : "Berkas Anda telah diverifikasi oleh panitia dan dinyatakan VALID. Jadwal tes seleksi telah terbit.",
                    'tipe'    => $isGraded && $request->status_seleksi === 'diterima' ? 'sukses' : 'info',
                ]);
            }

            // 4. Kirim notifikasi email jadwal seleksi ke calon siswa
            $userEmail = $pendaftaran->calonSiswa?->user?->email;
            if ($userEmail) {
                try {
                    Mail::to($userEmail)->send(new JadwalSeleksiMail($pendaftaran, $seleksi));
                } catch (\Exception $e) {
                    Log::warning('Gagal mengirim email jadwal seleksi: ' . $e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => $request->filled('nilai_seleksi')
                    ? 'Berkas berhasil diverifikasi dan nilai kelulusan telah diterbitkan kepada calon siswa.'
                    : 'Berkas berhasil diverifikasi dan jadwal tes seleksi telah diterbitkan kepada calon siswa.',
                'data'    => [
                    'status_pendaftaran' => 'terverifikasi',
                    'seleksi'            => [
                        'tanggal_seleksi' => $seleksi->tanggal_seleksi?->format('d M Y'),
                        'waktu_seleksi'   => $seleksi->waktu_seleksi,
                        'tempat_seleksi'  => $seleksi->tempat_seleksi,
                        'nilai_seleksi'   => $seleksi->nilai_seleksi,
                        'status_seleksi'  => $seleksi->status_seleksi,
                        'catatan'         => $seleksi->catatan,
                    ],
                ],
            ]);
        } else {
            // Kasus ditolak: Simpan keterangan catatan revisi dari admin
            $catatanVerifikasi = $request->catatan_verifikasi ?: 'Beberapa berkas belum sesuai ketentuan. Harap periksa dan unggah kembali berkas yang valid.';

            $pendaftaran->update([
                'status_pendaftaran' => 'ditolak',
                'catatan_verifikasi' => $catatanVerifikasi,
            ]);

            // Kirim notifikasi in-app penolakan & catatan revisi
            $userId = $pendaftaran->calonSiswa?->id_user;
            if ($userId) {
                \App\Models\Notifikasi::create([
                    'user_id' => $userId,
                    'judul'   => 'Berkas Memerlukan Perbaikan',
                    'pesan'   => "Panitia memberikan catatan revisi pada berkas Anda: {$catatanVerifikasi}. Silakan perbaiki dan unggah ulang.",
                    'tipe'    => 'peringatan',
                ]);
            }

            // Kirim notifikasi email keterangan revisi berkas ke calon siswa
            $userEmail = $pendaftaran->calonSiswa?->user?->email;
            if ($userEmail) {
                try {
                    Mail::to($userEmail)->send(new RevisiBerkasMail($pendaftaran, $catatanVerifikasi));
                } catch (\Exception $e) {
                    Log::warning('Gagal mengirim email revisi berkas: ' . $e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Berkas ditolak. Notifikasi dan keterangan perbaikan berkas telah dikirimkan kepada calon siswa.',
                'data'    => [
                    'status_pendaftaran' => 'ditolak',
                    'catatan_verifikasi' => $catatanVerifikasi,
                ],
            ]);
        }
    }

    /**
     * Menampilkan daftar pendaftar yang sudah terverifikasi untuk dinilai/diseleksi.
     */
    public function seleksiIndex(Request $request)
    {
        $pendaftarans = Pendaftaran::where('status_pendaftaran', 'terverifikasi')
            ->with(['calonSiswa', 'seleksi'])
            ->latest()
            ->paginate(20);

        $data = $pendaftarans->through(function ($p) {
            return [
                'id_pendaftaran'     => $p->id_pendaftaran,
                'nomor_pendaftaran'  => $p->nomor_pendaftaran,
                'asal_sekolah'       => $p->asal_sekolah,
                'calon_siswa'        => [
                    'nama_lengkap' => $p->calonSiswa?->nama_lengkap,
                    'nisn'         => $p->calonSiswa?->nisn,
                ],
                'seleksi'            => $p->seleksi ? [
                    'id_seleksi'      => $p->seleksi->id_seleksi,
                    'tanggal_seleksi' => $p->seleksi->tanggal_seleksi?->format('d M Y'),
                    'nilai_seleksi'   => $p->seleksi->nilai_seleksi,
                    'status_seleksi'  => $p->seleksi->status_seleksi,
                    'catatan'         => $p->seleksi->catatan,
                ] : null,
            ];
        });

        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * Memproses penilaian seleksi dan menentukan kelulusan.
     * Secara otomatis membuat/memperbarui record pengumuman.
     */
    public function seleksiUpdate(Request $request, $id)
    {
        $request->validate([
            'nilai_seleksi' => 'required|numeric|min:0|max:100',
            'status_seleksi'=> 'required|in:diterima,tidak_diterima',
            'catatan'       => 'nullable|string|max:500',
        ]);

        $pendaftaran = Pendaftaran::findOrFail($id);

        // Buat atau perbarui data seleksi
        $seleksi = $pendaftaran->seleksi()->updateOrCreate(
            ['id_pendaftaran' => $pendaftaran->id_pendaftaran],
            [
                'nilai_seleksi'  => $request->nilai_seleksi,
                'status_seleksi' => $request->status_seleksi,
                'catatan'        => $request->catatan,
            ]
        );

        // Otomatis buat/perbarui pengumuman
        $seleksi->pengumuman()->updateOrCreate(
            ['id_seleksi' => $seleksi->id_seleksi],
            [
                'hasil_pendaftaran'  => $request->status_seleksi === 'diterima' ? 'Diterima' : 'Tidak Diterima',
                'tanggal_pengumuman' => now(),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Hasil seleksi berhasil disimpan dan dipublikasikan.',
            'data'    => [
                'status_seleksi' => $seleksi->status_seleksi,
                'nilai_seleksi'  => $seleksi->nilai_seleksi,
            ],
        ]);
    }
}
