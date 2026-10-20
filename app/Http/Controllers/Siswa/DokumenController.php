<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DokumenController extends Controller
{
    /**
     * Menampilkan form upload dokumen.
     */
    public function create()
    {
        $calonSiswa = Auth::user()->calonSiswa;
        $pendaftaran = $calonSiswa ? $calonSiswa->pendaftaran : null;

        if (!$pendaftaran) {
            return redirect()->route('siswa.formulir.create')->with('error', 'Silakan isi formulir pendaftaran terlebih dahulu.');
        }

        $dokumen = $pendaftaran->dokumen;

        return view('siswa.upload-dokumen', compact('pendaftaran', 'dokumen'));
    }

    /**
     * Menyimpan dokumen yang diunggah.
     */
    public function store(Request $request)
    {
        $calonSiswa = Auth::user()->calonSiswa;
        $pendaftaran = $calonSiswa->pendaftaran;

        if (!$pendaftaran) {
            return redirect()->route('siswa.formulir.create');
        }

        $request->validate([
            'akte_kelahiran' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'kartu_keluarga' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'pasfoto' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'ijazah' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $dokumen = $pendaftaran->dokumen()->firstOrCreate([]);
        $uploaded = false;

        $files = ['akte_kelahiran', 'kartu_keluarga', 'pasfoto', 'ijazah'];

        foreach ($files as $file) {
            if ($request->hasFile($file)) {
                // Hapus file lama jika ada
                if ($dokumen->$file && Storage::disk('public')->exists($dokumen->$file)) {
                    Storage::disk('public')->delete($dokumen->$file);
                }

                // Simpan file baru
                $path = $request->file($file)->store('dokumen/' . $pendaftaran->nomor_pendaftaran, 'public');
                $dokumen->$file = $path;
                $uploaded = true;
            }
        }

        if ($uploaded) {
            $dokumen->save();
            
            // Cek apakah semua dokumen sudah lengkap
            if ($dokumen->akte_kelahiran && $dokumen->kartu_keluarga && $dokumen->pasfoto && $dokumen->ijazah) {
                // Update status pendaftaran menjadi menunggu verifikasi jika belum terverifikasi
                if ($pendaftaran->status_pendaftaran === 'belum_lengkap') {
                    $pendaftaran->update(['status_pendaftaran' => 'menunggu_verifikasi']);
                }
            }

            return back()->with('status_berkas', 'Selamat, data dan berkas Anda sudah terekam di sistem! Mohon tunggu konfirmasi dan informasi selanjutnya.');
        }

        return back()->with('error', 'Tidak ada dokumen yang diunggah.');
    }
}
