@extends('layouts.guest')

@section('title', 'Login - SPMB SMP Dharma Bakti')

@section('content')
<div class="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
    <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800">Selamat Datang</h1>
        <p class="text-slate-500 text-sm mt-1">Sistem Penerimaan Murid Baru</p>
    </div>

    <form method="POST" action="{{ route('login') }}" class="space-y-5">
        @csrf

        <div>
            <label for="username" class="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input type="text" name="username" id="username" value="{{ old('username') }}" required autofocus
                   class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none">
            @error('username')
                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" name="password" id="password" required
                   class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none">
            @error('password')
                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
            @enderror
        </div>
        
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <input id="remember" name="remember" type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
                <label for="remember" class="ml-2 block text-sm text-slate-600">Ingat saya</label>
            </div>
        </div>

        <button type="submit" class="w-full bg-primary hover:bg-primaryHover text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/30">
            Masuk
        </button>
    </form>

    <div class="mt-6 text-center text-sm text-slate-600">
        Belum punya akun? 
        <a href="{{ route('register') }}" class="font-medium text-primary hover:text-primaryHover transition-colors">Daftar Sekarang</a>
    </div>
</div>
@endsection
