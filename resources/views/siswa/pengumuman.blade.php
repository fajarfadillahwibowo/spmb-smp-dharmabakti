@extends('layouts.app')

@section('title', 'Pengumuman Hasil Seleksi')

@section('content')
@php
    $isLulus = ($pengumuman && $pengumuman->hasil_pendaftaran === 'Diterima') ||
               ($seleksi && ($seleksi->status_seleksi === 'diterima' || ($seleksi->nilai_seleksi !== null && $seleksi->status_seleksi !== 'tidak_diterima')));
    $isTidakLulus = ($pengumuman && $pengumuman->hasil_pendaftaran === 'Tidak Diterima') ||
                    ($seleksi && $seleksi->status_seleksi === 'tidak_diterima');
@endphp

<div class="max-w-4xl mx-auto">
    
    @if(!$pendaftaran || !$seleksi || (!$isLulus && !$isTidakLulus))
        <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-center py-16">
            <div class="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="ph ph-hourglass-medium text-4xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-slate-800 mb-2">Belum Ada Pengumuman</h2>
            <p class="text-slate-500 max-w-md mx-auto">Data Anda sedang dalam proses verifikasi dan seleksi oleh panitia. Silakan cek kembali halaman ini secara berkala.</p>
        </div>
    @elseif($isLulus)
        <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
            <!-- Confetti background effect (CSS based) -->
            <div class="absolute inset-0 bg-green-50 opacity-50 z-0"></div>
            
            <div class="relative z-10 p-8 md:p-12 text-center">
                <div class="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
                    <i class="ph ph-check-circle text-5xl"></i>
                </div>
                
                <h1 class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">Selamat, Anda <span class="text-green-600">Diterima!</span></h1>
                
                <p class="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                    Berdasarkan hasil seleksi Panitia Penerimaan Peserta Didik Baru (PPDB), Anda dinyatakan <strong>LULUS</strong> dan diterima sebagai siswa SMP Dharma Bakti Tahun Pelajaran 2026/2027.
                </p>
                
                <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-100 mb-8 inline-block text-left">
                    <div class="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div class="text-sm text-slate-500">Nomor Pendaftaran</div>
                        <div class="font-semibold text-slate-800">{{ $pendaftaran->nomor_pendaftaran }}</div>
                        
                        <div class="text-sm text-slate-500">Nilai Seleksi</div>
                        <div class="font-semibold text-slate-800">{{ $seleksi->nilai_seleksi ?? '-' }}</div>
                        
                        <div class="text-sm text-slate-500">Tanggal Pengumuman</div>
                        <div class="font-semibold text-slate-800">{{ $pengumuman?->tanggal_pengumuman ? $pengumuman->tanggal_pengumuman->locale('id')->translatedFormat('d F Y') : date('d F Y') }}</div>
                    </div>
                </div>
                
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="{{ route('siswa.cetak-bukti') }}" class="bg-white border-2 border-slate-200 hover:border-primary hover:text-primary text-slate-700 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                        <i class="ph ph-printer text-xl"></i> Unduh / Cetak Surat Kelulusan
                    </a>
                    <a href="{{ route('siswa.pembayaran.create') }}" class="bg-primary hover:bg-primaryHover text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                        <i class="ph ph-wallet text-xl"></i> Lanjutkan Pembayaran
                    </a>
                </div>
            </div>
        </div>
    @elseif($isTidakLulus)
        <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-center py-16">
            <div class="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="ph ph-x-circle text-4xl"></i>
            </div>
            
            <h1 class="text-3xl font-bold text-slate-800 mb-4">Mohon Maaf</h1>
            
            <p class="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
                Berdasarkan hasil seleksi, Anda <strong>belum memenuhi kriteria</strong> untuk diterima di SMP Dharma Bakti pada tahun ajaran ini.
            </p>
            
            <div class="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8 inline-block text-left">
                <div class="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div class="text-sm text-slate-500">Nomor Pendaftaran</div>
                    <div class="font-semibold text-slate-800">{{ $pendaftaran->nomor_pendaftaran }}</div>
                    
                    <div class="text-sm text-slate-500">Nilai Seleksi</div>
                    <div class="font-semibold text-slate-800">{{ $seleksi->nilai_seleksi }}</div>
                </div>
            </div>
            
            <p class="text-sm text-slate-500 italic">Tetap semangat dan jangan menyerah. Sukses selalu untuk Anda!</p>
        </div>
    @endif

</div>
@endsection
