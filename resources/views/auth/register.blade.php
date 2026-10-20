@extends('layouts.guest')

@section('title', 'Registrasi - SPMB SMP Dharma Bakti')

@section('content')
<div class="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-lg mx-auto w-[500px] ml-[-25px]">
    <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800">Registrasi Akun</h1>
        <p class="text-slate-500 text-sm mt-1">Daftar sebagai calon siswa baru</p>
    </div>

    <form method="POST" action="{{ route('register') }}" class="space-y-4">
        @csrf

        <div>
            <label for="nama_lengkap" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input type="text" name="nama_lengkap" id="nama_lengkap" value="{{ old('nama_lengkap') }}" required autofocus
                   class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none">
            @error('nama_lengkap')
                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email Aktif (Untuk OTP)</label>
            <input type="email" name="email" id="email" value="{{ old('email') }}" required
                   class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none">
            @error('email')
                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="username" class="block text-sm font-medium text-slate-700 mb-1">Username (Untuk Login)</label>
            <input type="text" name="username" id="username" value="{{ old('username') }}" required
                   class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none">
            @error('username')
                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input type="password" name="password" id="password" required
                       class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none">
                @error('password')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>
            
            <div>
                <label for="password_confirmation" class="block text-sm font-medium text-slate-700 mb-1">Ulangi Password</label>
                <input type="password" name="password_confirmation" id="password_confirmation" required
                       class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none">
            </div>
        </div>

        <button type="submit" class="w-full bg-primary hover:bg-primaryHover text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/30 mt-2">
            Daftar & Kirim OTP
        </button>
    </form>

    <div class="mt-6 text-center text-sm text-slate-600">
        Sudah punya akun? 
        <a href="{{ route('login') }}" class="font-medium text-primary hover:text-primaryHover transition-colors">Login Disini</a>
    </div>
</div>
@endsection
