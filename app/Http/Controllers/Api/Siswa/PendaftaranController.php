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
        // Validasi semua field formulir sesuai format resmi PPDB SMP Dharma Bakti
        $request->validate([
            'nama_lengkap'    => 'required|string|max:255',
            'tempat_lahir'    => 'required|string|max:100',
            'tanggal_lahir'   => 'required|date',
            'no_kk'           => 'nullable|string|max:20',
            'nik'             => 'nullable|string|max:20',
            'nisn'            => 'required|digits:10',
            'agama'           => 'required|string|max:50',
            'alamat'          => 'required|string',
            'nama_ayah'       => 'nullable|string|max:255',
            'pekerjaan_ayah'  => 'nullable|string|max:100',
            'alamat_ayah'     => 'nullable|string',
            'nama_ibu'        => 'nullable|string|max:255',
            'pekerjaan_ibu'   => 'nullable|string|max:100',
            'alamat_ibu'      => 'nullable|string',
            'asal_sekolah'    => 'required|string|max:255',
            'no_hp_ortu'      => 'required|string|max:25',
            'ukuran_pakaian'  => 'nullable|string|max:10',
            'jenis_kelamin'   => 'nullable|in:Laki-laki,Perempuan',
            'nama_ortu_wali'  => 'nullable|string|max:255',
        ]);

        $user       = $request->user();
        $calonSiswa = $user->calonSiswa;

        $namaOrtu = $request->nama_ortu_wali
            ?: ($request->nama_ayah ?: ($request->nama_ibu ?: '-'));

        // Perbarui data profil calon siswa
        $calonSiswa->update([
            'nama_lengkap'   => $request->nama_lengkap,
            'tempat_lahir'   => $request->tempat_lahir,
            'tanggal_lahir'  => $request->tanggal_lahir,
            'no_kk'          => $request->no_kk,
            'nik'            => $request->nik,
            'nisn'           => $request->nisn,
            'agama'          => $request->agama,
            'jenis_kelamin'  => $request->jenis_kelamin ?: ($calonSiswa->jenis_kelamin ?: 'Laki-laki'),
            'alamat'         => $request->alamat,
            'nama_ayah'      => $request->nama_ayah,
            'pekerjaan_ayah' => $request->pekerjaan_ayah,
            'alamat_ayah'    => $request->alamat_ayah,
            'nama_ibu'       => $request->nama_ibu,
            'pekerjaan_ibu'  => $request->pekerjaan_ibu,
            'alamat_ibu'     => $request->alamat_ibu,
            'nama_ortu_wali' => $namaOrtu,
            'no_hp_ortu'     => $request->no_hp_ortu,
            'ukuran_pakaian' => $request->ukuran_pakaian,
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
            'message' => 'Selamat, formulir Anda berhasil diunggah.',
            'data'    => [
                'calon_siswa'  => $calonSiswa->fresh(),
                'pendaftaran'  => $pendaftaran,
            ],
        ]);
    }
}
