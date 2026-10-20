@extends('layouts.app')

@section('title', 'Dashboard Calon Siswa')

@section('content')
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <!-- Card Status -->
    <div class="anim-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div class="w-14 h-14 rounded-full flex items-center justify-center {{ $pendaftaran ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-400' }}">
            <i class="ph ph-article text-2xl"></i>
        </div>
        <div>
            <p class="text-sm text-slate-500 font-medium">Formulir</p>
            <p class="text-lg font-bold text-slate-800">
                {{ $pendaftaran ? 'Sudah Diisi' : 'Belum Diisi' }}
            </p>
        </div>
    </div>

    <!-- Card Dokumen -->
    <div class="anim-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        @php
            $dokLengkap = $pendaftaran && $pendaftaran->dokumen && 
                          $pendaftaran->dokumen->akte_kelahiran && 
                          $pendaftaran->dokumen->kartu_keluarga && 
                          $pendaftaran->dokumen->pasfoto && 
                          $pendaftaran->dokumen->ijazah;
        @endphp
        <div class="w-14 h-14 rounded-full flex items-center justify-center {{ $dokLengkap ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500' }}">
            <i class="ph ph-file-text text-2xl"></i>
        </div>
        <div>
            <p class="text-sm text-slate-500 font-medium">Dokumen</p>
            <p class="text-lg font-bold text-slate-800">
                {{ $dokLengkap ? 'Lengkap' : 'Belum Lengkap' }}
            </p>
        </div>
    </div>

    <!-- Card Status Pendaftaran -->
    <div class="anim-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        @php
            $statusColor = 'bg-slate-50 text-slate-500';
            $statusText = 'Belum Daftar';
            if ($pendaftaran) {
                switch($pendaftaran->status_pendaftaran) {
                    case 'belum_lengkap': $statusColor = 'bg-amber-50 text-amber-500'; $statusText = 'Belum Lengkap'; break;
                    case 'menunggu_verifikasi': $statusColor = 'bg-blue-50 text-blue-500'; $statusText = 'Menunggu Verif'; break;
                    case 'terverifikasi': $statusColor = 'bg-green-50 text-green-500'; $statusText = 'Terverifikasi'; break;
                    case 'ditolak': $statusColor = 'bg-red-50 text-red-500'; $statusText = 'Ditolak'; break;
                }
            }
        @endphp
        <div class="w-14 h-14 rounded-full flex items-center justify-center {{ $statusColor }}">
            <i class="ph ph-info text-2xl"></i>
        </div>
        <div>
            <p class="text-sm text-slate-500 font-medium">Status Berkas</p>
            <p class="text-lg font-bold text-slate-800">{{ $statusText }}</p>
        </div>
    </div>
</div>

<!-- Informasi Utama -->
<div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 class="text-lg font-bold text-slate-800">Informasi Pendaftaran</h2>
        @if($pendaftaran)
            <span class="px-3 py-1 bg-primary/10 text-primary font-semibold rounded-full text-sm">
                {{ $pendaftaran->nomor_pendaftaran }}
            </span>
        @endif
    </div>
    
    <div class="p-6">
        @if(!$pendaftaran)
            <div class="text-center py-8">
                <img src="https://ui-avatars.com/api/?name=SPMB&background=4f46e5&color=fff&rounded=true" alt="SPMB" class="w-20 h-20 mx-auto mb-4 opacity-50">
                <h3 class="text-lg font-medium text-slate-800 mb-2">Anda Belum Mengisi Formulir</h3>
                <p class="text-slate-500 mb-6 max-w-md mx-auto">Silakan lengkapi data diri Anda pada menu Formulir Pendaftaran untuk memulai proses seleksi.</p>
                <a href="{{ route('siswa.formulir.create') }}" class="inline-flex items-center gap-2 bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                    <i class="ph ph-article"></i> Isi Formulir Sekarang
                </a>
            </div>
        @else
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Data Calon Siswa</h3>
                    <ul class="space-y-3">
                        <li class="flex justify-between border-b border-slate-50 pb-2">
                            <span class="text-slate-500">Nama Lengkap</span>
                            <span class="font-medium text-slate-800">{{ $calonSiswa->nama_lengkap }}</span>
                        </li>
                        <li class="flex justify-between border-b border-slate-50 pb-2">
                            <span class="text-slate-500">NISN</span>
                            <span class="font-medium text-slate-800">{{ $calonSiswa->nisn ?? '-' }}</span>
                        </li>
                        <li class="flex justify-between border-b border-slate-50 pb-2">
                            <span class="text-slate-500">Asal Sekolah</span>
                            <span class="font-medium text-slate-800">{{ $pendaftaran->asal_sekolah }}</span>
                        </li>
                        <li class="flex justify-between border-b border-slate-50 pb-2">
                            <span class="text-slate-500">Tanggal Daftar</span>
                            <span class="font-medium text-slate-800">{{ $pendaftaran->tanggal_daftar->locale('id')->translatedFormat('d F Y') }}</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Progres Seleksi</h3>
                    
                    <div class="relative pl-8 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        <!-- Step 1 -->
                        <div class="relative">
                            <div class="absolute -left-[37px] top-1 w-6 h-6 rounded-full border-4 border-white bg-green-500 z-10"></div>
                            <h4 class="font-semibold text-slate-800">Pendaftaran</h4>
                            <p class="text-sm text-slate-500">Selesai mengisi formulir</p>
                        </div>
                        
                        <!-- Step 2 -->
                        <div class="relative">
                            @php $isStep2 = $dokLengkap; @endphp
                            <div class="absolute -left-[37px] top-1 w-6 h-6 rounded-full border-4 border-white {{ $isStep2 ? 'bg-green-500' : 'bg-slate-200' }} z-10"></div>
                            <h4 class="font-semibold {{ $isStep2 ? 'text-slate-800' : 'text-slate-400' }}">Upload Dokumen</h4>
                            <p class="text-sm {{ $isStep2 ? 'text-slate-500' : 'text-slate-400' }}">{{ $isStep2 ? 'Dokumen lengkap' : 'Menunggu upload dokumen' }}</p>
                        </div>

                        <!-- Step 3 -->
                        <div class="relative">
                            @php $isStep3 = $pendaftaran->status_pendaftaran === 'terverifikasi'; @endphp
                            <div class="absolute -left-[37px] top-1 w-6 h-6 rounded-full border-4 border-white {{ $isStep3 ? 'bg-green-500' : 'bg-slate-200' }} z-10"></div>
                            <h4 class="font-semibold {{ $isStep3 ? 'text-slate-800' : 'text-slate-400' }}">Verifikasi Berkas</h4>
                            <p class="text-sm {{ $isStep3 ? 'text-slate-500' : 'text-slate-400' }}">{{ $isStep3 ? 'Berkas disetujui' : 'Menunggu verifikasi admin' }}</p>
                        </div>

                        <!-- Step 4 -->
                        <div class="relative">
                            @php 
                                $isStep4 = $pendaftaran->seleksi && $pendaftaran->seleksi->status_seleksi !== 'menunggu'; 
                                $hasil = $isStep4 ? $pendaftaran->seleksi->status_seleksi : '';
                                $step4Color = $isStep4 ? ($hasil === 'diterima' ? 'bg-green-500' : 'bg-red-500') : 'bg-slate-200';
                            @endphp
                            <div class="absolute -left-[37px] top-1 w-6 h-6 rounded-full border-4 border-white {{ $step4Color }} z-10"></div>
                            <h4 class="font-semibold {{ $isStep4 ? 'text-slate-800' : 'text-slate-400' }}">Hasil Seleksi</h4>
                            <p class="text-sm {{ $isStep4 ? 'text-slate-500' : 'text-slate-400' }}">
                                @if($isStep4)
                                    {{ $hasil === 'diterima' ? 'Selamat, Anda Diterima!' : 'Maaf, Anda Tidak Diterima' }}
                                @else
                                    Menunggu proses seleksi
                                @endif
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        @endif
    </div>
</div>
@endsection
