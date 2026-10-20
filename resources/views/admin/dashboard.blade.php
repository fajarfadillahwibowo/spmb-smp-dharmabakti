@extends('layouts.app')

@section('title', 'Dashboard Admin')

@section('content')
<div class="mb-6">
    <h2 class="text-xl font-bold text-slate-800">Halo, {{ $admin->nama_admin }}</h2>
    <p class="text-slate-500">Ringkasan data Penerimaan Murid Baru saat ini.</p>
</div>

<!-- Statistik Utama -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="anim-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
        <div class="absolute right-0 top-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
        <div class="relative z-10">
            <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <i class="ph ph-users text-2xl"></i>
            </div>
            <p class="text-slate-500 font-medium text-sm mb-1">Total Pendaftar</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ $totalPendaftar }}</h3>
        </div>
    </div>
    
    <div class="anim-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
        <div class="absolute right-0 top-0 -mt-4 -mr-4 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
        <div class="relative z-10">
            <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                <i class="ph ph-files text-2xl"></i>
            </div>
            <p class="text-slate-500 font-medium text-sm mb-1">Menunggu Verifikasi</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ $menungguVerifikasi }}</h3>
        </div>
    </div>
    
    <div class="anim-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
        <div class="absolute right-0 top-0 -mt-4 -mr-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
        <div class="relative z-10">
            <div class="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <i class="ph ph-check-circle text-2xl"></i>
            </div>
            <p class="text-slate-500 font-medium text-sm mb-1">Siswa Diterima</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ $diterima }}</h3>
        </div>
    </div>
    
    <div class="anim-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
        <div class="absolute right-0 top-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
        <div class="relative z-10">
            <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <i class="ph ph-wallet text-2xl"></i>
            </div>
            <p class="text-slate-500 font-medium text-sm mb-1">Menunggu Pembayaran</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ $menungguPembayaran }}</h3>
        </div>
    </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Rincian Berkas & Seleksi -->
    <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100">
            <h3 class="font-bold text-slate-800">Status Pendaftaran & Seleksi</h3>
        </div>
        <div class="p-6">
            <div class="space-y-4">
                <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-slate-400"></div>
                        <span class="text-slate-700">Berkas Belum Lengkap</span>
                    </div>
                    <span class="font-bold text-slate-800">{{ $belumLengkap }}</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-lg bg-blue-50/50">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span class="text-slate-700">Berkas Terverifikasi (Siap Seleksi)</span>
                    </div>
                    <span class="font-bold text-slate-800">{{ $terverifikasi }}</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-lg bg-red-50/50">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-red-500"></div>
                        <span class="text-slate-700">Tidak Diterima</span>
                    </div>
                    <span class="font-bold text-slate-800">{{ $ditolak }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Rincian Pembayaran -->
    <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100">
            <h3 class="font-bold text-slate-800">Status Keuangan (Daftar Ulang)</h3>
        </div>
        <div class="p-6">
            <div class="space-y-4">
                <div class="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-green-50 text-green-500 flex items-center justify-center">
                            <i class="ph ph-check-circle text-xl"></i>
                        </div>
                        <div>
                            <p class="font-medium text-slate-800">Pembayaran Lunas</p>
                            <p class="text-xs text-slate-500">Selesai daftar ulang</p>
                        </div>
                    </div>
                    <span class="text-xl font-bold text-slate-800">{{ $totalLunas }}</span>
                </div>
                
                <div class="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                            <i class="ph ph-chart-pie-slice text-xl"></i>
                        </div>
                        <div>
                            <p class="font-medium text-slate-800">Cicilan</p>
                            <p class="text-xs text-slate-500">Pembayaran sebagian terverifikasi</p>
                        </div>
                    </div>
                    <span class="text-xl font-bold text-slate-800">{{ $totalCicilan }}</span>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
