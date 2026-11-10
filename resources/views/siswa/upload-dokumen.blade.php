@extends('layouts.app')

@section('title', 'Upload Dokumen')

@section('content')
<div class="max-w-4xl mx-auto">
    
    @if(session('status_berkas'))
    <div class="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-2xl mb-6 shadow-sm flex items-start space-x-3 anim-card">
        <div class="flex-shrink-0">
            <i class="ph ph-check-circle text-emerald-600 text-3xl"></i>
        </div>
        <div class="ml-1">
            <h4 class="text-base font-bold text-emerald-900">Selamat, Data & Berkas Anda Sudah Terekam!</h4>
            <p class="text-sm text-emerald-700 mt-1">{{ session('status_berkas') }} Pantau menu <strong>Seleksi</strong> dan <strong>Pengumuman</strong> untuk informasi kelulusan selanjutnya.</p>
        </div>
    </div>
    @endif

    @if(session('status'))
    <div class="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl mb-6 shadow-sm flex items-start space-x-3 anim-card">
        <div class="flex-shrink-0">
            <i class="ph ph-check-circle text-emerald-600 text-2xl"></i>
        </div>
        <div class="ml-1">
            <h4 class="text-sm font-bold text-emerald-900">Data Pribadi Berhasil Disimpan!</h4>
            <p class="text-sm text-emerald-700 mt-0.5">{{ session('status') }}</p>
        </div>
    </div>
    @endif

    @if($pendaftaran && $pendaftaran->status_pendaftaran === 'menunggu_verifikasi')
    <div class="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-2xl mb-6 anim-card">
        <div class="flex">
            <div class="flex-shrink-0">
                <i class="ph ph-clock text-amber-500 text-2xl"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm font-bold text-amber-900">Selamat, Berkas Anda Sudah Terekam — Menunggu Verifikasi Admin</p>
                <p class="text-sm text-amber-800 mt-1">
                    Dokumen Anda telah tersimpan dengan aman di server. Panitia SPMB sedang memeriksa dan memvalidasi keabsahan data Anda. Pantau terus status dan jadwal seleksi selanjutnya.
                </p>
            </div>
        </div>
    </div>
    @elseif($pendaftaran && $pendaftaran->status_pendaftaran === 'terverifikasi')
    <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-6 anim-card">
        <div class="flex">
            <div class="flex-shrink-0">
                <i class="ph ph-check-circle text-green-500 text-xl"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm font-semibold text-green-800">Dokumen Terverifikasi</p>
                <p class="text-sm text-green-700 mt-1">
                    Berkas pendaftaran Anda telah disetujui. Silakan cek menu <strong>Seleksi</strong> untuk melihat jadwal ujian Anda.
                </p>
            </div>
        </div>
    </div>
    @else
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6 anim-card">
        <div class="flex">
            <div class="flex-shrink-0">
                <i class="ph ph-info text-blue-500 text-xl"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm text-blue-700">
                    Silakan unggah dokumen persyaratan di bawah ini. Format file yang diizinkan adalah JPG, PNG, atau PDF. Ukuran maksimal per file adalah 2MB.
                </p>
            </div>
        </div>
    </div>
    @endif

    <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-lg font-bold text-slate-800">Dokumen Persyaratan</h2>
        </div>
        
        <form action="{{ route('siswa.dokumen.store') }}" method="POST" enctype="multipart/form-data" class="p-6">
            @csrf

            <div class="space-y-6">
                <!-- Akte Kelahiran -->
                <div class="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                    <div class="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-files text-2xl"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-medium text-slate-800">Akte Kelahiran</h3>
                        <p class="text-xs text-slate-500 mb-2">Scan atau foto jelas akte kelahiran asli.</p>
                        <input type="file" name="akte_kelahiran" accept=".jpg,.jpeg,.png,.pdf" class="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
                        @error('akte_kelahiran') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                    @if($dokumen && $dokumen->akte_kelahiran)
                        <div class="flex items-center gap-2">
                            <span class="text-green-600 flex items-center gap-1 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                <i class="ph ph-check-circle text-sm"></i> Terupload
                            </span>
                            <a href="{{ asset('storage/' . $dokumen->akte_kelahiran) }}" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200">
                                <i class="ph ph-eye text-sm"></i> Lihat Berkas
                            </a>
                        </div>
                    @endif
                </div>

                <!-- Kartu Keluarga -->
                <div class="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                    <div class="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-users text-2xl"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-medium text-slate-800">Kartu Keluarga (KK)</h3>
                        <p class="text-xs text-slate-500 mb-2">Scan KK terbaru.</p>
                        <input type="file" name="kartu_keluarga" accept=".jpg,.jpeg,.png,.pdf" class="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
                        @error('kartu_keluarga') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                    @if($dokumen && $dokumen->kartu_keluarga)
                        <div class="flex items-center gap-2">
                            <span class="text-green-600 flex items-center gap-1 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                <i class="ph ph-check-circle text-sm"></i> Terupload
                            </span>
                            <a href="{{ asset('storage/' . $dokumen->kartu_keluarga) }}" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200">
                                <i class="ph ph-eye text-sm"></i> Lihat Berkas
                            </a>
                        </div>
                    @endif
                </div>

                <!-- Pasfoto -->
                <div class="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                    <div class="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-image text-2xl"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-medium text-slate-800">Pasfoto 3x4</h3>
                        <p class="text-xs text-slate-500 mb-2">Pasfoto terbaru dengan latar belakang merah/biru.</p>
                        <input type="file" name="pasfoto" accept=".jpg,.jpeg,.png" class="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
                        @error('pasfoto') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                    @if($dokumen && $dokumen->pasfoto)
                        <div class="flex items-center gap-2">
                            <span class="text-green-600 flex items-center gap-1 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                <i class="ph ph-check-circle text-sm"></i> Terupload
                            </span>
                            <a href="{{ asset('storage/' . $dokumen->pasfoto) }}" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200">
                                <i class="ph ph-eye text-sm"></i> Lihat Berkas
                            </a>
                        </div>
                    @endif
                </div>

                <!-- Ijazah / SKL -->
                <div class="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                    <div class="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="ph ph-certificate text-2xl"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-medium text-slate-800">Ijazah / SKL</h3>
                        <p class="text-xs text-slate-500 mb-2">Ijazah SD/MI atau Surat Keterangan Lulus sementara.</p>
                        <input type="file" name="ijazah" accept=".jpg,.jpeg,.png,.pdf" class="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
                        @error('ijazah') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                    @if($dokumen && $dokumen->ijazah)
                        <div class="flex items-center gap-2">
                            <span class="text-green-600 flex items-center gap-1 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                <i class="ph ph-check-circle text-sm"></i> Terupload
                            </span>
                            <a href="{{ asset('storage/' . $dokumen->ijazah) }}" target="_blank" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200">
                                <i class="ph ph-eye text-sm"></i> Lihat Berkas
                            </a>
                        </div>
                    @endif
                </div>
            </div>

            <div class="mt-8 flex justify-end">
                <button type="submit" class="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-primary/30 flex items-center gap-2">
                    <i class="ph ph-upload-simple text-xl"></i> Unggah Dokumen
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
