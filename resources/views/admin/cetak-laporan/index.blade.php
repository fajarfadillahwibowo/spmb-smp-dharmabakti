@extends('layouts.app')

@section('title', 'Cetak Laporan SPMB')

@section('content')
<div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 class="text-lg font-bold text-slate-800">Rekapitulasi Data Diri Calon Peserta Didik Baru (Buku Induk)</h2>
            <p class="text-sm text-slate-500">Pratinjau data lengkap siswa sebelum diunduh menjadi berkas laporan PDF resmi.</p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
            <a href="{{ route('admin.laporan.preview') }}" target="_blank" class="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
                <i class="ph ph-eye text-lg"></i> Pratinjau PDF
            </a>
            <a href="{{ route('admin.laporan.pdf') }}" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20">
                <i class="ph ph-file-pdf text-xl"></i> Unduh Laporan PDF
            </a>
        </div>
    </div>

    <div class="p-6 bg-slate-50 border-b border-slate-100">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-xl border border-slate-200">
                <p class="text-xs text-slate-500 font-semibold uppercase">Total Pendaftar</p>
                <p class="text-2xl font-bold text-slate-800">{{ $pendaftarans->count() }}</p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-200">
                <p class="text-xs text-slate-500 font-semibold uppercase">Siswa Diterima / Lulus</p>
                <p class="text-2xl font-bold text-emerald-600">
                    {{ $pendaftarans->filter(function($p) { return $p->seleksi && $p->seleksi->status_seleksi == 'diterima'; })->count() }}
                </p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-200">
                <p class="text-xs text-slate-500 font-semibold uppercase">Siswa Tidak Lulus</p>
                <p class="text-2xl font-bold text-red-600">
                    {{ $pendaftarans->filter(function($p) { return $p->seleksi && $p->seleksi->status_seleksi == 'tidak_diterima'; })->count() }}
                </p>
            </div>
            <div class="bg-white p-4 rounded-xl border border-slate-200">
                <p class="text-xs text-slate-500 font-semibold uppercase">Pembayaran Lunas</p>
                <p class="text-2xl font-bold text-blue-600">
                    {{ $pendaftarans->filter(function($p) { return $p->pembayaran && $p->pembayaran->status_pembayaran == 'lunas'; })->count() }}
                </p>
            </div>
        </div>
    </div>

    <div class="overflow-x-auto p-6">
        <table class="w-full text-left border-collapse text-xs">
            <thead>
                <tr class="bg-slate-800 text-white">
                    <th class="px-3 py-3 font-medium text-center rounded-tl-lg">No</th>
                    <th class="px-3 py-3 font-medium">No. Daftar</th>
                    <th class="px-3 py-3 font-medium">NISN</th>
                    <th class="px-3 py-3 font-medium">NIK</th>
                    <th class="px-4 py-3 font-medium">Nama Calon Siswa</th>
                    <th class="px-2 py-3 font-medium text-center">JK</th>
                    <th class="px-3 py-3 font-medium">Tempat, Tgl Lahir</th>
                    <th class="px-3 py-3 font-medium">Asal Sekolah</th>
                    <th class="px-3 py-3 font-medium">Orang Tua</th>
                    <th class="px-3 py-3 font-medium text-center">No. HP / WA</th>
                    <th class="px-3 py-3 font-medium text-center">Nilai Seleksi</th>
                    <th class="px-3 py-3 font-medium text-center rounded-tr-lg">Daftar Ulang</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 border border-t-0 border-slate-200 rounded-b-lg">
                @forelse($pendaftarans as $index => $p)
                @php
                    $cs = $p->calonSiswa;
                    $jk = ($cs?->jenis_kelamin === 'Perempuan' || $cs?->jenis_kelamin === 'PR') ? 'PR' : 'LK';
                    $ttl = ($cs?->tempat_lahir ?: '-') . ($cs?->tanggal_lahir ? ', ' . \Carbon\Carbon::parse($cs->tanggal_lahir)->format('d/m/Y') : '');
                    $ayah = $cs?->nama_ayah ? 'A: ' . $cs->nama_ayah : '';
                    $ibu = $cs?->nama_ibu ? 'I: ' . $cs->nama_ibu : '';
                    $ortu = trim("$ayah $ibu") ?: '-';
                @endphp
                <tr class="hover:bg-slate-50">
                    <td class="px-3 py-3 text-center font-medium">{{ $index + 1 }}</td>
                    <td class="px-3 py-3 font-bold text-blue-700">{{ $p->nomor_pendaftaran }}</td>
                    <td class="px-3 py-3">{{ $cs?->nisn ?? '-' }}</td>
                    <td class="px-3 py-3">{{ $cs?->nik ?? '-' }}</td>
                    <td class="px-4 py-3 font-bold text-slate-800">{{ strtoupper($cs?->nama_lengkap ?? '-') }}</td>
                    <td class="px-2 py-3 text-center font-semibold">{{ $jk }}</td>
                    <td class="px-3 py-3">{{ $ttl }}</td>
                    <td class="px-3 py-3">{{ strtoupper($p->asal_sekolah ?? '-') }}</td>
                    <td class="px-3 py-3 text-slate-600">{{ $ortu }}</td>
                    <td class="px-3 py-3 text-center">{{ $cs?->no_hp_ortu ?? '-' }}</td>
                    <td class="px-3 py-3 text-center">
                        @if($p->seleksi && $p->seleksi->status_seleksi == 'diterima')
                            <span class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Lulus ({{ $p->seleksi->nilai_seleksi }})</span>
                        @elseif($p->seleksi && $p->seleksi->status_seleksi == 'tidak_diterima')
                            <span class="bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">Tidak Lulus</span>
                        @else
                            <span class="text-slate-400">Belum</span>
                        @endif
                    </td>
                    <td class="px-3 py-3 text-center">
                        @if($p->pembayaran && $p->pembayaran->status_pembayaran == 'lunas')
                            <span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Lunas</span>
                        @elseif($p->pembayaran && $p->pembayaran->status_pembayaran == 'cicilan')
                            <span class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Cicilan</span>
                        @else
                            <span class="text-slate-400">Belum</span>
                        @endif
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="12" class="px-4 py-8 text-center text-slate-500">
                        Tidak ada data pendaftar.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
