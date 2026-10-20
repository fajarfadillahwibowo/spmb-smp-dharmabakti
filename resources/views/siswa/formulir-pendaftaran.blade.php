@extends('layouts.app')

@section('title', 'Formulir Pendaftaran')

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-lg font-bold text-slate-800">Data Diri Calon Siswa</h2>
            <p class="text-sm text-slate-500">Lengkapi form di bawah ini dengan data yang benar.</p>
        </div>
        
        <form action="{{ route('siswa.formulir.store') }}" method="POST" class="p-6">
            @csrf

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- Nama Lengkap -->
                <div class="col-span-1 md:col-span-2">
                    <label class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                    <input type="text" name="nama_lengkap" value="{{ old('nama_lengkap', $calonSiswa?->nama_lengkap) }}" required
                           class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    @error('nama_lengkap') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- NISN -->
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">NISN</label>
                    <input type="text" name="nisn" value="{{ old('nisn', $calonSiswa?->nisn) }}" required minlength="10" maxlength="10" pattern="[0-9]{10}" title="NISN harus terdiri dari 10 digit angka" placeholder="Contoh: 0012345678"
                           class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    <p class="text-xs text-slate-500 mt-1">NISN wajib 10 digit angka resmi.</p>
                    @error('nisn') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Asal Sekolah -->
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Asal Sekolah (SD/MI)</label>
                    <input type="text" name="asal_sekolah" value="{{ old('asal_sekolah', $pendaftaran?->asal_sekolah) }}" required
                           class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    @error('asal_sekolah') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Tempat Lahir -->
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Tempat Lahir</label>
                    <input type="text" name="tempat_lahir" value="{{ old('tempat_lahir', $calonSiswa?->tempat_lahir) }}" required
                           class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    @error('tempat_lahir') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Tanggal Lahir -->
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                    <input type="date" name="tanggal_lahir" value="{{ old('tanggal_lahir', $calonSiswa?->tanggal_lahir?->format('Y-m-d')) }}" required
                           class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    @error('tanggal_lahir') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Jenis Kelamin -->
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                    <select name="jenis_kelamin" required
                            class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                        <option value="">-- Pilih --</option>
                        <option value="Laki-laki" {{ old('jenis_kelamin', $calonSiswa?->jenis_kelamin) == 'Laki-laki' ? 'selected' : '' }}>Laki-laki</option>
                        <option value="Perempuan" {{ old('jenis_kelamin', $calonSiswa?->jenis_kelamin) == 'Perempuan' ? 'selected' : '' }}>Perempuan</option>
                    </select>
                    @error('jenis_kelamin') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Alamat -->
                <div class="col-span-1 md:col-span-2">
                    <label class="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                    <textarea name="alamat" rows="3" required
                              class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">{{ old('alamat', $calonSiswa?->alamat) }}</textarea>
                    @error('alamat') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>
            </div>

            <h3 class="text-md font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Data Orang Tua / Wali</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                    <input type="text" name="nama_ortu_wali" value="{{ old('nama_ortu_wali', $calonSiswa?->nama_ortu_wali) }}" required
                           class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    @error('nama_ortu_wali') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Nomor Handphone (Aktif/WhatsApp)</label>
                    <input type="text" name="no_hp_ortu" value="{{ old('no_hp_ortu', $calonSiswa?->no_hp_ortu) }}" required
                           class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    @error('no_hp_ortu') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="flex justify-end">
                <button type="submit" class="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-primary/30">
                    {{ $pendaftaran ? 'Simpan Perubahan' : 'Simpan & Lanjutkan' }}
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
