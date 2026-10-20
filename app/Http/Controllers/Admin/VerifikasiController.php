<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;

class VerifikasiController extends Controller
{
    /**
     * Menampilkan daftar pendaftar untuk verifikasi berkas.
     */
    public function berkasIndex()
    {
        // Tampilkan yang dokumennya sudah diupload atau sedang menunggu verifikasi
        $pendaftarans = Pendaftaran::whereIn('status_pendaftaran', ['menunggu_verifikasi', 'terverifikasi', 'ditolak'])
            ->with(['calonSiswa', 'dokumen'])
            ->latest()
            ->paginate(15);

        return view('admin.verifikasi-berkas.index', compact('pendaftarans'));
    }

    /**
     * Memproses verifikasi berkas.
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
        ]);

        $pendaftaran = Pendaftaran::with(['calonSiswa.user', 'seleksi'])->findOrFail($id);

        if ($request->status_pendaftaran === 'terverifikasi') {
            $pendaftaran->update([
                'status_pendaftaran' => 'terverifikasi',
                'catatan_verifikasi' => 'Berkas telah diverifikasi dan dinyatakan valid.',
            ]);

            $tanggalSeleksi = $request->tanggal_seleksi
                ? \Carbon\Carbon::parse($request->tanggal_seleksi)->startOfDay()
                : now()->addDays(7)->startOfDay();

            $waktuSeleksi  = $request->waktu_seleksi ?: '08:00 - 10:00 WIB';
            $tempatSeleksi = $request->tempat_seleksi ?: 'Ruang CBT / Lab Komputer SMP Dharma Bakti';
            $catatan       = $request->catatan_seleksi ?: 'Harap hadir 30 menit sebelum jadwal, membawa kartu peserta pendaftaran dan seragam asal.';

            $seleksi = $pendaftaran->seleksi()->updateOrCreate(
                ['id_pendaftaran' => $pendaftaran->id_pendaftaran],
                [
                    'status_seleksi'  => 'menunggu',
                    'tanggal_seleksi' => $tanggalSeleksi,
                    'waktu_seleksi'   => $waktuSeleksi,
                    'tempat_seleksi'  => $tempatSeleksi,
                    'catatan'         => $catatan,
                ]
            );

            // Kirim email jadwal tes seleksi ke calon siswa jika ada email
            $userEmail = $pendaftaran->calonSiswa?->user?->email;
            if ($userEmail) {
                try {
                    \Illuminate\Support\Facades\Mail::to($userEmail)->send(new \App\Mail\JadwalSeleksiMail($pendaftaran, $seleksi));
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::warning('Gagal kirim email jadwal seleksi web: ' . $e->getMessage());
                }
            }

            return back()->with('status', 'Berkas berhasil diverifikasi dan jadwal tes seleksi telah diterbitkan ke calon siswa.');
        } else {
            $catatanVerifikasi = $request->catatan_verifikasi ?: 'Beberapa berkas belum sesuai ketentuan. Harap periksa dan unggah kembali berkas yang valid.';

            $pendaftaran->update([
                'status_pendaftaran' => 'ditolak',
                'catatan_verifikasi' => $catatanVerifikasi,
            ]);

            // Kirim email pemberitahuan revisi berkas ke calon siswa
            $userEmail = $pendaftaran->calonSiswa?->user?->email;
            if ($userEmail) {
                try {
                    \Illuminate\Support\Facades\Mail::to($userEmail)->send(new \App\Mail\RevisiBerkasMail($pendaftaran, $catatanVerifikasi));
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::warning('Gagal kirim email revisi berkas web: ' . $e->getMessage());
                }
            }

            return back()->with('status', 'Berkas ditolak. Keterangan perbaikan berkas telah dikirimkan kepada calon siswa.');
        }
    }

    /**
     * Menampilkan daftar pendaftar untuk verifikasi seleksi.
     */
    public function seleksiIndex()
    {
        // Tampilkan hanya yang berkasnya sudah terverifikasi
        $pendaftarans = Pendaftaran::where('status_pendaftaran', 'terverifikasi')
            ->with(['calonSiswa', 'seleksi'])
            ->latest()
            ->paginate(15);

        return view('admin.verifikasi-seleksi.index', compact('pendaftarans'));
    }

    /**
     * Memproses penilaian seleksi dan kelulusan.
     */
    public function seleksiUpdate(Request $request, $id)
    {
        $request->validate([
            'nilai_seleksi' => 'required|numeric|min:0|max:100',
            'status_seleksi' => 'required|in:diterima,tidak_diterima',
            'catatan' => 'nullable|string'
        ]);

        $pendaftaran = Pendaftaran::findOrFail($id);
        
        $seleksi = $pendaftaran->seleksi()->first();
        if ($seleksi) {
            $seleksi->update([
                'nilai_seleksi' => $request->nilai_seleksi,
                'status_seleksi' => $request->status_seleksi,
                'catatan' => $request->catatan
            ]);
        } else {
            $seleksi = $pendaftaran->seleksi()->create([
                'nilai_seleksi' => $request->nilai_seleksi,
                'status_seleksi' => $request->status_seleksi,
                'catatan' => $request->catatan
            ]);
        }

        // Otomatis buat pengumuman setelah diseleksi
        $seleksi->pengumuman()->updateOrCreate(
            ['id_seleksi' => $seleksi->id_seleksi],
            [
                'hasil_pendaftaran' => $request->status_seleksi === 'diterima' ? 'Diterima' : 'Tidak Diterima',
                'tanggal_pengumuman' => now(),
            ]
        );

        return back()->with('status', 'Hasil seleksi berhasil disimpan dan dipublikasikan.');
    }
}
