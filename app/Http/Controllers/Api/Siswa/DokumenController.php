<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Controller API untuk upload dokumen persyaratan calon siswa.
 * Mendukung upload: akte kelahiran, kartu keluarga, pasfoto, ijazah.
 */
class DokumenController extends Controller
{
    /**
     * Menampilkan status dokumen yang sudah diunggah.
     */
    public function show(Request $request)
    {
        $calonSiswa  = $request->user()->calonSiswa;
        $pendaftaran = $calonSiswa ? $calonSiswa->pendaftaran : null;

        // Pastikan pendaftaran sudah dibuat sebelum upload dokumen
        if (!$pendaftaran) {
            return response()->json([
                'success' => false,
                'message' => 'Harap isi formulir pendaftaran terlebih dahulu.',
            ], 422);
        }

        $dokumen = $pendaftaran->dokumen;

        // Buat URL lengkap untuk setiap dokumen yang sudah diupload
        $data = [
            'status_pendaftaran' => $pendaftaran->status_pendaftaran,
            'catatan_verifikasi' => $pendaftaran->catatan_verifikasi,
            'akte_kelahiran' => $dokumen?->akte_kelahiran ? Storage::url($dokumen->akte_kelahiran) : null,
            'kartu_keluarga' => $dokumen?->kartu_keluarga ? Storage::url($dokumen->kartu_keluarga) : null,
            'pasfoto'        => $dokumen?->pasfoto ? Storage::url($dokumen->pasfoto) : null,
            'ijazah'         => $dokumen?->ijazah ? Storage::url($dokumen->ijazah) : null,
            'semua_lengkap'  => $dokumen &&
                $dokumen->akte_kelahiran &&
                $dokumen->kartu_keluarga &&
                $dokumen->pasfoto &&
                $dokumen->ijazah,
        ];

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    /**
     * Upload satu atau lebih dokumen persyaratan.
     * Setiap field dokumen diproses secara individual.
     * Mendukung format: PDF, JPG, JPEG, PNG. Ukuran max: 2MB per file.
     */
    public function upload(Request $request)
    {
        // Validasi setiap file yang diunggah
        $request->validate([
            'akte_kelahiran' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'kartu_keluarga' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'pasfoto'        => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'ijazah'         => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $calonSiswa  = $request->user()->calonSiswa;
        $pendaftaran = $calonSiswa?->pendaftaran;

        if (!$pendaftaran) {
            return response()->json([
                'success' => false,
                'message' => 'Formulir pendaftaran belum diisi.',
            ], 422);
        }

        // Dapatkan atau buat record dokumen
        $dokumen  = $pendaftaran->dokumen()->firstOrCreate([]);
        $uploaded = [];

        // Proses setiap jenis dokumen
        $jenisFile = ['akte_kelahiran', 'kartu_keluarga', 'pasfoto', 'ijazah'];

        foreach ($jenisFile as $jenis) {
            if ($request->hasFile($jenis)) {
                // Hapus file lama jika sudah ada
                if ($dokumen->$jenis && Storage::disk('public')->exists($dokumen->$jenis)) {
                    Storage::disk('public')->delete($dokumen->$jenis);
                }

                // Simpan file baru ke storage
                $path         = $request->file($jenis)->store('dokumen/' . $pendaftaran->nomor_pendaftaran, 'public');
                $dokumen->$jenis = $path;
                $uploaded[]   = $jenis;
            }
        }

        if (empty($uploaded)) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada file yang diunggah.',
            ], 422);
        }

        $dokumen->save();

        // Perbarui status pendaftaran jika semua dokumen sudah lengkap
        $semuaLengkap = $dokumen->akte_kelahiran &&
            $dokumen->kartu_keluarga &&
            $dokumen->pasfoto &&
            $dokumen->ijazah;

        if ($semuaLengkap && in_array($pendaftaran->status_pendaftaran, ['belum_lengkap', 'ditolak'])) {
            $pendaftaran->update([
                'status_pendaftaran' => 'menunggu_verifikasi',
                'catatan_verifikasi' => 'Berkas revisi telah diunggah oleh calon siswa, menunggu verifikasi ulang oleh panitia.',
            ]);
        }

        return response()->json([
            'success'  => true,
            'message'  => 'Dokumen berhasil diunggah: ' . implode(', ', $uploaded),
            'data'     => [
                'dokumen_diupload'   => $uploaded,
                'semua_lengkap'      => $semuaLengkap,
                'status_pendaftaran' => $pendaftaran->fresh()->status_pendaftaran,
                'catatan_verifikasi' => $pendaftaran->fresh()->catatan_verifikasi,
            ],
        ]);
    }
}
