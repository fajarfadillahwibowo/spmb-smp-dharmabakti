@extends('layouts.app')

@section('title', 'Kelola Data Pendaftar')

@section('content')
<div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <form method="GET" action="{{ route('admin.pendaftar.index') }}" class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div class="relative">
                <i class="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari nama atau No. Pendaftaran" 
                       class="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none w-full sm:w-64">
            </div>
            <select name="status" class="px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-600">
                <option value="">Semua Status Berkas</option>
                <option value="belum_lengkap" {{ request('status') == 'belum_lengkap' ? 'selected' : '' }}>Belum Lengkap</option>
                <option value="menunggu_verifikasi" {{ request('status') == 'menunggu_verifikasi' ? 'selected' : '' }}>Menunggu Verifikasi</option>
                <option value="terverifikasi" {{ request('status') == 'terverifikasi' ? 'selected' : '' }}>Terverifikasi</option>
                <option value="ditolak" {{ request('status') == 'ditolak' ? 'selected' : '' }}>Ditolak</option>
            </select>
            <button type="submit" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Filter
            </button>
            @if(request('search') || request('status'))
                <a href="{{ route('admin.pendaftar.index') }}" class="flex items-center justify-center text-red-500 hover:text-red-700 px-3">
                    <i class="ph ph-x-circle text-xl"></i>
                </a>
            @endif
        </form>

        <a href="{{ route('admin.pendaftar.export', ['status' => request('status')]) }}" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shrink-0">
            <i class="ph ph-microsoft-excel-logo text-xl"></i> Export Excel
        </a>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                    <th class="px-6 py-4 font-medium">No. Pendaftaran</th>
                    <th class="px-6 py-4 font-medium">Nama / Asal Sekolah</th>
                    <th class="px-6 py-4 font-medium">Tanggal Daftar</th>
                    <th class="px-6 py-4 font-medium">Status Berkas</th>
                    <th class="px-6 py-4 font-medium text-center">Aksi</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
                @forelse($pendaftarans as $p)
                <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4 font-medium text-slate-800">{{ $p->nomor_pendaftaran }}</td>
                    <td class="px-6 py-4">
                        <div class="font-semibold">{{ $p->calonSiswa->nama_lengkap }}</div>
                        <div class="text-xs text-slate-500">{{ $p->asal_sekolah ?? '-' }}</div>
                    </td>
                    <td class="px-6 py-4 text-sm">{{ $p->tanggal_daftar->format('d M Y') }}</td>
                    <td class="px-6 py-4">
                        @if($p->status_pendaftaran == 'belum_lengkap')
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Belum Lengkap</span>
                        @elseif($p->status_pendaftaran == 'menunggu_verifikasi')
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Menunggu Verif</span>
                        @elseif($p->status_pendaftaran == 'terverifikasi')
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Terverifikasi</span>
                        @else
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Ditolak</span>
                        @endif
                    </td>
                    <td class="px-6 py-4 text-center">
                        <a href="{{ route('admin.pendaftar.show', $p->id_pendaftaran) }}" class="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 px-3 py-1.5 rounded text-sm transition-colors shadow-sm">
                            <i class="ph ph-eye"></i> Detail
                        </a>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="px-6 py-8 text-center text-slate-500">
                        Tidak ada data pendaftar yang ditemukan.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    
    <div class="p-6 border-t border-slate-100">
        {{ $pendaftarans->links() }}
    </div>
</div>
@endsection
