@extends('layouts.app')

@section('title', 'Verifikasi Pembayaran')

@section('content')
<div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 class="text-lg font-bold text-slate-800">Verifikasi Bukti Pembayaran</h2>
            <p class="text-sm text-slate-500">Periksa bukti transfer daftar ulang siswa yang telah diterima.</p>
        </div>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-y border-slate-100">
                    <th class="px-6 py-4 font-medium">Siswa</th>
                    <th class="px-6 py-4 font-medium">Waktu Upload</th>
                    <th class="px-6 py-4 font-medium text-center">Bukti Transfer</th>
                    <th class="px-6 py-4 font-medium text-center">Status / Aksi</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
                @forelse($pembayarans as $p)
                <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4 align-top">
                        <div class="font-bold text-slate-800">{{ $p->pendaftaran->calonSiswa->nama_lengkap }}</div>
                        <div class="text-xs text-primary font-medium">{{ $p->pendaftaran->nomor_pendaftaran }}</div>
                    </td>
                    <td class="px-6 py-4 align-top text-sm">
                        {{ $p->tanggal_upload?->format('d M Y') ?? '-' }}
                    </td>
                    <td class="px-6 py-4 align-top text-center">
                        @if($p->bukti_pembayaran)
                            <a href="{{ Storage::url($p->bukti_pembayaran) }}" target="_blank" class="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded text-sm transition-colors font-medium">
                                <i class="ph ph-eye"></i> Lihat Bukti
                            </a>
                        @else
                            <span class="text-xs text-red-500">Belum Upload</span>
                        @endif
                    </td>
                    <td class="px-6 py-4">
                        <form method="POST" action="{{ route('admin.pembayaran.update', $p->id_pembayaran) }}" class="flex flex-col gap-2 max-w-xs mx-auto">
                            @csrf
                            @method('PUT')
                            
                            <select name="status_pembayaran" class="text-sm px-3 py-2 rounded border border-slate-200 outline-none focus:border-primary">
                                <option value="menunggu" {{ $p->status_pembayaran == 'menunggu' ? 'selected' : '' }}>Menunggu Verifikasi</option>
                                <option value="cicilan" {{ $p->status_pembayaran == 'cicilan' ? 'selected' : '' }}>Dicicil (Sebagian)</option>
                                <option value="lunas" {{ $p->status_pembayaran == 'lunas' ? 'selected' : '' }}>Lunas</option>
                                <option value="belum_bayar" {{ $p->status_pembayaran == 'belum_bayar' ? 'selected' : '' }}>Tolak / Belum Valid</option>
                            </select>
                            
                            <input type="text" name="catatan_admin" placeholder="Catatan (opsional)" value="{{ $p->catatan_admin }}"
                                   class="text-sm px-3 py-2 rounded border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                            
                            <button type="submit" class="bg-primary hover:bg-primaryHover text-white px-3 py-2 rounded-lg text-sm transition-colors font-medium">
                                Update Status
                            </button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" class="px-6 py-8 text-center text-slate-500">
                        Belum ada data pembayaran yang perlu diverifikasi.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    
    <div class="p-6 border-t border-slate-100">
        {{ $pembayarans->links() }}
    </div>
</div>
@endsection
