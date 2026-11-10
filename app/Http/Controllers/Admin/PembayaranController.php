<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\PengaturanPembayaran;
use Illuminate\Http\Request;

class PembayaranController extends Controller
{
    /**
     * Menampilkan daftar pembayaran yang perlu diverifikasi dan form pengaturan rekening.
     */
    public function index()
    {
        $pengaturan = PengaturanPembayaran::getPengaturan();

        // Tampilkan semua pembayaran yang sudah upload
        $pembayarans = Pembayaran::with(['pendaftaran.calonSiswa'])
            ->whereIn('status_pembayaran', ['menunggu', 'cicilan', 'lunas', 'ditolak'])
            ->latest('tanggal_upload')
            ->paginate(15);

        return view('admin.verifikasi-pembayaran.index', compact('pembayarans', 'pengaturan'));
    }

    /**
     * Memproses verifikasi status pembayaran calon siswa.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'status_pembayaran' => 'required|in:belum_bayar,menunggu,cicilan,lunas,ditolak',
            'catatan_admin'     => 'nullable|string|max:500'
        ]);

        $pembayaran = Pembayaran::findOrFail($id);
        
        $pembayaran->update([
            'status_pembayaran' => $request->status_pembayaran,
            'catatan_admin'     => $request->catatan_admin
        ]);

        return back()->with('status', 'Status pembayaran ' . ($pembayaran->pendaftaran?->calonSiswa?->nama_lengkap ?? '') . ' berhasil diperbarui menjadi ' . strtoupper($request->status_pembayaran) . '.');
    }

    /**
     * Menyimpan perubahan pengaturan rekening dan biaya transfer bank.
     */
    public function updatePengaturan(Request $request)
    {
        $request->validate([
            'nama_bank'      => 'required|string|max:100',
            'nomor_rekening' => 'required|string|max:100',
            'atas_nama'      => 'required|string|max:150',
            'jumlah_biaya'   => 'required|string|max:100',
            'keterangan'     => 'nullable|string|max:500',
        ]);

        $pengaturan = PengaturanPembayaran::getPengaturan();
        $pengaturan->update([
            'nama_bank'      => $request->nama_bank,
            'nomor_rekening' => $request->nomor_rekening,
            'atas_nama'      => $request->atas_nama,
            'jumlah_biaya'   => $request->jumlah_biaya,
            'keterangan'     => $request->keterangan,
        ]);

        return back()->with('status', 'Pengaturan rekening tujuan transfer dan biaya pendaftaran berhasil diperbarui.');
    }
}
