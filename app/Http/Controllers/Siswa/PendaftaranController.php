<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PendaftaranController extends Controller
{
    /**
     * Menampilkan formulir pendaftaran.
     */
    public function create()
    {
        $calonSiswa = Auth::user()->calonSiswa;
        $pendaftaran = $calonSiswa ? $calonSiswa->pendaftaran : null;

        return view('siswa.formulir-pendaftaran', compact('calonSiswa', 'pendaftaran'));
    }

    /**
     * Menyimpan data formulir pendaftaran.
     */
    public function store(Request $request)
    {
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

        $calonSiswa = Auth::user()->calonSiswa;

        $namaOrtu = $request->nama_ortu_wali
            ?: ($request->nama_ayah ?: ($request->nama_ibu ?: '-'));

        // Update profil calon siswa
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

        // Buat nomor pendaftaran otomatis (SPMB-YYYY-XXXX)
        if (!$calonSiswa->pendaftaran) {
            $tahun = date('Y');
            $count = Pendaftaran::whereYear('tanggal_daftar', $tahun)->count() + 1;
            $nomorPendaftaran = 'SPMB-' . $tahun . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            $calonSiswa->pendaftaran()->create([
                'nomor_pendaftaran' => $nomorPendaftaran,
                'tanggal_daftar' => now(),
                'asal_sekolah' => $request->asal_sekolah,
                'status_pendaftaran' => 'belum_lengkap',
            ]);
        } else {
            $calonSiswa->pendaftaran->update([
                'asal_sekolah' => $request->asal_sekolah,
            ]);
        }

        return redirect()->route('siswa.dokumen.create')
            ->with('status', 'Selamat! Formulir Anda berhasil diunggah. Silakan lengkapi dokumen persyaratan.');
    }
}
