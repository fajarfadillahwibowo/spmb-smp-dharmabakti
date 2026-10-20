<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;

/**
 * Controller API untuk pengelolaan formulir pendaftaran calon siswa.
 */
class PendaftaranController extends Controller
{
    /**
     * Menampilkan data formulir pendaftaran yang sudah ada (jika ada).
     */
    public function show(Request $request)
    {
        $user       = $request->user();
        $calonSiswa = $user->calonSiswa;

        if (!$calonSiswa) {
            return response()->json(['success' => false, 'message' => 'Data calon siswa tidak ditemukan.'], 404);
        }

        $calonSiswa->load('pendaftaran');

        return response()->json([
            'success' => true,
            'data'    => [
                'calon_siswa'  => $calonSiswa,
                'pendaftaran'  => $calonSiswa->pendaftaran,
            ],
        ]);
    }

    /**
     * Menyimpan atau memperbarui data formulir pendaftaran.
     * Jika pendaftaran belum ada, akan dibuat baru dengan nomor otomatis.
     */
    public function store(Request $request)
    {
        // Validasi semua field formulir
        $request->validate([
            'nama_lengkap'  => 'required|string|max:255',
            'nisn'          => 'required|digits:10',
            'tempat_lahir'  => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'alamat'        => 'required|string',
            'nama_ortu_wali'=> 'required|string|max:255',
            'no_hp_ortu'    => 'required|string|max:20',
            'asal_sekolah'  => 'required|string|max:255',
        ]);

        $user       = $request->user();
        $calonSiswa = $user->calonSiswa;

        // Perbarui data profil calon siswa
        $calonSiswa->update([
            'nama_lengkap'   => $request->nama_lengkap,
            'nisn'           => $request->nisn,
            'tempat_lahir'   => $request->tempat_lahir,
            'tanggal_lahir'  => $request->tanggal_lahir,
            'jenis_kelamin'  => $request->jenis_kelamin,
            'alamat'         => $request->alamat,
            'nama_ortu_wali' => $request->nama_ortu_wali,
            'no_hp_ortu'     => $request->no_hp_ortu,
        ]);

        // Buat pendaftaran baru jika belum ada
        if (!$calonSiswa->pendaftaran) {
            $tahun           = date('Y');
            $count           = Pendaftaran::whereYear('tanggal_daftar', $tahun)->count() + 1;
            $nomorPendaftaran = 'SPMB-' . $tahun . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            $pendaftaran = $calonSiswa->pendaftaran()->create([
                'nomor_pendaftaran'  => $nomorPendaftaran,
                'tanggal_daftar'     => now(),
                'asal_sekolah'       => $request->asal_sekolah,
                'status_pendaftaran' => 'belum_lengkap',
            ]);
        } else {
            // Jika sudah ada, update asal sekolah saja
            $pendaftaran = $calonSiswa->pendaftaran;
            $pendaftaran->update(['asal_sekolah' => $request->asal_sekolah]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data formulir pendaftaran berhasil disimpan.',
            'data'    => [
                'calon_siswa'  => $calonSiswa->fresh(),
                'pendaftaran'  => $pendaftaran,
            ],
        ]);
    }
}
