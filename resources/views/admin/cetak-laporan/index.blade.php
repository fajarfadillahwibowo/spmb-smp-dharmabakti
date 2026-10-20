@extends('layouts.app')

@section('title', 'Cetak Laporan SPMB')

@section('content')
<div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 class="text-lg font-bold text-slate-800">Rekapitulasi Data Pendaftaran</h2>
            <p class="text-sm text-slate-500">Pratinjau data keseluruhan sebelum dicetak menjadi laporan PDF.</p>
        </div>
        <a href="{{ route('admin.laporan.pdf') }}" class="bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-primary/30 shrink-0">
            <i class="ph ph-file-pdf text-xl"></i> Download Laporan PDF
        </a>
    </div>

    <div class="p-6 bg-slate-50 border-b border-slate-100">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-xl border border-slate-200">
                <p class="text-xs text-slate-500 font-semibold uppercase">Total Pendaftar</p>
                <p class="text-2xl font-bold text-slate-800">{{ $pendaftarans->count() }}</p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-200">
                <p class="text-xs text-slate-500 font-semibold uppercase">Siswa Diterima</p>
                <p class="text-2xl font-bold text-green-600">
                    {{ $pendaftarans->filter(function($p) { return $p->seleksi && $p->seleksi->status_seleksi == 'diterima'; })->count() }}
                </p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-200">
                <p class="text-xs text-slate-500 font-semibold uppercase">Siswa Ditolak</p>
                <p class="text-2xl font-bold text-red-600">
                    {{ $pendaftarans->filter(function($p) { return $p->seleksi && $p->seleksi->status_seleksi == 'tidak_diterima'; })->count() }}
                </p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-200">
                <p class="text-xs text-slate-500 font-semibold uppercase">Pembayaran Lunas</p>
                <p class="text-2xl font-bold text-primary">
                    {{ $pendaftarans->filter(function($p) { return $p->pembayaran && $p->pembayaran->status_pembayaran == 'lunas'; })->count() }}
                </p>
            </div>
        </div>
    </div>

    <div class="overflow-x-auto p-6">
        <table class="w-full text-left border-collapse text-sm">
            <thead>
                <tr class="bg-slate-800 text-white">
                    <th class="px-4 py-3 font-medium rounded-tl-lg">No</th>
                    <th class="px-4 py-3 font-medium">No Pendaftaran</th>
                    <th class="px-4 py-3 font-medium">Nama Calon Siswa</th>
                    <th class="px-4 py-3 font-medium">Asal Sekolah</th>
                    <th class="px-4 py-3 font-medium">Status Berkas</th>
                    <th class="px-4 py-3 font-medium">Nilai / Kelulusan</th>
                    <th class="px-4 py-3 font-medium rounded-tr-lg">Daftar Ulang</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 border border-t-0 border-slate-200 rounded-b-lg">
                @forelse($pendaftarans as $index => $p)
                <tr class="hover:bg-slate-50">
                    <td class="px-4 py-3 text-center">{{ $index + 1 }}</td>
                    <td class="px-4 py-3 font-medium">{{ $p->nomor_pendaftaran }}</td>
                    <td class="px-4 py-3">{{ $p->calonSiswa->nama_lengkap }}</td>
                    <td class="px-4 py-3">{{ $p->asal_sekolah ?? '-' }}</td>
                    <td class="px-4 py-3 text-xs">
                        @if($p->status_pendaftaran == 'terverifikasi')
                            <span class="text-green-600 font-medium">Terverifikasi</span>
                        @elseif($p->status_pendaftaran == 'menunggu_verifikasi')
                            <span class="text-amber-600 font-medium">Menunggu Verif</span>
                        @else
                            <span class="text-slate-600 font-medium capitalize">{{ str_replace('_', ' ', $p->status_pendaftaran) }}</span>
                        @endif
                    </td>
                    <td class="px-4 py-3 text-xs">
                        @if($p->seleksi && $p->seleksi->status_seleksi == 'diterima')
                            <div class="text-green-600 font-bold">Lulus ({{ $p->seleksi->nilai_seleksi }})</div>
                        @elseif($p->seleksi && $p->seleksi->status_seleksi == 'tidak_diterima')
                            <div class="text-red-600 font-bold">Tidak Lulus</div>
                        @else
                            <div class="text-slate-500">Belum Dinilai</div>
                        @endif
                    </td>
                    <td class="px-4 py-3 text-xs">
                        @if($p->pembayaran)
                            @if($p->pembayaran->status_pembayaran == 'lunas')
                                <span class="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Lunas</span>
                            @elseif($p->pembayaran->status_pembayaran == 'cicilan')
                                <span class="bg-amber-100 text-amber-700 px-2 py-1 rounded font-medium">Cicilan</span>
                            @else
                                <span class="bg-slate-100 text-slate-700 px-2 py-1 rounded font-medium capitalize">{{ str_replace('_', ' ', $p->pembayaran->status_pembayaran) }}</span>
                            @endif
                        @else
                            <span class="text-slate-400">Belum</span>
                        @endif
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" class="px-4 py-8 text-center text-slate-500">
                        Tidak ada data pendaftar.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
