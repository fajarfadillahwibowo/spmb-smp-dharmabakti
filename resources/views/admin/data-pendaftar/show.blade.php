@extends('layouts.app')

@section('title', 'Detail Pendaftar')

@section('content')
<div class="mb-4">
    <a href="{{ route('admin.pendaftar.index') }}" class="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
        <i class="ph ph-arrow-left"></i> Kembali ke Daftar
    </a>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Profil Card -->
    <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-1">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50 text-center">
            @if($pendaftaran->dokumen && $pendaftaran->dokumen->pasfoto)
                <img src="{{ Storage::url($pendaftaran->dokumen->pasfoto) }}" alt="Pasfoto" class="w-32 h-32 object-cover rounded-xl mx-auto mb-4 border-4 border-white shadow-sm">
            @else
                <div class="w-32 h-32 bg-slate-200 rounded-xl mx-auto mb-4 flex items-center justify-center text-slate-400 border-4 border-white shadow-sm">
                    <i class="ph ph-user text-5xl"></i>
                </div>
            @endif
            <h2 class="text-xl font-bold text-slate-800">{{ $pendaftaran->calonSiswa->nama_lengkap }}</h2>
            <p class="text-primary font-medium">{{ $pendaftaran->nomor_pendaftaran }}</p>
        </div>
        
        <div class="p-6 space-y-4">
            <div>
                <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status Pendaftaran</p>
                @if($pendaftaran->status_pendaftaran == 'belum_lengkap')
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Belum Lengkap</span>
                @elseif($pendaftaran->status_pendaftaran == 'menunggu_verifikasi')
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Menunggu Verifikasi</span>
                @elseif($pendaftaran->status_pendaftaran == 'terverifikasi')
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Terverifikasi</span>
                @else
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Ditolak</span>
                @endif
            </div>

            <div>
                <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Hasil Seleksi</p>
                @if(!$pendaftaran->seleksi || $pendaftaran->seleksi->status_seleksi == 'menunggu')
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Menunggu</span>
                @elseif($pendaftaran->seleksi->status_seleksi == 'diterima')
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Diterima (Nilai: {{ $pendaftaran->seleksi->nilai_seleksi }})</span>
                @else
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Tidak Diterima</span>
                @endif
            </div>

            <div>
                <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status Pembayaran</p>
                @if(!$pendaftaran->pembayaran || $pendaftaran->pembayaran->status_pembayaran == 'belum_bayar')
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Belum Bayar</span>
                @elseif($pendaftaran->pembayaran->status_pembayaran == 'menunggu')
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Menunggu Verifikasi</span>
                @elseif($pendaftaran->pembayaran->status_pembayaran == 'cicilan')
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Dicicil</span>
                @elseif($pendaftaran->pembayaran->status_pembayaran == 'lunas')
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Lunas</span>
                @endif
            </div>
        </div>
    </div>

    <!-- Data Detail -->
    <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-2">
        <div class="p-6 border-b border-slate-100 flex items-center gap-3">
            <i class="ph ph-identification-card text-2xl text-primary"></i>
            <h2 class="text-lg font-bold text-slate-800">Informasi Pribadi & Orang Tua</h2>
        </div>
        <div class="p-6">
            <table class="w-full text-sm">
                <tbody class="divide-y divide-slate-50">
                    <tr><td class="py-3 text-slate-500 w-1/3">NISN</td><td class="py-3 font-medium text-slate-800">{{ $pendaftaran->calonSiswa->nisn ?? '-' }}</td></tr>
                    <tr><td class="py-3 text-slate-500">Tempat, Tgl Lahir</td><td class="py-3 font-medium text-slate-800">{{ $pendaftaran->calonSiswa->tempat_lahir }}, {{ $pendaftaran->calonSiswa->tanggal_lahir?->format('d M Y') }}</td></tr>
                    <tr><td class="py-3 text-slate-500">Jenis Kelamin</td><td class="py-3 font-medium text-slate-800">{{ $pendaftaran->calonSiswa->jenis_kelamin }}</td></tr>
                    <tr><td class="py-3 text-slate-500">Asal Sekolah</td><td class="py-3 font-medium text-slate-800">{{ $pendaftaran->asal_sekolah }}</td></tr>
                    <tr><td class="py-3 text-slate-500">Alamat Lengkap</td><td class="py-3 font-medium text-slate-800">{{ $pendaftaran->calonSiswa->alamat }}</td></tr>
                    <tr><td class="py-3 text-slate-500">Nama Orang Tua / Wali</td><td class="py-3 font-medium text-slate-800">{{ $pendaftaran->calonSiswa->nama_ortu_wali }}</td></tr>
                    <tr><td class="py-3 text-slate-500">No. HP Orang Tua</td><td class="py-3 font-medium text-slate-800">{{ $pendaftaran->calonSiswa->no_hp_ortu }}</td></tr>
                    <tr><td class="py-3 text-slate-500">Email Akun</td><td class="py-3 font-medium text-slate-800">{{ $pendaftaran->calonSiswa->user->email }}</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Dokumen Persyaratan -->
    <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-3">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <i class="ph ph-folder-notch-open text-2xl text-primary"></i>
                <h2 class="text-lg font-bold text-slate-800">Dokumen Persyaratan Pendaftar</h2>
            </div>
            @if($pendaftaran->dokumen)
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    <i class="ph ph-check mr-1"></i> Data Dokumen Tersedia
                </span>
            @else
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                    Belum Mengunggah Dokumen
                </span>
            @endif
        </div>
        <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                @php
                    $docsList = [
                        ['label' => 'Pasfoto 3x4', 'field' => 'pasfoto', 'icon' => 'ph-image'],
                        ['label' => 'Akta Kelahiran', 'field' => 'akte_kelahiran', 'icon' => 'ph-certificate'],
                        ['label' => 'Kartu Keluarga', 'field' => 'kartu_keluarga', 'icon' => 'ph-users'],
                        ['label' => 'Ijazah / SKL', 'field' => 'ijazah', 'icon' => 'ph-file-text'],
                    ];
                @endphp

                @foreach($docsList as $doc)
                    @php
                        $filePath = $pendaftaran->dokumen ? $pendaftaran->dokumen->{$doc['field']} : null;
                    @endphp
                    <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center gap-2 mb-2">
                                <i class="ph {{ $doc['icon'] }} text-xl text-primary"></i>
                                <h3 class="font-bold text-sm text-slate-800">{{ $doc['label'] }}</h3>
                            </div>
                            <p class="text-xs text-slate-500 mb-4">
                                {{ $filePath ? 'File telah diunggah' : 'Belum diunggah' }}
                            </p>
                        </div>
                        @if($filePath)
                            <a href="{{ Storage::url($filePath) }}" target="_blank" class="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primaryHover transition-colors shadow-sm">
                                <i class="ph ph-eye"></i> Lihat Berkas
                            </a>
                        @else
                            <span class="inline-flex items-center justify-center w-full py-2 px-3 rounded-lg text-xs font-medium bg-slate-200 text-slate-500">
                                Tidak Tersedia
                            </span>
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
    </div>
</div>
@endsection
