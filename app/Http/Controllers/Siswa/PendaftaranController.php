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
            'nama_lengkap' => 'required|string|max:255',
            'nisn' => 'required|digits:10',
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'alamat' => 'required|string',
            'nama_ortu_wali' => 'required|string|max:255',
            'no_hp_ortu' => 'required|string|max:20',
            'asal_sekolah' => 'required|string|max:255',
        ]);

        $calonSiswa = Auth::user()->calonSiswa;

        // Update profil calon siswa
        $calonSiswa->update([
            'nama_lengkap' => $request->nama_lengkap,
            'nisn' => $request->nisn,
            'tempat_lahir' => $request->tempat_lahir,
            'tanggal_lahir' => $request->tanggal_lahir,
            'jenis_kelamin' => $request->jenis_kelamin,
            'alamat' => $request->alamat,
            'nama_ortu_wali' => $request->nama_ortu_wali,
            'no_hp_ortu' => $request->no_hp_ortu,
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
            ->with('status', 'Data formulir berhasil disimpan. Silakan unggah dokumen persyaratan.');
    }
}
