@extends('layouts.app')

@section('title', 'Verifikasi Berkas')

@section('content')
<div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 class="text-lg font-bold text-slate-800">Verifikasi Berkas Calon Siswa</h2>
            <p class="text-sm text-slate-500">Periksa dokumen, terbitkan jadwal tes seleksi jika valid, atau kirimkan keterangan perbaikan jika berkas ditolak.</p>
        </div>
    </div>

    @if(session('status'))
    <div class="m-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
        <i class="ph ph-check-circle text-xl text-emerald-600"></i>
        <span class="text-sm font-medium">{{ session('status') }}</span>
    </div>
    @endif

    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-y border-slate-100">
                    <th class="px-6 py-4 font-semibold">Pendaftar</th>
                    <th class="px-6 py-4 font-semibold">Dokumen Persyaratan</th>
                    <th class="px-6 py-4 font-semibold">Status & Keterangan</th>
                    <th class="px-6 py-4 font-semibold text-center">Aksi Keputusan</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
                @forelse($pendaftarans as $p)
                <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4">
                        <div class="font-bold text-slate-800">{{ $p->calonSiswa?->nama_lengkap ?? 'Belum ada nama' }}</div>
                        <div class="text-xs text-primary font-medium">{{ $p->nomor_pendaftaran }}</div>
                        <div class="text-xs text-slate-400 mt-0.5">{{ $p->asal_sekolah ?? '-' }}</div>
                    </td>
                    <td class="px-6 py-4">
                        @if($p->dokumen)
                            <div class="flex gap-2">
                                <a href="{{ $p->dokumen->akte_kelahiran ? Storage::url($p->dokumen->akte_kelahiran) : '#' }}" target="_blank" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors border border-slate-200" title="Akta Kelahiran">
                                    <i class="ph {{ $p->dokumen->akte_kelahiran ? 'ph-check-circle text-emerald-500' : 'ph-x-circle text-slate-400' }}"></i>
                                </a>
                                <a href="{{ $p->dokumen->kartu_keluarga ? Storage::url($p->dokumen->kartu_keluarga) : '#' }}" target="_blank" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors border border-slate-200" title="Kartu Keluarga">
                                    <i class="ph {{ $p->dokumen->kartu_keluarga ? 'ph-check-circle text-emerald-500' : 'ph-x-circle text-slate-400' }}"></i>
                                </a>
                                <a href="{{ $p->dokumen->pasfoto ? Storage::url($p->dokumen->pasfoto) : '#' }}" target="_blank" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors border border-slate-200" title="Pasfoto">
                                    <i class="ph {{ $p->dokumen->pasfoto ? 'ph-check-circle text-emerald-500' : 'ph-x-circle text-slate-400' }}"></i>
                                </a>
                                <a href="{{ $p->dokumen->ijazah ? Storage::url($p->dokumen->ijazah) : '#' }}" target="_blank" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors border border-slate-200" title="Ijazah / SKL">
                                    <i class="ph {{ $p->dokumen->ijazah ? 'ph-check-circle text-emerald-500' : 'ph-x-circle text-slate-400' }}"></i>
                                </a>
                            </div>
                            <div class="text-[11px] text-slate-400 mt-1">Klik ikon untuk pratinjau berkas</div>
                        @else
                            <span class="text-xs text-rose-500 font-medium">Belum ada dokumen</span>
                        @endif
                    </td>
                    <td class="px-6 py-4">
                        @if($p->status_pendaftaran == 'menunggu_verifikasi')
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Menunggu</span>
                        @elseif($p->status_pendaftaran == 'terverifikasi')
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Terverifikasi</span>
                            @if($p->seleksi?->tanggal_seleksi)
                            <div class="text-xs text-slate-500 mt-1">
                                📅 Tes: {{ \Carbon\Carbon::parse($p->seleksi->tanggal_seleksi)->translatedFormat('d M Y') }}
                            </div>
                            @endif
                        @else
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Ditolak</span>
                            @if($p->catatan_verifikasi)
                            <div class="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded p-1.5 mt-1.5 max-w-xs">
                                <strong>Catatan:</strong> {{ $p->catatan_verifikasi }}
                            </div>
                            @endif
                        @endif
                    </td>
                    <td class="px-6 py-4 text-center">
                        <div class="flex items-center justify-center gap-2">
                            <!-- Tombol Tolak Berkas -->
                            <button type="button" onclick="openRejectModal({{ $p->id_pendaftaran }}, '{{ addslashes($p->calonSiswa?->nama_lengkap ?? '') }}', '{{ $p->nomor_pendaftaran }}', '{{ addslashes($p->catatan_verifikasi ?? '') }}')" class="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors">
                                <i class="ph ph-x-circle mr-1"></i> Tolak
                            </button>

                            <!-- Tombol Verifikasi & Jadwal -->
                            <button type="button" onclick="openApproveModal({{ $p->id_pendaftaran }}, '{{ addslashes($p->calonSiswa?->nama_lengkap ?? '') }}', '{{ $p->nomor_pendaftaran }}', '{{ $p->seleksi?->tanggal_seleksi?->format('Y-m-d') ?? '' }}', '{{ addslashes($p->seleksi?->waktu_seleksi ?? '') }}', '{{ addslashes($p->seleksi?->tempat_seleksi ?? '') }}', '{{ addslashes($p->seleksi?->catatan ?? '') }}')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm">
                                <i class="ph ph-check-circle mr-1"></i> Verifikasi & Jadwal
                            </button>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" class="px-6 py-8 text-center text-slate-500">
                        Tidak ada pendaftar yang perlu diverifikasi saat ini.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    
    <div class="p-6 border-t border-slate-100">
        {{ $pendaftarans->links() }}
    </div>
