@extends('layouts.app')

@section('title', 'Formulir Pendaftaran PPDB')

@section('content')
<div class="max-w-4xl mx-auto space-y-6">

    <!-- Kop Surat Resmi SMP Dharma Bakti -->
    <div class="anim-card bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div class="flex flex-col md:flex-row items-center gap-4 border-b-2 border-slate-900 pb-4">
            <img src="{{ asset('logo.png') }}" alt="Logo SMP Dharma Bakti" class="w-20 h-20 object-contain">
            <div class="text-center md:text-left flex-1">
                <h3 class="text-xs font-bold text-slate-600 tracking-wider uppercase">YAYASAN PENDIDIKAN DHARMA BAKTI</h3>
                <h1 class="text-2xl font-black text-primary tracking-wide">SMP DHARMA BAKTI</h1>
                <div class="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded my-1 border border-blue-200">
                    STATUS TERAKREDITASI
                </div>
                <p class="text-xs font-semibold text-slate-500">NDS: 2011050007 | NSS: 2011020018 | NPSN: 10609254</p>
                <p class="text-xs text-slate-600 mt-1">Jln. Rambutan, Rt.10 dusun 2 Desa Suka Maju Kec. Lempuing Jaya, Kab. OKI Prop. Sumatera Selatan</p>
                <p class="text-xs text-slate-500">Kode Pos: 30657 | Telp: 082185769311 | Email: <span class="text-primary font-medium">smpsdb72@gmail.com</span></p>
            </div>
        </div>

        <div class="mt-4 text-center">
            <h2 class="text-base font-extrabold text-slate-800 tracking-wide uppercase">FORMULIR PENDAFTARAN PPDB SMP DHARMA BAKTI</h2>
            <h3 class="text-xs font-bold text-amber-600 tracking-wider">TAHUN PELAJARAN 2026 / 2027</h3>
            @if($pendaftaran?->nomor_pendaftaran)
                <span class="inline-block mt-2 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                    No. Pendaftaran: {{ $pendaftaran->nomor_pendaftaran }}
                </span>
            @endif
        </div>
    </div>

    <!-- Form Input Pendaftaran -->
    <div class="anim-card bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form action="{{ route('siswa.formulir.store') }}" method="POST" class="p-6 space-y-8">
            @csrf

            <!-- ═══════════════════════════════════════════════════════
                 BAGIAN 1: DATA PESERTA DIDIK (1 - 7)
            ═══════════════════════════════════════════════════════ -->
            <div>
                <div class="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5">
                    <span class="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">I</span>
                    <h3 class="text-base font-bold text-slate-800">Data Peserta Didik (Kolom 1 - 7)</h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <!-- 1. Nama Peserta Didik -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-semibold text-slate-700 mb-1">
                            <span class="inline-block bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded mr-1">1</span>
                            Nama Peserta Didik <span class="text-red-500">*</span>
                        </label>
                        <input type="text" name="nama_lengkap" value="{{ old('nama_lengkap', $calonSiswa?->nama_lengkap) }}" required
                               placeholder="Nama lengkap sesuai Ijazah SD / Akta Kelahiran"
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                        @error('nama_lengkap') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- 2. Tempat Lahir -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">
                            <span class="inline-block bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded mr-1">2</span>
                            Tempat Lahir <span class="text-red-500">*</span>
                        </label>
                        <input type="text" name="tempat_lahir" value="{{ old('tempat_lahir', $calonSiswa?->tempat_lahir) }}" required
                               placeholder="Kota / Kabupaten Lahir"
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                        @error('tempat_lahir') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- 2. Tanggal Lahir -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">
                            Tanggal Lahir <span class="text-red-500">*</span>
                        </label>
                        <input type="date" name="tanggal_lahir" value="{{ old('tanggal_lahir', $calonSiswa?->tanggal_lahir?->format('Y-m-d')) }}" required
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                        @error('tanggal_lahir') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- 3. NO KK -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">
                            <span class="inline-block bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded mr-1">3</span>
                            NO KK (Nomor Kartu Keluarga)
                        </label>
                        <input type="text" name="no_kk" value="{{ old('no_kk', $calonSiswa?->no_kk) }}" maxlength="16"
                               placeholder="16 digit nomor Kartu Keluarga"
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono">
                        @error('no_kk') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- 4. NIK -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">
                            <span class="inline-block bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded mr-1">4</span>
                            NIK (Nomor Induk Kependudukan)
                        </label>
                        <input type="text" name="nik" value="{{ old('nik', $calonSiswa?->nik) }}" maxlength="16"
                               placeholder="16 digit NIK siswa (lihat di Kartu Keluarga)"
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono">
                        @error('nik') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- 5. NISN -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">
                            <span class="inline-block bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded mr-1">5</span>
                            NISN (10 Digit Angka) <span class="text-red-500">*</span>
                        </label>
                        <input type="text" name="nisn" value="{{ old('nisn', $calonSiswa?->nisn) }}" required minlength="10" maxlength="10" pattern="[0-9]{10}"
                               placeholder="Contoh: 0081234567"
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono">
                        @error('nisn') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- Jenis Kelamin -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">Jenis Kelamin <span class="text-red-500">*</span></label>
                        <select name="jenis_kelamin" required
                                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                            <option value="">-- Pilih Jenis Kelamin --</option>
                            <option value="Laki-laki" {{ old('jenis_kelamin', $calonSiswa?->jenis_kelamin) == 'Laki-laki' ? 'selected' : '' }}>Laki-laki</option>
                            <option value="Perempuan" {{ old('jenis_kelamin', $calonSiswa?->jenis_kelamin) == 'Perempuan' ? 'selected' : '' }}>Perempuan</option>
                        </select>
                        @error('jenis_kelamin') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- 6. Agama -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">
                            <span class="inline-block bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded mr-1">6</span>
                            Agama <span class="text-red-500">*</span>
                        </label>
                        <select name="agama" required
                                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                            <option value="">-- Pilih Agama --</option>
                            @foreach(['Islam', 'Kristen Protestan', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'] as $agm)
                                <option value="{{ $agm }}" {{ old('agama', $calonSiswa?->agama) == $agm ? 'selected' : '' }}>{{ $agm }}</option>
                            @endforeach
                        </select>
                        @error('agama') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- 7. Alamat Peserta Didik -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-semibold text-slate-700 mb-1">
                            <span class="inline-block bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded mr-1">7</span>
                            Alamat Peserta Didik <span class="text-red-500">*</span>
                        </label>
                        <textarea name="alamat" rows="2" required id="alamat_siswa"
                                  placeholder="Dusun / Desa / RT / RW / Kecamatan / Kab"
                                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">{{ old('alamat', $calonSiswa?->alamat) }}</textarea>
                        @error('alamat') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════
                 BAGIAN 2: DATA WALI (8)
            ═══════════════════════════════════════════════════════ -->
            <div>
                <div class="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5">
                    <span class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">II</span>
                    <h3 class="text-base font-bold text-slate-800">
                        <span class="inline-block bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded mr-1">8</span>
                        Data Wali (Orang Tua Murid)
                    </h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Sub-Kartu Data Ayah -->
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <div class="flex items-center gap-2 text-primary font-bold text-sm border-b border-slate-200 pb-2">
                            <i class="ph ph-user text-base"></i>
                            <span>Data Ayah</span>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Ayah</label>
                            <input type="text" name="nama_ayah" value="{{ old('nama_ayah', $calonSiswa?->nama_ayah ?: $calonSiswa?->nama_ortu_wali) }}"
                                   placeholder="Nama lengkap ayah kandung / wali"
                                   class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary text-sm outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan Ayah</label>
                            <input type="text" name="pekerjaan_ayah" value="{{ old('pekerjaan_ayah', $calonSiswa?->pekerjaan_ayah) }}"
                                   placeholder="Contoh: Petani / Wiraswasta / PNS"
                                   class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary text-sm outline-none">
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-xs font-semibold text-slate-700">Alamat Ayah</label>
                                <button type="button" onclick="document.getElementById('alamat_ayah').value = document.getElementById('alamat_siswa').value;" class="text-[11px] text-blue-600 font-semibold hover:underline">Sama dgn siswa</button>
                            </div>
                            <textarea name="alamat_ayah" id="alamat_ayah" rows="2"
                                      placeholder="Alamat tempat tinggal ayah"
                                      class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary text-sm outline-none">{{ old('alamat_ayah', $calonSiswa?->alamat_ayah) }}</textarea>
                        </div>
                    </div>

                    <!-- Sub-Kartu Data Ibu -->
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <div class="flex items-center gap-2 text-pink-600 font-bold text-sm border-b border-slate-200 pb-2">
                            <i class="ph ph-heart text-base"></i>
                            <span>Data Ibu</span>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Ibu</label>
                            <input type="text" name="nama_ibu" value="{{ old('nama_ibu', $calonSiswa?->nama_ibu) }}"
                                   placeholder="Nama lengkap ibu kandung"
                                   class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary text-sm outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan Ibu</label>
                            <input type="text" name="pekerjaan_ibu" value="{{ old('pekerjaan_ibu', $calonSiswa?->pekerjaan_ibu) }}"
                                   placeholder="Contoh: Ibu Rumah Tangga / Guru"
                                   class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary text-sm outline-none">
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-xs font-semibold text-slate-700">Alamat Ibu</label>
                                <button type="button" onclick="document.getElementById('alamat_ibu').value = document.getElementById('alamat_siswa').value;" class="text-[11px] text-blue-600 font-semibold hover:underline">Sama dgn siswa</button>
                            </div>
                            <textarea name="alamat_ibu" id="alamat_ibu" rows="2"
                                      placeholder="Alamat tempat tinggal ibu"
                                      class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary text-sm outline-none">{{ old('alamat_ibu', $calonSiswa?->alamat_ibu) }}</textarea>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════════
                 BAGIAN 3: SEKOLAH, KONTAK & PAKAIAN (9 - 11)
            ═══════════════════════════════════════════════════════ -->
            <div>
                <div class="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5">
                    <span class="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">III</span>
                    <h3 class="text-base font-bold text-slate-800">Sekolah, Kontak & Perlengkapan (Kolom 9 - 11)</h3>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <!-- 9. Asal Sekolah -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">
                            <span class="inline-block bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded mr-1">9</span>
                            Asal Sekolah (SD/MI) <span class="text-red-500">*</span>
                        </label>
                        <input type="text" name="asal_sekolah" value="{{ old('asal_sekolah', $pendaftaran?->asal_sekolah) }}" required
                               placeholder="Contoh: SDN 01 Suka Maju"
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                        @error('asal_sekolah') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- 10. No. HP yang bisa dihubungi -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">
                            <span class="inline-block bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded mr-1">10</span>
                            No. HP yang bisa dihubungi <span class="text-red-500">*</span>
                        </label>
                        <input type="text" name="no_hp_ortu" value="{{ old('no_hp_ortu', $calonSiswa?->no_hp_ortu) }}" required
                               placeholder="Contoh: 082185769311"
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                        @error('no_hp_ortu') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <!-- 11. Ukuran Pakaian -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">
                            <span class="inline-block bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded mr-1">11</span>
                            Ukuran Pakaian Seragam
                        </label>
                        <select name="ukuran_pakaian"
                                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                            @foreach(['S', 'M', 'L', 'XL', 'XXL'] as $ukr)
                                <option value="{{ $ukr }}" {{ old('ukuran_pakaian', $calonSiswa?->ukuran_pakaian ?: 'M') == $ukr ? 'selected' : '' }}>Ukuran {{ $ukr }}</option>
                            @endforeach
                        </select>
                        @error('ukuran_pakaian') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>
                </div>
            </div>

            <!-- Tombol Simpan -->
            <div class="flex justify-end pt-2">
                <button type="submit" class="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/25 flex items-center gap-2">
                    <i class="ph ph-floppy-disk text-lg"></i>
                    <span>{{ $pendaftaran ? 'Simpan Perubahan Formulir' : 'Simpan & Dapatkan Nomor Pendaftaran' }}</span>
                </button>
            </div>
        </form>
    </div>

</div>
@endsection
