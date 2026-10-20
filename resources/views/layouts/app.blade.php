<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Dashboard') - SPMB SMP Dharma Bakti</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#4f46e5',
                        primaryHover: '#4338ca',
                        sidebar: '#1e293b', // Dark slate
                        sidebarHover: '#334155',
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    
    <!-- Phosphor Icons (Modern icons) -->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>

    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        .page-content { opacity: 0; }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="flex h-screen overflow-hidden text-slate-800">

    <!-- Sidebar -->
    <aside class="w-64 bg-sidebar text-white flex flex-col transition-all duration-300 z-20 shadow-xl hidden md:flex">
        <div class="h-16 flex items-center justify-center border-b border-slate-700 font-bold text-lg tracking-wider">
            SPMB SMP DB
        </div>
        
        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            @if(Auth::user()->isAdmin())
                <!-- Menu Admin -->
                <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ request()->routeIs('admin.dashboard') ? 'bg-primary text-white' : 'text-slate-300 hover:bg-sidebarHover hover:text-white' }}">
                    <i class="ph ph-squares-four text-xl"></i>
                    <span>Dashboard Admin</span>
                </a>
                <a href="{{ route('admin.pendaftar.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ request()->routeIs('admin.pendaftar.*') ? 'bg-primary text-white' : 'text-slate-300 hover:bg-sidebarHover hover:text-white' }}">
                    <i class="ph ph-users text-xl"></i>
                    <span>Kelola Pendaftar</span>
                </a>
                <a href="{{ route('admin.verifikasi.berkas.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ request()->routeIs('admin.verifikasi.berkas.*') ? 'bg-primary text-white' : 'text-slate-300 hover:bg-sidebarHover hover:text-white' }}">
                    <i class="ph ph-file-search text-xl"></i>
                    <span>Verifikasi Berkas</span>
                </a>
                <a href="{{ route('admin.verifikasi.seleksi.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ request()->routeIs('admin.verifikasi.seleksi.*') ? 'bg-primary text-white' : 'text-slate-300 hover:bg-sidebarHover hover:text-white' }}">
                    <i class="ph ph-exam text-xl"></i>
                    <span>Penilaian Seleksi</span>
                </a>
                <a href="{{ route('admin.pembayaran.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ request()->routeIs('admin.pembayaran.*') ? 'bg-primary text-white' : 'text-slate-300 hover:bg-sidebarHover hover:text-white' }}">
                    <i class="ph ph-money text-xl"></i>
                    <span>Verif. Pembayaran</span>
                </a>
                <a href="{{ route('admin.laporan.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ request()->routeIs('admin.laporan.*') ? 'bg-primary text-white' : 'text-slate-300 hover:bg-sidebarHover hover:text-white' }}">
                    <i class="ph ph-printer text-xl"></i>
                    <span>Cetak Laporan</span>
                </a>
            @else
                <!-- Menu Siswa -->
                <a href="{{ route('siswa.dashboard') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ request()->routeIs('siswa.dashboard') ? 'bg-primary text-white' : 'text-slate-300 hover:bg-sidebarHover hover:text-white' }}">
                    <i class="ph ph-house text-xl"></i>
                    <span>Beranda</span>
                </a>
                <a href="{{ route('siswa.formulir.create') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ request()->routeIs('siswa.formulir.*') ? 'bg-primary text-white' : 'text-slate-300 hover:bg-sidebarHover hover:text-white' }}">
                    <i class="ph ph-article text-xl"></i>
                    <span>Formulir Pendaftaran</span>
                </a>
                <a href="{{ route('siswa.dokumen.create') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ request()->routeIs('siswa.dokumen.*') ? 'bg-primary text-white' : 'text-slate-300 hover:bg-sidebarHover hover:text-white' }}">
                    <i class="ph ph-upload-simple text-xl"></i>
                    <span>Upload Dokumen</span>
                </a>
                <a href="{{ route('siswa.seleksi.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ request()->routeIs('siswa.seleksi.*') ? 'bg-primary text-white' : 'text-slate-300 hover:bg-sidebarHover hover:text-white' }}">
                    <i class="ph ph-exam text-xl"></i>
                    <span>Seleksi</span>
                </a>
                <a href="{{ route('siswa.pengumuman.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ request()->routeIs('siswa.pengumuman.*') ? 'bg-primary text-white' : 'text-slate-300 hover:bg-sidebarHover hover:text-white' }}">
                    <i class="ph ph-megaphone text-xl"></i>
                    <span>Pengumuman</span>
                </a>
                
                @php
                    $isDiterima = Auth::user()->calonSiswa?->pendaftaran?->seleksi?->status_seleksi === 'diterima';
                @endphp
                
                @if($isDiterima)
                    <a href="{{ route('siswa.pembayaran.create') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ request()->routeIs('siswa.pembayaran.*') ? 'bg-primary text-white' : 'text-slate-300 hover:bg-sidebarHover hover:text-white' }}">
                        <i class="ph ph-wallet text-xl"></i>
                        <span>Pembayaran</span>
                    </a>
                @endif
            @endif
        </nav>
        
        <div class="p-4 border-t border-slate-700">
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left">
                    <i class="ph ph-sign-out text-xl"></i>
                    <span>Logout</span>
                </button>
            </form>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
        
        <!-- Topbar (Mobile menu button + User info) -->
        <header class="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 relative">
            <div class="flex items-center gap-4">
                <!-- Tambah tombol menu mobile nanti jika diperlukan -->
                <h1 class="font-semibold text-lg text-slate-700">@yield('title')</h1>
            </div>
            
            <div class="flex items-center gap-3">
                <div class="text-right hidden sm:block">
                    <div class="text-sm font-semibold text-slate-800">{{ Auth::user()->username }}</div>
                    <div class="text-xs text-slate-500 capitalize">{{ Auth::user()->role }}</div>
                </div>
                <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {{ strtoupper(substr(Auth::user()->username, 0, 1)) }}
                </div>
            </div>
        </header>

        <!-- Page Content -->
        <div class="flex-1 overflow-y-auto p-6 page-content">
            <!-- Alert Messages -->
            @if (session('status'))
                <div class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded shadow-sm">
                    {{ session('status') }}
                </div>
            @endif
            
            @if (session('error'))
                <div class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
                    {{ session('error') }}
                </div>
            @endif

            @yield('content')
        </div>
    </main>

    <!-- GSAP Animations -->
    <script>
        document.addEventListener("DOMContentLoaded", (event) => {
            // Animate page content on load
            gsap.to(".page-content", {
                opacity: 1,
                y: -10,
                duration: 0.6,
                ease: "power2.out",
                startAt: { y: 10 }
            });
            
            // Stagger animation for cards if they exist
            gsap.from(".anim-card", {
                y: 30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.out(1.7)",
                delay: 0.2
            });
        });
    </script>
</body>
</html>