</div>

<!-- ========================================== -->
<!-- MODAL 1: VERIFIKASI & TERBITKAN JADWAL     -->
<!-- ========================================== -->
<div id="modalApprove" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 anim-modal">
        <div class="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
            <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                <i class="ph ph-calendar-check text-emerald-600 text-xl"></i>
                Verifikasi Berkas & Jadwal Seleksi
            </h3>
            <button type="button" onclick="closeApproveModal()" class="text-slate-400 hover:text-slate-600">
                <i class="ph ph-x text-xl"></i>
            </button>
        </div>

        <p class="text-xs text-slate-500 mb-4" id="approveStudentInfo"></p>

        <form id="formApprove" method="POST" action="">
            @csrf
            @method('PUT')
            <input type="hidden" name="status_pendaftaran" value="terverifikasi">

            <div class="space-y-3">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">📅 Tanggal Pelaksanaan Tes *</label>
                    <input type="date" name="tanggal_seleksi" id="tanggal_seleksi" required class="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-emerald-500">
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">⏰ Waktu / Jam Tes</label>
                    <input type="text" name="waktu_seleksi" id="waktu_seleksi" placeholder="Contoh: 08:00 - 10:00 WIB" class="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-emerald-500">
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">📍 Lokasi / Ruangan Ujian</label>
                    <input type="text" name="tempat_seleksi" id="tempat_seleksi" placeholder="Contoh: Ruang CBT / Lab Komputer SMP Dharma Bakti" class="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-emerald-500">
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">📝 Catatan / Perlengkapan Peserta</label>
                    <textarea name="catatan_seleksi" id="catatan_seleksi" rows="3" placeholder="Contoh: Membawa kartu pendaftaran dan seragam asal..." class="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-emerald-500"></textarea>
                </div>
            </div>

            <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onclick="closeApproveModal()" class="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold">
                    Batal
                </button>
                <button type="submit" class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors">
                    Verifikasi & Kirim Jadwal
                </button>
            </div>
        </form>
    </div>
</div>

