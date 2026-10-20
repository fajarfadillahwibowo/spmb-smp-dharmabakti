<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PembayaranController extends Controller
{
    /**
     * Menampilkan form upload bukti pembayaran.
     */
    public function create()
    {
        $calonSiswa = Auth::user()->calonSiswa;
        $pendaftaran = $calonSiswa ? $calonSiswa->pendaftaran : null;
        $seleksi = $pendaftaran ? $pendaftaran->seleksi : null;

        // Hanya bisa akses jika sudah diterima
        if (!$seleksi || $seleksi->status_seleksi !== 'diterima') {
            return redirect()->route('siswa.dashboard')->with('error', 'Fitur pembayaran hanya untuk siswa yang telah diterima.');
        }

        $pembayaran = $pendaftaran->pembayaran;

        return view('siswa.pembayaran', compact('pendaftaran', 'pembayaran'));
    }

    /**
     * Menyimpan bukti pembayaran.
     */
    public function store(Request $request)
    {
        $calonSiswa = Auth::user()->calonSiswa;
        $pendaftaran = $calonSiswa->pendaftaran;
        
        $request->validate([
            'bukti_pembayaran' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $pembayaran = $pendaftaran->pembayaran()->firstOrCreate([]);

        if ($request->hasFile('bukti_pembayaran')) {
            // Hapus file lama jika ada
            if ($pembayaran->bukti_pembayaran && Storage::disk('public')->exists($pembayaran->bukti_pembayaran)) {
                Storage::disk('public')->delete($pembayaran->bukti_pembayaran);
            }

            $path = $request->file('bukti_pembayaran')->store('pembayaran/' . $pendaftaran->nomor_pendaftaran, 'public');
            
            $pembayaran->update([
                'bukti_pembayaran' => $path,
                'tanggal_upload' => now(),
                'status_pembayaran' => 'menunggu', // Ubah status jadi menunggu verifikasi
            ]);

            return back()->with('status', 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.');
        }

        return back()->with('error', 'Gagal mengunggah bukti pembayaran.');
    }
}
