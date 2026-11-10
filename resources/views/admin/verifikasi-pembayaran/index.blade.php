@extends('layouts.app')

@section('title', 'Verifikasi & Kendali Pembayaran')

@section('content')
<div class="space-y-8">

    @if(session('status'))
    <div class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3">
        <i class="ph ph-check-circle text-2xl text-emerald-600"></i>
        <span class="font-medium text-sm">{{ session('status') }}</span>
    </div>
    @endif

    <!-- ══════════════════════════════════════════════════════════
         KARTU KENDALI PENGATURAN REKENING & BIAYA (ADMIN)
    ══════════════════════════════════════════════════════════ -->
    <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-2xl">
                    <i class="ph ph-bank"></i>
                </div>
                <div>
                    <h2 class="text-lg font-bold text-slate-800">Pengaturan Rekening Transfer & Biaya</h2>
                    <p class="text-sm text-slate-500">Tentukan nama bank, nomor rekening tujuan, dan nominal biaya pendaftaran yang tampil di aplikasi siswa.</p>
                </div>
            </div>
            <div class="text-xs px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full font-semibold flex items-center gap-1.5">
                <i class="ph ph-shield-check"></i> Kendali Penuh Admin
            </div>
        </div>

        <form action="{{ route('admin.pembayaran.pengaturan') }}" method="POST" class="p-6">
            @csrf
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
                <!-- Nama Bank -->
                <div>
                    <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Nama Bank
                    </label>
                    <div class="relative">
                        <input type="text" name="nama_bank" value="{{ old('nama_bank', $pengaturan->nama_bank ?? 'BANK BNI') }}" required
                               placeholder="Contoh: BANK BNI / BANK BRI"
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold text-slate-800 transition-all">
                    </div>
                </div>

                <!-- Nomor Rekening -->
                <div>
                    <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Nomor Rekening / Virtual Account
                    </label>
                    <div class="relative">
                        <input type="text" name="nomor_rekening" value="{{ old('nomor_rekening', $pengaturan->nomor_rekening ?? '1234 5678 9012') }}" required
                               placeholder="Contoh: 1234 5678 9012"
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-mono font-bold text-slate-800 tracking-wider transition-all">
                    </div>
                </div>

                <!-- Atas Nama Penerima -->
                <div>
                    <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Atas Nama Penerima (Pemilik)
                    </label>
                    <div class="relative">
                        <input type="text" name="atas_nama" value="{{ old('atas_nama', $pengaturan->atas_nama ?? 'SMP DHARMA BAKTI') }}" required
                               placeholder="Contoh: SMP DHARMA BAKTI"
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold text-slate-800 transition-all">
                    </div>
                </div>

                <!-- Total Biaya Pendaftaran -->
                <div>
                    <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Total Biaya Pendaftaran
                    </label>
                    <div class="relative">
                        <input type="text" name="jumlah_biaya" value="{{ old('jumlah_biaya', $pengaturan->jumlah_biaya ?? 'Rp 1.500.000') }}" required
                               placeholder="Contoh: Rp 1.500.000"
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-emerald-600 transition-all">
                    </div>
                </div>
            </div>

            <!-- Keterangan Tambahan -->
            <div class="mb-5">
                <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Keterangan / Catatan untuk Siswa (Opsional)
                </label>
                <input type="text" name="keterangan" value="{{ old('keterangan', $pengaturan->keterangan ?? 'Biaya Pendaftaran SPMB Tahun Ajaran 2025/2026') }}"
                       placeholder="Catatan tambahan petunjuk transfer..."
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-slate-700 transition-all">
            </div>

            <div class="flex justify-end">
                <button type="submit" class="bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-primary/20 flex items-center gap-2">
                    <i class="ph ph-floppy-disk text-lg"></i> Simpan Pengaturan Rekening
                </button>
            </div>
        </form>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         TABEL VERIFIKASI PEMBAYARAN SISWA (ADMIN)
    ══════════════════════════════════════════════════════════ -->
    <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 class="text-lg font-bold text-slate-800">Daftar Bukti Pembayaran Masuk</h2>
                <p class="text-sm text-slate-500">Periksa dan tentukan apakah pembayaran calon murid valid (Lunas/Cicilan) atau belum sesuai (Ditolak).</p>
            </div>
            <div class="text-xs text-slate-500">
                Total data: <span class="font-bold text-slate-800">{{ $pembayarans->total() }}</span> siswa
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-y border-slate-100">
                        <th class="px-6 py-4 font-bold">Calon Siswa</th>
                        <th class="px-6 py-4 font-bold">Waktu Upload</th>
                        <th class="px-6 py-4 font-bold text-center">Bukti Transfer</th>
                        <th class="px-6 py-4 font-bold text-center">Status Saat Ini</th>
                        <th class="px-6 py-4 font-bold text-center">Konfirmasi & Catatan Admin</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                    @forelse($pembayarans as $p)
                    <tr class="hover:bg-slate-50/50 transition-colors">
                        <td class="px-6 py-4 align-top">
                            <div class="font-bold text-slate-900">{{ $p->pendaftaran?->calonSiswa?->nama_lengkap ?? 'Tanpa Nama' }}</div>
                            <div class="text-xs text-primary font-mono font-medium mt-0.5">{{ $p->pendaftaran?->nomor_pendaftaran ?? '-' }}</div>
                            <div class="text-xs text-slate-500 mt-1">NISN: {{ $p->pendaftaran?->calonSiswa?->nisn ?? '-' }}</div>
                        </td>
                        <td class="px-6 py-4 align-top text-sm">
                            <span class="inline-flex items-center gap-1.5 text-slate-600">
                                <i class="ph ph-calendar"></i> {{ $p->tanggal_upload?->format('d M Y') ?? '-' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 align-top text-center">
                            @if($p->bukti_pembayaran)
                                <div class="flex flex-col items-center gap-1.5">
                                    <a href="{{ Storage::url($p->bukti_pembayaran) }}" target="_blank" class="relative group block w-14 h-14 rounded-lg overflow-hidden border border-slate-300 shadow-sm bg-slate-900">
                                        <img src="{{ Storage::url($p->bukti_pembayaran) }}" alt="Struk" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                            <i class="ph ph-arrows-out text-sm"></i>
                                        </div>
                                    </a>
                                    <a href="{{ Storage::url($p->bukti_pembayaran) }}" target="_blank"
                                       class="inline-flex items-center gap-1 text-primary hover:text-primaryHover text-xs font-bold">
                                        <i class="ph ph-eye text-sm"></i> Perbesar
                                    </a>
                                </div>
                            @else
                                <span class="text-xs text-red-500 font-semibold bg-red-50 px-2 py-1 rounded">Belum Upload</span>
                            @endif
                        </td>
                        <td class="px-6 py-4 align-top text-center">
                            @if($p->status_pembayaran === 'lunas')
                                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    <i class="ph ph-check-circle"></i> LUNAS
                                </span>
                            @elseif($p->status_pembayaran === 'cicilan')
                                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                    <i class="ph ph-hourglass-medium"></i> DICICIL
                                </span>
                            @elseif($p->status_pembayaran === 'ditolak')
                                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                                    <i class="ph ph-x-circle"></i> DITOLAK
                                </span>
                            @elseif($p->status_pembayaran === 'menunggu')
                                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                    <i class="ph ph-clock"></i> MENUNGGU
                                </span>
                            @else
                                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                    {{ strtoupper($p->status_pembayaran ?? 'BELUM BAYAR') }}
                                </span>
                            @endif
                        </td>
                        <td class="px-6 py-4 align-top">
                            <form method="POST" action="{{ route('admin.pembayaran.update', $p->id_pembayaran) }}" class="flex flex-col gap-2 max-w-sm mx-auto">
                                @csrf
                                @method('PUT')
                                
                                <select name="status_pembayaran" class="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-primary bg-white shadow-sm">
                                    <option value="lunas" {{ $p->status_pembayaran == 'lunas' ? 'selected' : '' }}>✅ Valid - Lunas</option>
                                    <option value="cicilan" {{ $p->status_pembayaran == 'cicilan' ? 'selected' : '' }}>⏳ Valid - Dicicil (Sebagian)</option>
                                    <option value="ditolak" {{ $p->status_pembayaran == 'ditolak' ? 'selected' : '' }}>❌ Belum Sesuai / Ditolak</option>
                                    <option value="menunggu" {{ $p->status_pembayaran == 'menunggu' ? 'selected' : '' }}>🕒 Menunggu Verifikasi</option>
                                </select>
                                
                                <input type="text" name="catatan_admin" placeholder="Catatan ke siswa (cth: Bukti valid / Kurang Rp500rb)"
                                       value="{{ $p->catatan_admin }}"
                                       class="text-xs px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm">
                                
                                <button type="submit" class="bg-primary hover:bg-primaryHover text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5">
                                    <i class="ph ph-check-square"></i> Simpan Konfirmasi
                                </button>
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                            <i class="ph ph-wallet text-4xl text-slate-300 mb-2 block"></i>
                            Belum ada data pembayaran yang masuk untuk diverifikasi.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        @if($pembayarans->hasPages())
        <div class="p-6 border-t border-slate-100">
            {{ $pembayarans->links() }}
        </div>
        @endif
    </div>

</div>
@endsection