<!-- ========================================== -->
<!-- MODAL 2: TOLAK BERKAS & CATATAN REVISI     -->
<!-- ========================================== -->
<div id="modalReject" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 anim-modal">
        <div class="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
            <h3 class="font-bold text-rose-800 text-base flex items-center gap-2">
                <i class="ph ph-warning-circle text-rose-600 text-xl"></i>
                Tolak Berkas & Kirim Catatan Revisi
            </h3>
            <button type="button" onclick="closeRejectModal()" class="text-slate-400 hover:text-slate-600">
                <i class="ph ph-x text-xl"></i>
            </button>
        </div>

        <p class="text-xs text-slate-500 mb-3" id="rejectStudentInfo"></p>

        <form id="formReject" method="POST" action="">
            @csrf
            @method('PUT')
            <input type="hidden" name="status_pendaftaran" value="ditolak">

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                    📋 Keterangan Berkas yang Perlu Diperbaiki (Wajib) *
                </label>
                <textarea name="catatan_verifikasi" id="catatan_verifikasi" rows="4" required placeholder="Tuliskan alasan penolakan dan berkas apa yang harus diperbaiki calon siswa..." class="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-rose-500"></textarea>
            </div>

            <!-- Quick Suggestion Buttons -->
            <div class="mt-3">
                <div class="text-[11px] font-bold text-slate-500 mb-1.5">Pilihan Cepat (Klik untuk menyalin):</div>
                <div class="flex flex-wrap gap-1.5">
                    <button type="button" onclick="appendRejectNote('Scan Kartu Keluarga buram / tidak terbaca jelas.')" class="text-[11px] px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-md border border-rose-200">+ KK Buram</button>
                    <button type="button" onclick="appendRejectNote('Pasfoto belum berlatar merah/biru atau bukan foto formal.')" class="text-[11px] px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-md border border-rose-200">+ Pasfoto Tidak Sesuai</button>
                    <button type="button" onclick="appendRejectNote('Ijazah / SKL belum dilegalisir basah.')" class="text-[11px] px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-md border border-rose-200">+ Ijazah Belum Legalisir</button>
                    <button type="button" onclick="appendRejectNote('Akta Kelahiran terpotong / ada halaman tidak terbaca.')" class="text-[11px] px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-md border border-rose-200">+ Akta Terpotong</button>
                </div>
            </div>

            <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onclick="closeRejectModal()" class="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold">
                    Batal
                </button>
                <button type="submit" class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors">
                    Kirim Notifikasi Penolakan
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    function openApproveModal(id, nama, regNo, tgl, waktu, tempat, catatan) {
        const form = document.getElementById('formApprove');
        form.action = `/admin/verifikasi/berkas/${id}`;
        document.getElementById('approveStudentInfo').innerText = `Calon Siswa: ${nama} (${regNo})`;
        
        // Hitung default +7 hari jika kosong
        if (!tgl) {
            const d = new Date();
            d.setDate(d.getDate() + 7);
            document.getElementById('tanggal_seleksi').value = d.toISOString().split('T')[0];
        } else {
            document.getElementById('tanggal_seleksi').value = tgl;
        }

        document.getElementById('waktu_seleksi').value = waktu || '08:00 - 10:00 WIB';
        document.getElementById('tempat_seleksi').value = tempat || 'Ruang CBT / Lab Komputer SMP Dharma Bakti';
        document.getElementById('catatan_seleksi').value = catatan || 'Harap hadir 30 menit sebelum jadwal, membawa kartu peserta pendaftaran dan seragam asal.';

        document.getElementById('modalApprove').classList.remove('hidden');
    }

    function closeApproveModal() {
        document.getElementById('modalApprove').classList.add('hidden');
    }

    function openRejectModal(id, nama, regNo, catatan) {
        const form = document.getElementById('formReject');
        form.action = `/admin/verifikasi/berkas/${id}`;
        document.getElementById('rejectStudentInfo').innerText = `Calon Siswa: ${nama} (${regNo})`;
        document.getElementById('catatan_verifikasi').value = catatan || '';
        document.getElementById('modalReject').classList.remove('hidden');
    }

    function closeRejectModal() {
        document.getElementById('modalReject').classList.add('hidden');
    }

    function appendRejectNote(note) {
        const area = document.getElementById('catatan_verifikasi');
        if (!area.value.trim()) {
            area.value = note;
        } else {
            area.value = area.value + '\n' + note;
        }
    }
</script>
@endsection
