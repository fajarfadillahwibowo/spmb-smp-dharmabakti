@extends('layouts.app')

@section('title', 'Kartu Peserta Ujian Seleksi')

@section('content')
<style>
    /* Modern 3D & Claymorphism Utilities */
    .card-3d {
        background: linear-gradient(145deg, #ffffff, #f1f5f9);
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-bottom: 4px solid #cbd5e1;
        box-shadow: 0 16px 32px -8px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.06);
        border-radius: 20px;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    }
    .card-hero-3d {
        background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
        border-bottom: 6px solid #1e3a8a;
        box-shadow: 0 20px 40px -10px rgba(37, 99, 235, 0.45);
        color: #ffffff;
        border-radius: 24px;
        position: relative;
        overflow: hidden;
    }
    .specular-shine {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 45%;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.02) 100%);
        pointer-events: none;
        border-radius: 24px 24px 0 0;
    }
    .btn-3d-primary {
        background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
        border-bottom: 4px solid #1e3a8a;
        color: #ffffff;
        font-weight: 700;
        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
        transition: all 0.15s ease;
        position: relative;
        overflow: hidden;
    }
    .btn-3d-primary:active {
        transform: translateY(2px);
        border-bottom-width: 2px;
        box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
    }
    .btn-3d-emerald {
        background: linear-gradient(180deg, #10b981 0%, #059669 100%);
        border-bottom: 4px solid #047857;
        color: #ffffff;
        font-weight: 700;
        box-shadow: 0 8px 20px rgba(16, 185, 129, 0.35);
        transition: all 0.15s ease;
        position: relative;
        overflow: hidden;
    }
    .btn-3d-emerald:active {
        transform: translateY(2px);
        border-bottom-width: 2px;
        box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25);
    }
    .badge-3d {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.05));
        border: 1px solid rgba(255, 255, 255, 0.4);
        border-bottom: 2px solid rgba(0, 0, 0, 0.15);
        border-radius: 9999px;
        backdrop-filter: blur(8px);
    }
    .orb-3d {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 30%, #60a5fa, #1d4ed8 70%, #1e3a8a 100%);
        box-shadow: 0 10px 20px rgba(30, 58, 138, 0.35), inset 0 -3px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    .orb-3d::after {
        content: '';
        position: absolute;
        top: 6px;
        left: 12px;
        width: 18px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.65);
        filter: blur(1px);
    }
    .clay-input-box {
        background: #f8fafc;
        border: 1.5px solid #e2e8f0;
        border-top: 2px solid #cbd5e1;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.04);
        border-radius: 12px;
    }
</style>

