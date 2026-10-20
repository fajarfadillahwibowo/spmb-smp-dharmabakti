<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use Illuminate\Http\Request;

class PembayaranController extends Controller
{
    /**
     * Menampilkan daftar pembayaran yang perlu diverifikasi.
     */
    public function index()
    {
        // Tampilkan yang sudah upload pembayaran
        $pembayarans = Pembayaran::with(['pendaftaran.calonSiswa'])
            ->whereIn('status_pembayaran', ['menunggu', 'cicilan', 'lunas'])
            ->latest('tanggal_upload')
            ->paginate(15);

        return view('admin.verifikasi-pembayaran.index', compact('pembayarans'));
    }

    /**
     * Memproses verifikasi status pembayaran.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'status_pembayaran' => 'required|in:belum_bayar,menunggu,cicilan,lunas',
            'catatan_admin' => 'nullable|string'
        ]);

        $pembayaran = Pembayaran::findOrFail($id);
        
        $pembayaran->update([
            'status_pembayaran' => $request->status_pembayaran,
            'catatan_admin' => $request->catatan_admin
        ]);

        return back()->with('status', 'Status pembayaran berhasil diperbarui.');
    }
}
