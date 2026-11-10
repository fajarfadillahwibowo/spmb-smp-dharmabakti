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

    <!-- Data Detail Lengkap 11 Kolom -->
    <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-2 space-y-6 p-6">
        <!-- Bagian 1: Biodata Peserta Didik (Kolom 1 - 7 & 11) -->
        <div>
            <div class="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
                <div class="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center font-bold">
                    <i class="ph ph-identification-card text-lg"></i>
                </div>
                <div>
                    <h3 class="text-base font-bold text-slate-800">1. Biodata Peserta Didik</h3>
                    <p class="text-xs text-slate-500">Kolom 1 s/d 7 & Kolom 11 Formulir Resmi SMP Dharma Bakti</p>
                </div>
            </div>

            <table class="w-full text-sm">
                <tbody class="divide-y divide-slate-100">
                    <tr>
                        <td class="py-2.5 text-slate-500 w-1/3">1. Nama Peserta Didik</td>
                        <td class="py-2.5 font-bold text-slate-900">{{ $pendaftaran->calonSiswa->nama_lengkap }}</td>
                    </tr>
                    <tr>
                        <td class="py-2.5 text-slate-500">2. Tempat, Tgl Lahir</td>
                        <td class="py-2.5 font-medium text-slate-800">{{ $pendaftaran->calonSiswa->tempat_lahir }}, {{ $pendaftaran->calonSiswa->tanggal_lahir?->format('d F Y') }}</td>
                    </tr>
                    <tr>
                        <td class="py-2.5 text-slate-500">3. No. Kartu Keluarga (KK)</td>
                        <td class="py-2.5 font-mono font-medium text-slate-800">{{ $pendaftaran->calonSiswa->no_kk ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="py-2.5 text-slate-500">4. NIK Siswa</td>
                        <td class="py-2.5 font-mono font-medium text-slate-800">{{ $pendaftaran->calonSiswa->nik ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="py-2.5 text-slate-500">5. NISN</td>
                        <td class="py-2.5 font-mono font-bold text-primary">{{ $pendaftaran->calonSiswa->nisn ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="py-2.5 text-slate-500">Jenis Kelamin</td>
                        <td class="py-2.5 font-medium text-slate-800">{{ $pendaftaran->calonSiswa->jenis_kelamin }}</td>
                    </tr>
                    <tr>
                        <td class="py-2.5 text-slate-500">6. Agama</td>
                        <td class="py-2.5 font-medium text-slate-800">{{ $pendaftaran->calonSiswa->agama ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="py-2.5 text-slate-500">7. Alamat Peserta Didik</td>
                        <td class="py-2.5 font-medium text-slate-800">{{ $pendaftaran->calonSiswa->alamat }}</td>
                    </tr>
                    <tr>
                        <td class="py-2.5 text-slate-500">11. Ukuran Pakaian Seragam</td>
                        <td class="py-2.5">
                            <span class="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Ukuran {{ $pendaftaran->calonSiswa->ukuran_pakaian ?? 'M' }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Bagian 2: Data Orang Tua / Wali (Kolom 8 & 10) -->
        <div class="pt-4 border-t border-slate-100">
            <div class="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
                <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <i class="ph ph-users text-lg"></i>
                </div>
                <div>
                    <h3 class="text-base font-bold text-slate-800">2. Data Orang Tua / Wali</h3>
                    <p class="text-xs text-slate-500">Kolom 8 & Kolom 10 Formulir Resmi</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <!-- Ayah -->
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div class="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase mb-2">
                        <i class="ph ph-user text-sm"></i> Data Ayah Kandung
                    </div>
                    <table class="w-full text-xs">
                        <tr class="border-b border-slate-100"><td class="py-1.5 text-slate-500 w-1/3">Nama</td><td class="py-1.5 font-semibold text-slate-800">{{ $pendaftaran->calonSiswa->nama_ayah ?: ($pendaftaran->calonSiswa->nama_ortu_wali ?: '-') }}</td></tr>
                        <tr class="border-b border-slate-100"><td class="py-1.5 text-slate-500">Pekerjaan</td><td class="py-1.5 text-slate-800">{{ $pendaftaran->calonSiswa->pekerjaan_ayah ?: '-' }}</td></tr>
                        <tr><td class="py-1.5 text-slate-500">Alamat</td><td class="py-1.5 text-slate-800">{{ $pendaftaran->calonSiswa->alamat_ayah ?: '-' }}</td></tr>
                    </table>
                </div>

                <!-- Ibu -->
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div class="flex items-center gap-2 text-pink-700 font-bold text-xs uppercase mb-2">
                        <i class="ph ph-user text-sm"></i> Data Ibu Kandung
                    </div>
                    <table class="w-full text-xs">
                        <tr class="border-b border-slate-100"><td class="py-1.5 text-slate-500 w-1/3">Nama</td><td class="py-1.5 font-semibold text-slate-800">{{ $pendaftaran->calonSiswa->nama_ibu ?: '-' }}</td></tr>
                        <tr class="border-b border-slate-100"><td class="py-1.5 text-slate-500">Pekerjaan</td><td class="py-1.5 text-slate-800">{{ $pendaftaran->calonSiswa->pekerjaan_ibu ?: '-' }}</td></tr>
                        <tr><td class="py-1.5 text-slate-500">Alamat</td><td class="py-1.5 text-slate-800">{{ $pendaftaran->calonSiswa->alamat_ibu ?: '-' }}</td></tr>
                    </table>
                </div>
            </div>

            <table class="w-full text-sm">
                <tbody class="divide-y divide-slate-100">
                    <tr>
                        <td class="py-2.5 text-slate-500 w-1/3">10. No. HP / WhatsApp Ortu</td>
                        <td class="py-2.5 font-bold text-emerald-700">
                            <i class="ph ph-whatsapp-logo mr-1"></i> {{ $pendaftaran->calonSiswa->no_hp_ortu }}
                        </td>
                    </tr>
                    <tr>
                        <td class="py-2.5 text-slate-500">Email Akun Pendaftar</td>
                        <td class="py-2.5 font-medium text-slate-800">{{ $pendaftaran->calonSiswa->user?->email }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Bagian 3: Asal Sekolah (Kolom 9) -->
        <div class="pt-4 border-t border-slate-100">
            <div class="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-3">
                <div class="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                    <i class="ph ph-graduation-cap text-lg"></i>
                </div>
                <div>
                    <h3 class="text-base font-bold text-slate-800">3. Asal Sekolah (Kolom 9)</h3>
                </div>
            </div>

            <table class="w-full text-sm">
                <tbody>
                    <tr>
                        <td class="py-2.5 text-slate-500 w-1/3">9. Asal Sekolah (SD/MI)</td>
                        <td class="py-2.5 font-bold text-slate-900">{{ $pendaftaran->asal_sekolah }}</td>
                    </tr>
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
