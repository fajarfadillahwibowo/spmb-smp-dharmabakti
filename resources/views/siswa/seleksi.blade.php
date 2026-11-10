@extends('layouts.app')

@section('title', 'Jadwal & Hasil Seleksi')

@section('content')
<div class="max-w-4xl mx-auto">
    
    @if(!$pendaftaran || $pendaftaran->status_pendaftaran !== 'terverifikasi')
        <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-center py-16">
            <div class="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="ph ph-warning-circle text-4xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-slate-800 mb-2">Seleksi Belum Tersedia</h2>
            <p class="text-slate-500 max-w-md mx-auto">Tahap seleksi baru akan terbuka setelah formulir pendaftaran dan dokumen persyaratan Anda dinyatakan <strong>terverifikasi</strong> oleh admin.</p>
        </div>
    @elseif($seleksi)
        <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative mb-8">
            <div class="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 class="text-xl font-bold text-slate-800">Ujian Seleksi Offline</h2>
                    <p class="text-sm text-slate-500 mt-1">Ujian masuk SPMB SMP Dharma Bakti</p>
                </div>
                <a href="{{ route('siswa.seleksi.cetak-kartu') }}" target="_blank" class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md whitespace-nowrap border-b-2 border-blue-800">
                    <i class="ph ph-printer text-lg text-amber-300"></i> Cetak Kartu Ujian (PDF)
                </a>
            </div>

            <div class="p-6 md:p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Informasi Waktu & Tempat -->
                    <div>
                        <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Informasi Jadwal</h3>
                        
                        <div class="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                                    <i class="ph ph-calendar-blank text-2xl"></i>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-500 font-medium">Tanggal Ujian</p>
                                    <p class="text-lg font-bold text-slate-800">
                                        {{ $seleksi->tanggal_seleksi ? $seleksi->tanggal_seleksi->locale('id')->translatedFormat('l, d F Y') : 'Belum Ditentukan' }}
                                    </p>
                                    <p class="text-sm text-slate-600 mt-1">Pukul 08.00 WIB - Selesai</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-slate-50 border border-slate-100 rounded-xl p-5">
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-slate-500 shadow-sm shrink-0">
                                    <i class="ph ph-map-pin text-2xl"></i>
                                </div>
                                <div>
                                    <p class="text-sm text-slate-500 font-medium">Lokasi Ujian Offline</p>
                                    <p class="font-bold text-slate-800 mt-1">Gedung Utama SMP Dharma Bakti</p>
                                    <p class="text-sm text-slate-600 mt-1">Ruang ujian akan diinformasikan pada papan pengumuman di lokasi sekolah.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Informasi Hasil -->
                    <div>
                        <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Status & Hasil Seleksi</h3>
                        
                        <ul class="space-y-4">
                            <li class="flex justify-between items-center border-b border-slate-100 pb-4">
                                <span class="text-slate-500">Nomor Pendaftaran</span>
                                <span class="font-semibold text-slate-800 px-3 py-1 bg-slate-100 rounded-md">{{ $pendaftaran->nomor_pendaftaran }}</span>
                            </li>
                            <li class="flex justify-between items-center border-b border-slate-100 pb-4">
                                <span class="text-slate-500">Status Seleksi</span>
                                @if($seleksi->status_seleksi === 'diterima')
                                    <span class="font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm flex items-center gap-1"><i class="ph ph-check-circle"></i> Lulus Seleksi</span>
                                @elseif($seleksi->status_seleksi === 'tidak_diterima')
                                    <span class="font-semibold text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm flex items-center gap-1"><i class="ph ph-x-circle"></i> Tidak Lulus</span>
                                @else
                                    <span class="font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-sm flex items-center gap-1"><i class="ph ph-clock"></i> Menunggu Hasil</span>
                                @endif
                            </li>
                            <li class="flex justify-between items-center border-b border-slate-100 pb-4">
                                <span class="text-slate-500">Nilai Ujian</span>
                                @if($seleksi->nilai_seleksi !== null)
                                    <span class="font-bold text-xl text-primary">{{ $seleksi->nilai_seleksi }}</span>
                                @else
                                    <span class="font-medium text-slate-400 italic">Belum Dinilai</span>
                                @endif
                            </li>
                        </ul>

                        @if($seleksi->catatan)
                            <div class="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-lg text-sm">
                                <span class="font-semibold text-slate-700 block mb-1">Catatan Panitia:</span>
                                <p class="text-slate-600">{{ $seleksi->catatan }}</p>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
            
            <!-- Warning Alert if not yet evaluated -->
            @if($seleksi->status_seleksi === 'menunggu')
            <div class="bg-blue-50 border-t border-blue-100 p-4 px-6 md:px-8 flex items-start gap-3">
                <i class="ph ph-info mt-0.5 text-blue-500 text-lg"></i>
                <div class="text-sm text-blue-800">
                    <p class="font-semibold mb-1">Perhatian bagi Calon Siswa:</p>
                    <ul class="list-disc pl-4 space-y-1 text-blue-700/80">
                        <li>Harap mencetak <strong>Kartu Ujian Seleksi</strong> sebelum hari ujian.</li>
                        <li>Bawa kartu ujian beserta alat tulis pada saat pelaksanaan ujian offline di sekolah.</li>
                        <li>Nilai dan status kelulusan akan diupdate di halaman ini setelah ujian dilaksanakan.</li>
                    </ul>
                </div>
            </div>
            @endif
        </div>
    @endif

</div>
@endsection
