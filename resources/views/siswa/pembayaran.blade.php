@extends('layouts.app')

@section('title', 'Pembayaran Pendaftaran')

@section('content')
<div class="max-w-4xl mx-auto">

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Info Rekening Card -->
        <div class="anim-card bg-gradient-to-br from-indigo-600 to-primary rounded-2xl shadow-lg shadow-primary/20 p-6 text-white relative overflow-hidden">
            <!-- Decorative circles -->
            <div class="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
            
            <div class="relative z-10">
                <div class="flex items-center gap-3 mb-6 opacity-80">
                    <i class="ph ph-bank text-2xl"></i>
                    <h2 class="font-medium">Rekening Pembayaran Sekolah</h2>
                </div>
                
                <p class="text-sm opacity-80 mb-1">Bank Tujuan</p>
                <p class="text-xl font-bold mb-4">{{ $pengaturan->nama_bank ?? 'BANK BNI' }}</p>
                
                <p class="text-sm opacity-80 mb-1">Nomor Rekening</p>
                <p class="text-2xl font-mono font-bold tracking-widest mb-4">{{ $pengaturan->nomor_rekening ?? '1234 5678 9012' }}</p>
                
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-sm opacity-80 mb-1">Atas Nama</p>
                        <p class="text-lg font-bold">{{ $pengaturan->atas_nama ?? 'SMP Dharma Bakti' }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm opacity-80 mb-1">Total Biaya</p>
                        <p class="text-lg font-bold text-amber-300">{{ $pengaturan->jumlah_biaya ?? 'Rp 1.500.000' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Status Pembayaran Card -->
        <div class="anim-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <h2 class="text-slate-500 font-medium text-sm mb-4">Status Pembayaran Anda</h2>
            
            @if(!$pembayaran || $pembayaran->status_pembayaran === 'belum_bayar')
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                        <i class="ph ph-warning-circle text-3xl"></i>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-slate-800">Belum Bayar</p>
                        <p class="text-sm text-slate-500">Silakan lakukan transfer dan unggah bukti.</p>
                    </div>
                </div>
            @elseif($pembayaran->status_pembayaran === 'menunggu')
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                        <i class="ph ph-hourglass-medium text-3xl"></i>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-slate-800">Menunggu Verifikasi</p>
                        <p class="text-sm text-slate-500">Bukti pembayaran sedang dicek admin.</p>
                    </div>
                </div>
            @elseif($pembayaran->status_pembayaran === 'cicilan')
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
                        <i class="ph ph-chart-pie-slice text-3xl"></i>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-slate-800">Dicicil</p>
                        <p class="text-sm text-slate-500">Pembayaran terverifikasi (Belum lunas).</p>
                    </div>
                </div>
            @elseif($pembayaran->status_pembayaran === 'lunas')
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                        <i class="ph ph-check-circle text-3xl"></i>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-slate-800">Lunas</p>
                        <p class="text-sm text-slate-500">Terima kasih, administrasi telah selesai.</p>
                    </div>
                </div>
            @endif
            
            @if($pembayaran && $pembayaran->catatan_admin)
                <div class="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100">
                    <strong>Catatan Admin:</strong> {{ $pembayaran->catatan_admin }}
                </div>
            @endif

            @if($pembayaran && $pembayaran->bukti_pembayaran)
                <div class="mt-5 pt-4 border-t border-slate-100">
                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <i class="ph ph-image text-primary"></i> Pratinjau Foto Bukti Terunggah:
                    </p>
                    <div class="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 w-full max-w-sm h-48 shadow-sm">
                        <img src="{{ Storage::url($pembayaran->bukti_pembayaran) }}" alt="Bukti Pembayaran" class="w-full h-full object-cover">
                        <a href="{{ Storage::url($pembayaran->bukti_pembayaran) }}" target="_blank" class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[2px]">
                            <i class="ph ph-arrows-out-simple text-2xl"></i>
                            Buka Foto Ukuran Penuh
                        </a>
                    </div>
                </div>
            @endif
        </div>
    </div>

    <!-- Upload Form -->
    <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 class="text-lg font-bold text-slate-800">Upload Bukti Transfer</h2>
        </div>
        
        <form action="{{ route('siswa.pembayaran.store') }}" method="POST" enctype="multipart/form-data" class="p-6">
            @csrf

            <div class="mb-6">
                <label class="block text-sm font-medium text-slate-700 mb-2">Pilih File Bukti Pembayaran (Struk/Screenshot M-Banking)</label>
                <div class="flex items-center justify-center w-full">
                    <label for="bukti_pembayaran" class="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <i class="ph ph-upload-simple text-4xl text-slate-400 mb-2"></i>
                            <p class="mb-2 text-sm text-slate-500"><span class="font-semibold">Klik untuk upload</span> atau drag and drop</p>
                            <p class="text-xs text-slate-500">JPG, PNG, atau PDF (Max. 2MB)</p>
                        </div>
                        <input id="bukti_pembayaran" name="bukti_pembayaran" type="file" class="hidden" accept=".jpg,.jpeg,.png,.pdf" required />
                    </label>
                </div>
                @error('bukti_pembayaran') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror
            </div>

            <div class="flex justify-end">
                <button type="submit" class="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-primary/30 flex items-center gap-2">
                    <i class="ph ph-paper-plane-tilt text-xl"></i> Kirim Bukti Pembayaran
                </button>
            </div>
        </form>
    </div>

</div>
@endsection
