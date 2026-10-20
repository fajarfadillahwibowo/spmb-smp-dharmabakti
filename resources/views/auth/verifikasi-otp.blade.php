@extends('layouts.guest')

@section('title', 'Verifikasi OTP - SPMB SMP Dharma Bakti')

@section('content')
<div class="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
    <div class="text-center mb-8">
        <div class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-800">Verifikasi Email</h1>
        <p class="text-slate-500 text-sm mt-2">Masukkan 6 digit kode OTP yang telah dikirimkan ke email <span class="font-medium text-slate-700">{{ session('otp_email') }}</span></p>
    </div>

    @if (session('status'))
        <div class="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded">
            {{ session('status') }}
        </div>
    @endif

    <form method="POST" action="{{ route('verifikasi-otp.verify') }}" class="space-y-6">
        @csrf

        <div>
            <input type="text" name="otp" id="otp" required autofocus maxlength="6" placeholder="000000"
                   class="w-full text-center text-3xl tracking-[1em] font-bold px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none">
            @error('otp')
                <p class="text-red-500 text-xs mt-2 text-center">{{ $message }}</p>
            @enderror
        </div>

        <button type="submit" class="w-full bg-primary hover:bg-primaryHover text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-primary/30">
            Verifikasi Sekarang
        </button>
    </form>

    <div class="mt-6 text-center text-sm text-slate-600">
        Belum menerima kode? 
        <form method="POST" action="{{ route('verifikasi-otp.resend') }}" class="inline">
            @csrf
            <button type="submit" class="font-medium text-primary hover:text-primaryHover transition-colors">Kirim Ulang</button>
        </form>
    </div>
</div>
@endsection