<div class="max-w-4xl mx-auto space-y-6 pb-24">
    
    <!-- Hero 3D Card Header -->
    <div class="card-hero-3d p-6 md:p-8">
        <div class="specular-shine"></div>
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div class="flex items-center gap-5">
                <div class="orb-3d shrink-0">
                    <i class="ph ph-identification-card text-3xl text-white"></i>
                </div>
                <div>
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 badge-3d text-xs font-semibold uppercase tracking-wider text-blue-100 mb-2">
                        <i class="ph ph-shield-check text-amber-300"></i> DOKUMEN RESMI SPMB
                    </div>
                    <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">Kartu Peserta Ujian Seleksi</h1>
                    <p class="text-blue-100 text-sm mt-1">SMP Dharma Bakti • Tahun Ajaran 2026/2027</p>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <a href="{{ route('siswa.seleksi.cetak-kartu') }}" target="_blank" class="btn-3d-emerald px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg text-center">
                    <i class="ph ph-download-simple text-xl"></i>
                    <span>UNDUH PDF RESMI</span>
                </a>
                <a href="{{ route('siswa.seleksi.cetak-kartu') }}?stream=1" target="_blank" class="btn-3d-primary px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg text-center">
                    <i class="ph ph-printer text-xl"></i>
                    <span>CETAK LANGSUNG</span>
                </a>
            </div>
        </div>
    </div>

    @if(!$pendaftaran)
        <div class="card-3d p-8 text-center bg-white">
            <div class="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="ph ph-warning-circle text-4xl"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-800">Formulir Belum Diisi</h2>
            <p class="text-slate-500 mt-2 max-w-md mx-auto">Silakan lengkapi formulir pendaftaran terlebih dahulu untuk menerbitkan kartu ujian.</p>
            <a href="{{ route('siswa.formulir.create') }}" class="btn-3d-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl mt-6">
                <span>Isi Formulir Sekarang</span>
                <i class="ph ph-arrow-right"></i>
            </a>
        </div>
    @else
        <!-- Holographic 3D Pass Preview Container -->
        <div class="card-3d p-6 md:p-8 bg-white border-2 border-blue-100">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 mb-6 border-b border-slate-100 gap-4">
                <div>
                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preview Kartu Digital</span>
                    <h3 class="text-xl font-bold text-slate-800 mt-1">Kartu Peserta Masuk CBT & Ujian Tertulis</h3>
                </div>
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-xs border border-blue-200">
                        {{ $pendaftaran->nomor_pendaftaran }}
                    </span>
                    <span class="px-3 py-1 bg-green-50 text-green-700 font-bold rounded-lg text-xs border border-green-200 flex items-center gap-1">
                        <i class="ph ph-check-circle"></i> SIAP CETAK
                    </span>
                </div>
            </div>

            <!-- Pass Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Col 1: Photo & QR -->
                <div class="flex flex-col items-center justify-center p-6 clay-input-box text-center">
                    <div class="w-32 h-40 bg-slate-200 rounded-xl overflow-hidden border-2 border-slate-300 shadow-inner flex items-center justify-center mb-3">
                        @if($pendaftaran->dokumen && $pendaftaran->dokumen->pasfoto && file_exists(storage_path('app/public/' . $pendaftaran->dokumen->pasfoto)))
                            <img src="{{ asset('storage/' . $pendaftaran->dokumen->pasfoto) }}" alt="Pasfoto" class="w-full h-full object-cover">
                        @else
                            <div class="text-slate-400 text-xs flex flex-col items-center justify-center p-3">
                                <i class="ph ph-user text-3xl mb-1 text-slate-300"></i>
                                <span>PAS FOTO</span>
                                <span>3 × 4 CM</span>
                            </div>
                        @endif
                    </div>
                    <p class="text-xs font-bold text-slate-700 uppercase">{{ $calonSiswa?->nama_lengkap ?? Auth::user()->name }}</p>
                    <p class="text-[11px] text-slate-400 mt-0.5">NISN: {{ $calonSiswa?->nisn ?? '—' }}</p>
                </div>

                <!-- Col 2: Biodata Table -->
                <div class="md:col-span-2 space-y-3">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="clay-input-box p-3.5">
                            <span class="text-[11px] font-semibold text-slate-400 uppercase block">Nomor Pendaftaran</span>
                            <span class="text-base font-extrabold text-blue-600 font-mono">{{ $pendaftaran->nomor_pendaftaran }}</span>
                        </div>
                        <div class="clay-input-box p-3.5">
                            <span class="text-[11px] font-semibold text-slate-400 uppercase block">Asal Sekolah SD/MI</span>
                            <span class="text-sm font-bold text-slate-700 truncate block">{{ $pendaftaran->asal_sekolah ?? '—' }}</span>
                        </div>
                        <div class="clay-input-box p-3.5">
                            <span class="text-[11px] font-semibold text-slate-400 uppercase block">Tempat, Tanggal Lahir</span>
                            <span class="text-sm font-bold text-slate-700 block">
                                {{ $calonSiswa?->tempat_lahir ?? 'Jakarta' }}, 
                                {{ $calonSiswa?->tanggal_lahir ? \Carbon\Carbon::parse($calonSiswa->tanggal_lahir)->locale('id')->translatedFormat('d F Y') : '—' }}
                            </span>
                        </div>
                        <div class="clay-input-box p-3.5">
                            <span class="text-[11px] font-semibold text-slate-400 uppercase block">Jenis Kelamin</span>
                            <span class="text-sm font-bold text-slate-700 block">
                                {{ in_array($calonSiswa?->jenis_kelamin, ['L', 'Laki-laki']) ? 'Laki-laki' : 'Perempuan' }}
                            </span>
                        </div>
                    </div>

                    <!-- Exam Schedule Box -->
                    <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-xl mt-3">
                        <div class="flex items-start gap-3">
                            <div class="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                                <i class="ph ph-calendar-check text-2xl"></i>
                            </div>
                            <div class="flex-1">
                                <div class="flex items-center justify-between">
                                    <h4 class="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">Jadwal Ujian Masuk</h4>
                                    <span class="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">TPA & CBT</span>
                                </div>
                                <p class="text-sm font-bold text-slate-800 mt-1">
                                    {{ $seleksi && $seleksi->tanggal_seleksi ? \Carbon\Carbon::parse($seleksi->tanggal_seleksi)->locale('id')->translatedFormat('l, d F Y') : 'Jadwal Reguler Gelombang SPMB' }}
                                </p>
                                <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
                                    <span>⏰ Waktu: <strong>{{ $seleksi->waktu_seleksi ?? '08.00 WIB - Selesai' }}</strong></span>
                                    <span>📍 Lokasi: <strong>{{ $seleksi->tempat_seleksi ?? 'Lab Komputer / Kampus SMP Dharma Bakti' }}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Banner -->
            <div class="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <i class="ph ph-info text-xl"></i>
                    </div>
                    <p class="text-xs text-slate-500 max-w-md">
                        Bawa cetakan fisik kartu ini bersama identitas dan alat tulis saat hadir ke ruang ujian.
                    </p>
                </div>
                <a href="{{ route('siswa.seleksi.cetak-kartu') }}" class="btn-3d-primary w-full sm:w-auto px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm text-center">
                    <i class="ph ph-file-pdf text-xl"></i>
                    <span>DOWNLOAD PDF KARTU UJIAN</span>
                </a>
            </div>
        </div>
    @endif

</div>
@endsection
