@extends('layouts.app')

@section('title', 'Penilaian Seleksi')

@section('content')
<div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col justify-between items-start">
        <h2 class="text-lg font-bold text-slate-800">Penilaian Seleksi Calon Siswa</h2>
        <p class="text-sm text-slate-500">Input nilai seleksi dan tentukan kelulusan untuk siswa yang berkasnya sudah diverifikasi.</p>
    </div>

    <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-y border-slate-100">
                    <th class="px-6 py-4 font-medium">Pendaftar</th>
                    <th class="px-6 py-4 font-medium">Asal Sekolah</th>
                    <th class="px-6 py-4 font-medium text-center">Input Penilaian & Kelulusan</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
                @forelse($pendaftarans as $p)
                <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4 align-top">
                        <div class="font-bold text-slate-800">{{ $p->calonSiswa->nama_lengkap }}</div>
                        <div class="text-xs text-primary font-medium">{{ $p->nomor_pendaftaran }}</div>
                        @if($p->seleksi && $p->seleksi->status_seleksi !== 'menunggu')
                            <div class="mt-2 text-xs">
                                @if($p->seleksi->status_seleksi == 'diterima')
                                    <span class="bg-green-100 text-green-700 px-2 py-1 rounded">Sudah dinilai (Diterima)</span>
                                @else
                                    <span class="bg-red-100 text-red-700 px-2 py-1 rounded">Sudah dinilai (Tidak Diterima)</span>
                                @endif
                            </div>
                        @endif
                    </td>
                    <td class="px-6 py-4 align-top">
                        {{ $p->asal_sekolah }}
                    </td>
                    <td class="px-6 py-4">
                        <form method="POST" action="{{ route('admin.verifikasi.seleksi.update', $p->id_pendaftaran) }}" class="flex flex-col gap-3">
                            @csrf
                            @method('PUT')
                            
                            <div class="flex items-center gap-3">
                                <div class="w-1/3">
                                    <label class="text-xs font-semibold text-slate-500 uppercase">Nilai (0-100)</label>
                                    <input type="number" step="0.01" name="nilai_seleksi" value="{{ $p->seleksi ? $p->seleksi->nilai_seleksi : '' }}" required
                                           class="w-full text-sm px-3 py-2 rounded border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary mt-1">
                                </div>
                                <div class="w-2/3">
                                    <label class="text-xs font-semibold text-slate-500 uppercase">Status Kelulusan</label>
                                    <select name="status_seleksi" required
                                            class="w-full text-sm px-3 py-2 rounded border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary mt-1">
                                        <option value="">-- Tentukan --</option>
                                        <option value="diterima" {{ ($p->seleksi && $p->seleksi->status_seleksi == 'diterima') ? 'selected' : '' }}>Diterima</option>
                                        <option value="tidak_diterima" {{ ($p->seleksi && $p->seleksi->status_seleksi == 'tidak_diterima') ? 'selected' : '' }}>Tidak Diterima</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <input type="text" name="catatan" placeholder="Catatan opsional..." value="{{ $p->seleksi ? $p->seleksi->catatan : '' }}"
                                       class="w-full text-sm px-3 py-2 rounded border border-slate-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                            </div>
                            
                            <button type="submit" class="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm self-end">
                                Simpan Penilaian
                            </button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="3" class="px-6 py-8 text-center text-slate-500">
                        Belum ada siswa yang berkasnya terverifikasi untuk diseleksi.
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
@endsection
