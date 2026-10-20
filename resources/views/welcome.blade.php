<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Sistem Penerimaan Murid Baru (SPMB) SMP Dharma Bakti — Pendaftaran online mudah, transparan, dan efisien untuk calon siswa baru.">
    <title>SPMB SMP Dharma Bakti — Pendaftaran Murid Baru Online</title>

    <!-- ============================================================
         FONT: Plus Jakarta Sans dari Google Fonts
    ============================================================= -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- ============================================================
         TAILWIND CSS via CDN + Konfigurasi Kustom
    ============================================================= -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        // Palet utama: Navy & Gold
                        navy: {
                            50:  '#f0f3f9',
                            100: '#dae1f0',
                            200: '#b8c6e3',
                            300: '#8da3d0',
                            400: '#6680bd',
                            500: '#4660a7',
                            600: '#354b88',
                            700: '#2c3d6e',
                            800: '#1e2a4a',  // Primary Navy
                            900: '#131b33',
                            950: '#0b1120',
                        },
                        gold: {
                            50:  '#fefbec',
                            100: '#fcf3c9',
                            200: '#f9e68e',
                            300: '#f5d354',  // Aksen Gold utama
                            400: '#f2c42a',
                            500: '#e3ab13',
                            600: '#c9850d',
                            700: '#a1610f',
                            800: '#844d13',
                            900: '#6d3f15',
                        },
                        electric: {
                            400: '#60a5fa',
                            500: '#3b82f6',
                            600: '#2563eb',
                        },
                        surface: {
                            50:  '#fafbfc',
                            100: '#f5f6f8',
                            200: '#eef0f3',
                        }
                    },
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
                    },
                    animation: {
                        'float':       'float 6s ease-in-out infinite',
                        'float-delay': 'float 6s ease-in-out 2s infinite',
                        'float-slow':  'float 8s ease-in-out 4s infinite',
                        'pulse-glow':  'pulseGlow 3s ease-in-out infinite',
                        'fade-up':     'fadeUp 0.8s ease-out forwards',
                        'slide-right': 'slideRight 0.6s ease-out forwards',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                            '50%':     { transform: 'translateY(-20px) rotate(2deg)' },
                        },
                        pulseGlow: {
                            '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
                            '50%':      { opacity: '0.7', transform: 'scale(1.05)' },
                        },
                        fadeUp: {
                            '0%':   { opacity: '0', transform: 'translateY(30px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        slideRight: {
                            '0%':   { opacity: '0', transform: 'translateX(-20px)' },
                            '100%': { opacity: '1', transform: 'translateX(0)' },
                        }
                    }
                }
            }
        }
    </script>

    <!-- ============================================================
         IKON: Lucide Icons via CDN
    ============================================================= -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

    <!-- ============================================================
         CUSTOM CSS: Elemen non-Tailwind dan animasi kustom
    ============================================================= -->
    <style>
        /* Base */
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

        /* Smooth scroll behaviour */
        html { scroll-behavior: smooth; }

        /* Hero background pattern */
        .hero-gradient {
            background: linear-gradient(135deg, #1e2a4a 0%, #131b33 40%, #0b1120 100%);
        }

        /* Glassmorphism card */
        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* Gradient overlay text */
        .gradient-text {
            background: linear-gradient(135deg, #f5d354, #f2c42a, #e3ab13);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Kartu animasi hover */
        .info-card {
            transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                        box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .info-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 50px -12px rgba(30, 42, 74, 0.15);
        }

        /* Timeline connector line */
        .timeline-line {
            background: linear-gradient(180deg, #f5d354 0%, #3b82f6 100%);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f5f6f8; }
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #354b88, #1e2a4a);
            border-radius: 10px;
        }

        /* Scroll reveal animation via IntersectionObserver */
        .reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                        transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }

        /* Stagger children reveal */
        .reveal-child { opacity: 0; transform: translateY(30px); transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
        .reveal-child.active { opacity: 1; transform: translateY(0); }

        /* Mobile menu overlay */
        .mobile-menu {
            transform: translateX(100%);
            transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mobile-menu.open { transform: translateX(0); }

        /* Input focus ring */
        .form-input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(53, 75, 136, 0.15);
            border-color: #354b88;
        }

        /* Badge shimmer */
        @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        .badge-shimmer {
            background: linear-gradient(90deg, #f5d354, #f9e68e, #f5d354);
            background-size: 200% auto;
            animation: shimmer 3s linear infinite;
        }

        /* Particle dots for hero */
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(245, 211, 84, 0.3);
            border-radius: 50%;
        }
    </style>
</head>

<body class="bg-surface-50 text-slate-800 antialiased overflow-x-hidden">

    <!-- ============================================================
         NAVBAR — Navigasi Utama (Fixed, Glassmorphism)
    ============================================================= -->
    <nav id="navbar" class="fixed top-0 w-full z-50 transition-all duration-500">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-20 items-center">

                <!-- Logo & Brand -->
                <a href="#beranda" class="flex-shrink-0 flex items-center gap-3 group">
                    <!-- Ikon logo dengan gradient -->
                    <div class="relative w-11 h-11 rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center shadow-lg shadow-navy-800/30 group-hover:shadow-navy-800/50 transition-shadow duration-300">
                        <span class="font-black text-lg text-gold-300">DB</span>
                        <div class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gold-300 rounded-full animate-pulse-glow"></div>
                    </div>
                    <div class="flex flex-col">
                        <span class="font-bold text-lg tracking-tight leading-tight text-navy-800" id="brand-text">SMP Dharma Bakti</span>
                        <span class="text-[10px] font-medium text-navy-400 uppercase tracking-widest">Penerimaan Murid Baru</span>
                    </div>
                </a>

                <!-- Desktop Navigation Links -->
                <div class="hidden lg:flex items-center gap-1">
                    <a href="#beranda" class="nav-link px-4 py-2 rounded-lg text-sm font-semibold text-navy-600 hover:text-navy-800 hover:bg-navy-50 transition-all duration-300">Beranda</a>
                    <a href="#informasi" class="nav-link px-4 py-2 rounded-lg text-sm font-semibold text-navy-600 hover:text-navy-800 hover:bg-navy-50 transition-all duration-300">Informasi</a>
                    <a href="#alur" class="nav-link px-4 py-2 rounded-lg text-sm font-semibold text-navy-600 hover:text-navy-800 hover:bg-navy-50 transition-all duration-300">Alur Pendaftaran</a>
                    <a href="#kontak" class="nav-link px-4 py-2 rounded-lg text-sm font-semibold text-navy-600 hover:text-navy-800 hover:bg-navy-50 transition-all duration-300">Kontak</a>

                    <div class="w-px h-6 bg-navy-200 mx-3"></div>

                    @auth
                        <a href="{{ Auth::user()->isAdmin() ? route('admin.dashboard') : route('siswa.dashboard') }}"
                           class="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-navy-800/25 hover:shadow-navy-800/40 hover:-translate-y-0.5">
                            <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
                            Dashboard
                        </a>
                    @else
                        <a href="{{ route('login') }}"
                           class="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-navy-900 px-4 py-2.5 rounded-xl hover:bg-navy-50 transition-all duration-300">
                            <i data-lucide="log-in" class="w-4 h-4"></i>
                            Masuk
                        </a>
                        <a href="{{ route('register') }}"
                           class="inline-flex items-center gap-2 bg-gradient-to-r from-navy-700 to-navy-800 hover:from-navy-800 hover:to-navy-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-navy-800/25 hover:shadow-navy-800/40 hover:-translate-y-0.5">
                            <i data-lucide="user-plus" class="w-4 h-4"></i>
                            Daftar Sekarang
                        </a>
                    @endauth
                </div>

                <!-- Mobile Menu Toggle -->
                <button id="mobile-toggle" class="lg:hidden relative w-10 h-10 rounded-xl bg-navy-50 hover:bg-navy-100 flex items-center justify-center transition-colors" aria-label="Toggle menu">
                    <i data-lucide="menu" class="w-5 h-5 text-navy-700" id="menu-icon"></i>
                </button>
            </div>
        </div>
    </nav>

    <!-- ============================================================
         MOBILE MENU — Slide-in overlay untuk layar kecil
    ============================================================= -->
    <div id="mobile-menu" class="mobile-menu fixed inset-0 z-[60] lg:hidden">
        <!-- Overlay gelap di belakang -->
        <div id="menu-overlay" class="absolute inset-0 bg-navy-950/60 backdrop-blur-sm opacity-0 transition-opacity duration-300"></div>

        <!-- Panel menu -->
        <div class="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col">
            <!-- Header panel -->
            <div class="flex items-center justify-between p-6 border-b border-surface-200">
                <span class="font-bold text-navy-800 text-lg">Menu</span>
                <button id="mobile-close" class="w-10 h-10 rounded-xl bg-surface-100 hover:bg-surface-200 flex items-center justify-center transition-colors">
                    <i data-lucide="x" class="w-5 h-5 text-navy-700"></i>
                </button>
            </div>

            <!-- Link navigasi mobile -->
            <div class="flex-1 p-6 space-y-2">
                <a href="#beranda" class="mobile-link flex items-center gap-3 px-4 py-3.5 rounded-xl text-navy-700 hover:bg-navy-50 font-semibold transition-all">
                    <i data-lucide="home" class="w-5 h-5 text-navy-400"></i> Beranda
                </a>
                <a href="#informasi" class="mobile-link flex items-center gap-3 px-4 py-3.5 rounded-xl text-navy-700 hover:bg-navy-50 font-semibold transition-all">
                    <i data-lucide="info" class="w-5 h-5 text-navy-400"></i> Informasi
                </a>
                <a href="#alur" class="mobile-link flex items-center gap-3 px-4 py-3.5 rounded-xl text-navy-700 hover:bg-navy-50 font-semibold transition-all">
                    <i data-lucide="route" class="w-5 h-5 text-navy-400"></i> Alur Pendaftaran
                </a>
                <a href="#kontak" class="mobile-link flex items-center gap-3 px-4 py-3.5 rounded-xl text-navy-700 hover:bg-navy-50 font-semibold transition-all">
                    <i data-lucide="mail" class="w-5 h-5 text-navy-400"></i> Kontak
                </a>
            </div>

            <!-- Tombol CTA di mobile -->
            <div class="p-6 space-y-3 border-t border-surface-200">
                @auth
                    <a href="{{ Auth::user()->isAdmin() ? route('admin.dashboard') : route('siswa.dashboard') }}"
                       class="flex items-center justify-center gap-2 w-full bg-navy-800 hover:bg-navy-900 text-white py-3.5 rounded-xl font-semibold transition-all">
                        <i data-lucide="layout-dashboard" class="w-4 h-4"></i> Dashboard
                    </a>
                @else
                    <a href="{{ route('register') }}"
                       class="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-navy-700 to-navy-800 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-navy-800/25 transition-all">
                        <i data-lucide="user-plus" class="w-4 h-4"></i> Daftar Sekarang
                    </a>
                    <a href="{{ route('login') }}"
                       class="flex items-center justify-center gap-2 w-full bg-surface-100 hover:bg-surface-200 text-navy-700 py-3.5 rounded-xl font-semibold transition-all">
                        <i data-lucide="log-in" class="w-4 h-4"></i> Masuk
                    </a>
                @endauth
            </div>
        </div>
    </div>

    <!-- ============================================================
         SECTION 1: BERANDA (HERO)
         — Full-screen hero dengan gradient gelap, tipografi besar,
           animasi floating shapes, dan dual CTA.
    ============================================================= -->
    <section id="beranda" class="relative min-h-screen flex items-center hero-gradient overflow-hidden">
        <!-- Decorative floating shapes -->
        <div class="absolute top-20 left-[10%] w-72 h-72 bg-gold-300/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-[10%] w-96 h-96 bg-electric-500/10 rounded-full blur-3xl animate-float-delay"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy-600/20 rounded-full blur-3xl animate-float-slow"></div>

        <!-- Grid pattern overlay -->
        <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22 width=%2232%22 height=%2232%22 fill=%22none%22 stroke=%22white%22><path d=%22M0 .5H31.5V32%22/></svg>');"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-28 pb-20 lg:pt-0 lg:pb-0">
            <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                <!-- Kolom Kiri: Teks Hero -->
                <div class="text-center lg:text-left">
                    <!-- Badge tahun ajaran -->
                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 reveal">
                        <span class="w-2 h-2 rounded-full bg-gold-300 animate-pulse"></span>
                        <span class="text-gold-300 font-semibold text-sm tracking-wide">Pendaftaran Tahun Ajaran 2025/2026</span>
                    </div>

                    <!-- Headline -->
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 reveal">
                        Langkah Pertama
                        <br>
                        Menuju
                        <span class="gradient-text"> Masa Depan</span>
                        <br>
                        <span class="text-white/70">Gemilang.</span>
                    </h1>

                    <!-- Sub-headline -->
                    <p class="text-lg sm:text-xl text-navy-200 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 reveal">
                        Sistem Penerimaan Murid Baru (SPMB) SMP Dharma Bakti memudahkan proses pendaftaran calon siswa secara
                        <span class="text-white font-semibold">online</span>,
                        <span class="text-white font-semibold">transparan</span>, dan
                        <span class="text-white font-semibold">efisien</span>.
                    </p>

                    <!-- CTA Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start reveal">
                        <a href="{{ route('register') }}"
                           class="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-gold-300 to-gold-400 hover:from-gold-400 hover:to-gold-500 text-navy-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-gold-300/20 hover:shadow-gold-300/40 hover:-translate-y-1">
                            Daftar Sekarang
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </a>
                        <a href="#informasi"
                           class="group inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            Pelajari Lebih Lanjut
                        </a>
                    </div>

                    <!-- Statistik mini -->
                    <div class="flex flex-wrap justify-center lg:justify-start gap-8 mt-12 reveal">
                        <div class="text-center lg:text-left">
                            <div class="text-3xl font-black text-white">500<span class="text-gold-300">+</span></div>
                            <div class="text-sm text-navy-300 font-medium mt-1">Alumni Berprestasi</div>
                        </div>
                        <div class="w-px h-12 bg-white/10 hidden sm:block"></div>
                        <div class="text-center lg:text-left">
                            <div class="text-3xl font-black text-white">A<span class="text-gold-300">+</span></div>
                            <div class="text-sm text-navy-300 font-medium mt-1">Akreditasi Sekolah</div>
                        </div>
                        <div class="w-px h-12 bg-white/10 hidden sm:block"></div>
                        <div class="text-center lg:text-left">
                            <div class="text-3xl font-black text-white">20<span class="text-gold-300">+</span></div>
                            <div class="text-sm text-navy-300 font-medium mt-1">Tahun Pengalaman</div>
                        </div>
                    </div>
                </div>

                <!-- Kolom Kanan: Kartu dekoratif (visual element) -->
                <div class="hidden lg:flex justify-center items-center relative">
                    <!-- Kartu utama bergaya glass -->
                    <div class="relative w-[420px] h-[480px]">
                        <!-- Background glow -->
                        <div class="absolute inset-0 bg-gradient-to-br from-gold-300/20 to-electric-500/20 rounded-3xl blur-2xl"></div>

                        <!-- Kartu utama -->
                        <div class="relative glass-card rounded-3xl p-8 h-full flex flex-col justify-between animate-float">
                            <div>
                                <div class="w-14 h-14 bg-gradient-to-br from-gold-300 to-gold-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gold-300/30">
                                    <i data-lucide="graduation-cap" class="w-7 h-7 text-navy-900"></i>
                                </div>
                                <h3 class="text-2xl font-bold text-white mb-3">Pendaftaran Online</h3>
                                <p class="text-navy-300 leading-relaxed">Proses pendaftaran dilakukan secara digital — cukup dari rumah, tanpa perlu datang ke sekolah.</p>
                            </div>
                            <div class="space-y-4">
                                <!-- Progress indikator dekoratif -->
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                        <i data-lucide="check" class="w-4 h-4 text-green-400"></i>
                                    </div>
                                    <span class="text-sm text-navy-200 font-medium">Registrasi Akun</span>
                                    <span class="ml-auto text-xs text-green-400 font-semibold">Selesai</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                        <i data-lucide="check" class="w-4 h-4 text-green-400"></i>
                                    </div>
                                    <span class="text-sm text-navy-200 font-medium">Isi Formulir</span>
                                    <span class="ml-auto text-xs text-green-400 font-semibold">Selesai</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-gold-300/20 flex items-center justify-center">
                                        <i data-lucide="loader" class="w-4 h-4 text-gold-300 animate-spin"></i>
                                    </div>
                                    <span class="text-sm text-white font-medium">Upload Dokumen</span>
                                    <span class="ml-auto text-xs text-gold-300 font-semibold">Proses</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                        <i data-lucide="circle" class="w-4 h-4 text-navy-400"></i>
                                    </div>
                                    <span class="text-sm text-navy-400 font-medium">Pengumuman</span>
                                    <span class="ml-auto text-xs text-navy-500 font-semibold">Menunggu</span>
                                </div>
                            </div>
                        </div>

                        <!-- Kartu notifikasi melayang -->
                        <div class="absolute -top-6 -right-6 glass-card rounded-2xl p-4 flex items-center gap-3 animate-float-delay shadow-2xl">
                            <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="check-circle" class="w-5 h-5 text-green-400"></i>
                            </div>
                            <div>
                                <div class="text-sm font-bold text-white">Verifikasi Berhasil</div>
                                <div class="text-xs text-navy-300">Dokumen telah divalidasi</div>
                            </div>
                        </div>

                        <!-- Badge pendaftar -->
                        <div class="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 flex items-center gap-3 animate-float-slow shadow-2xl">
                            <div class="w-10 h-10 rounded-xl bg-electric-500/20 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="users" class="w-5 h-5 text-electric-400"></i>
                            </div>
                            <div>
                                <div class="text-sm font-bold text-white">150+ Pendaftar</div>
                                <div class="text-xs text-navy-300">Tahun ini</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom wave divider -->
        <div class="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
                <path d="M0 40L48 36C96 32 192 24 288 28C384 32 480 48 576 52C672 56 768 48 864 40C960 32 1056 24 1152 28C1248 32 1344 48 1392 56L1440 64V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="#fafbfc"/>
            </svg>
        </div>
    </section>

    <!-- ============================================================
         SECTION 2: INFORMASI
         — Card grid menampilkan Program Unggulan, Fasilitas, dan
           Beasiswa dalam layout modern dengan ikon & efek hover.
    ============================================================= -->
    <section id="informasi" class="py-24 lg:py-32 bg-surface-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <!-- Section Header -->
            <div class="text-center max-w-3xl mx-auto mb-20 reveal">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-50 border border-navy-100 mb-6">
                    <i data-lucide="sparkles" class="w-4 h-4 text-navy-600"></i>
                    <span class="text-navy-700 font-semibold text-sm">Mengapa SMP Dharma Bakti?</span>
                </div>
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 tracking-tight mb-6">
                    Pendidikan Berkualitas untuk
                    <span class="gradient-text">Generasi Unggul</span>
                </h2>
                <p class="text-lg text-slate-500 leading-relaxed">
                    SMP Dharma Bakti hadir dengan program, fasilitas, dan dukungan terbaik untuk membantu setiap siswa meraih potensi tertingginya.
                </p>
            </div>

            <!-- Cards Grid: 3 kolom di desktop -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                <!-- Kartu 1: Program Unggulan -->
                <div class="info-card bg-white rounded-3xl p-8 border border-surface-200 hover:border-navy-200 group reveal-child">
                    <div class="w-14 h-14 bg-gradient-to-br from-navy-700 to-navy-900 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-navy-800/20 group-hover:scale-110 transition-transform duration-500">
                        <i data-lucide="book-open" class="w-7 h-7 text-gold-300"></i>
                    </div>
                    <h3 class="text-xl font-bold text-navy-900 mb-3">Program Unggulan</h3>
                    <p class="text-slate-500 leading-relaxed mb-6">Kurikulum berbasis kompetensi dengan pendekatan pembelajaran modern yang memadukan akademik, teknologi, dan karakter.</p>
                    <ul class="space-y-3">
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <div class="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="check" class="w-3.5 h-3.5 text-green-500"></i>
                            </div>
                            Kurikulum Merdeka Belajar
                        </li>
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <div class="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="check" class="w-3.5 h-3.5 text-green-500"></i>
                            </div>
                            Kelas Bilingual (Indonesia & Inggris)
                        </li>
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <div class="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="check" class="w-3.5 h-3.5 text-green-500"></i>
                            </div>
                            Pengembangan Karakter & Leadership
                        </li>
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <div class="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="check" class="w-3.5 h-3.5 text-green-500"></i>
                            </div>
                            Ekstrakurikuler 15+ Pilihan
                        </li>
                    </ul>
                </div>

                <!-- Kartu 2: Fasilitas Sekolah -->
                <div class="info-card bg-white rounded-3xl p-8 border border-surface-200 hover:border-navy-200 group reveal-child">
                    <div class="w-14 h-14 bg-gradient-to-br from-electric-500 to-electric-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-electric-500/20 group-hover:scale-110 transition-transform duration-500">
                        <i data-lucide="building" class="w-7 h-7 text-white"></i>
                    </div>
                    <h3 class="text-xl font-bold text-navy-900 mb-3">Fasilitas Modern</h3>
                    <p class="text-slate-500 leading-relaxed mb-6">Lingkungan belajar yang nyaman dan dilengkapi teknologi terkini untuk menunjang proses pembelajaran optimal.</p>
                    <ul class="space-y-3">
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <div class="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="monitor" class="w-3.5 h-3.5 text-blue-500"></i>
                            </div>
                            Lab Komputer & Multimedia
                        </li>
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <div class="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="flask-conical" class="w-3.5 h-3.5 text-blue-500"></i>
                            </div>
                            Laboratorium IPA Lengkap
                        </li>
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <div class="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="library" class="w-3.5 h-3.5 text-blue-500"></i>
                            </div>
                            Perpustakaan Digital
                        </li>
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <div class="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="wifi" class="w-3.5 h-3.5 text-blue-500"></i>
                            </div>
                            Ruang Kelas Ber-AC & Smartboard
                        </li>
                    </ul>
                </div>

                <!-- Kartu 3: Beasiswa -->
                <div class="info-card bg-white rounded-3xl p-8 border border-surface-200 hover:border-gold-200 group md:col-span-2 lg:col-span-1 reveal-child">
                    <div class="w-14 h-14 bg-gradient-to-br from-gold-300 to-gold-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gold-300/20 group-hover:scale-110 transition-transform duration-500">
                        <i data-lucide="award" class="w-7 h-7 text-navy-900"></i>
                    </div>
                    <h3 class="text-xl font-bold text-navy-900 mb-3">Program Beasiswa</h3>
                    <p class="text-slate-500 leading-relaxed mb-6">Kesempatan meraih pendidikan terbaik dengan dukungan beasiswa untuk siswa berprestasi dan kurang mampu.</p>
                    <ul class="space-y-3">
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <div class="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="trophy" class="w-3.5 h-3.5 text-amber-500"></i>
                            </div>
                            Beasiswa Prestasi Akademik
                        </li>
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <div class="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="medal" class="w-3.5 h-3.5 text-amber-500"></i>
                            </div>
                            Beasiswa Prestasi Non-Akademik
                        </li>
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <div class="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="heart-handshake" class="w-3.5 h-3.5 text-amber-500"></i>
                            </div>
                            Beasiswa Bantuan Ekonomi
                        </li>
                        <li class="flex items-center gap-3 text-sm text-slate-600">
                            <div class="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                                <i data-lucide="star" class="w-3.5 h-3.5 text-amber-500"></i>
                            </div>
                            Potongan Biaya Pendaftaran Dini
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Call-to-action banner kecil -->
            <div class="mt-16 bg-gradient-to-r from-navy-800 to-navy-900 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 reveal">
                <div class="text-center lg:text-left">
                    <h3 class="text-2xl font-bold text-white mb-2">Tertarik Bergabung?</h3>
                    <p class="text-navy-200">Daftarkan diri Anda sekarang dan jadilah bagian dari keluarga besar SMP Dharma Bakti.</p>
                </div>
                <a href="{{ route('register') }}"
                   class="flex-shrink-0 inline-flex items-center gap-2 bg-gold-300 hover:bg-gold-400 text-navy-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg shadow-gold-300/20 hover:-translate-y-1">
                    <i data-lucide="rocket" class="w-5 h-5"></i>
                    Mulai Pendaftaran
                </a>
            </div>
        </div>
    </section>

    <!-- ============================================================
         SECTION 3: ALUR PENDAFTARAN
         — Timeline vertikal dengan step-by-step visual, ikon tiap
           langkah, dan deskripsi yang jelas.
    ============================================================= -->
    <section id="alur" class="py-24 lg:py-32 bg-white relative overflow-hidden">
        <!-- Subtle background ornament -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-navy-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-gold-50/50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            <!-- Section Header -->
            <div class="text-center max-w-3xl mx-auto mb-20 reveal">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-50 border border-gold-200 mb-6">
                    <i data-lucide="route" class="w-4 h-4 text-gold-600"></i>
                    <span class="text-gold-700 font-semibold text-sm">Mudah & Transparan</span>
                </div>
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 tracking-tight mb-6">
                    Alur Pendaftaran
                    <span class="gradient-text">Step-by-Step</span>
                </h2>
                <p class="text-lg text-slate-500 leading-relaxed">
                    Ikuti 5 langkah mudah berikut ini untuk menyelesaikan proses pendaftaran murid baru secara online.
                </p>
            </div>

            <!-- Timeline -->
            <div class="max-w-4xl mx-auto">
                <div class="relative">
                    <!-- Vertical Line (hidden on mobile, shown on md+) -->
                    <div class="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-300 via-navy-300 to-electric-400 -translate-x-1/2"></div>

                    <!-- Step 1: Registrasi Akun -->
                    <div class="relative flex flex-col md:flex-row items-center gap-6 md:gap-0 mb-16 reveal">
                        <!-- Left content (desktop) -->
                        <div class="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1">
                            <h3 class="text-xl font-bold text-navy-900 mb-2">Registrasi Akun</h3>
                            <p class="text-slate-500 leading-relaxed">Buat akun dengan mengisi nama lengkap, email aktif, dan password. Verifikasi akun melalui kode OTP yang dikirim ke email Anda.</p>
                        </div>
                        <!-- Center icon -->
                        <div class="relative z-10 flex-shrink-0 order-1 md:order-2">
                            <div class="w-16 h-16 bg-gradient-to-br from-gold-300 to-gold-500 rounded-2xl flex items-center justify-center shadow-xl shadow-gold-300/30">
                                <i data-lucide="user-plus" class="w-7 h-7 text-navy-900"></i>
                            </div>
                            <div class="absolute -top-2 -right-2 w-7 h-7 bg-navy-800 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-lg">1</div>
                        </div>
                        <!-- Right spacer (desktop) -->
                        <div class="md:w-1/2 md:pl-12 order-3 hidden md:block"></div>
                    </div>

                    <!-- Step 2: Isi Formulir -->
                    <div class="relative flex flex-col md:flex-row items-center gap-6 md:gap-0 mb-16 reveal">
                        <div class="md:w-1/2 md:pr-12 order-2 md:order-1 hidden md:block"></div>
                        <div class="relative z-10 flex-shrink-0 order-1 md:order-2">
                            <div class="w-16 h-16 bg-gradient-to-br from-navy-700 to-navy-900 rounded-2xl flex items-center justify-center shadow-xl shadow-navy-800/30">
                                <i data-lucide="clipboard-list" class="w-7 h-7 text-gold-300"></i>
                            </div>
                            <div class="absolute -top-2 -right-2 w-7 h-7 bg-navy-800 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-lg">2</div>
                        </div>
                        <div class="md:w-1/2 md:pl-12 md:text-left order-2 md:order-3">
                            <h3 class="text-xl font-bold text-navy-900 mb-2">Isi Formulir Pendaftaran</h3>
                            <p class="text-slate-500 leading-relaxed">Lengkapi data diri, NISN, informasi orang tua/wali, serta data asal sekolah melalui formulir digital yang tersedia.</p>
                        </div>
                    </div>

                    <!-- Step 3: Upload Dokumen -->
                    <div class="relative flex flex-col md:flex-row items-center gap-6 md:gap-0 mb-16 reveal">
                        <div class="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1">
                            <h3 class="text-xl font-bold text-navy-900 mb-2">Upload Dokumen Persyaratan</h3>
                            <p class="text-slate-500 leading-relaxed">Unggah dokumen yang diperlukan: pas foto, akte kelahiran, kartu keluarga, dan ijazah/SKL dalam format yang telah ditentukan.</p>
                        </div>
                        <div class="relative z-10 flex-shrink-0 order-1 md:order-2">
                            <div class="w-16 h-16 bg-gradient-to-br from-electric-500 to-electric-600 rounded-2xl flex items-center justify-center shadow-xl shadow-electric-500/30">
                                <i data-lucide="upload-cloud" class="w-7 h-7 text-white"></i>
                            </div>
                            <div class="absolute -top-2 -right-2 w-7 h-7 bg-navy-800 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-lg">3</div>
                        </div>
                        <div class="md:w-1/2 md:pl-12 order-3 hidden md:block"></div>
                    </div>

                    <!-- Step 4: Seleksi & Verifikasi -->
                    <div class="relative flex flex-col md:flex-row items-center gap-6 md:gap-0 mb-16 reveal">
                        <div class="md:w-1/2 md:pr-12 order-2 md:order-1 hidden md:block"></div>
                        <div class="relative z-10 flex-shrink-0 order-1 md:order-2">
                            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/30">
                                <i data-lucide="file-search" class="w-7 h-7 text-white"></i>
                            </div>
                            <div class="absolute -top-2 -right-2 w-7 h-7 bg-navy-800 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-lg">4</div>
                        </div>
                        <div class="md:w-1/2 md:pl-12 md:text-left order-2 md:order-3">
                            <h3 class="text-xl font-bold text-navy-900 mb-2">Seleksi & Verifikasi Berkas</h3>
                            <p class="text-slate-500 leading-relaxed">Tim panitia akan memeriksa kelengkapan dan validitas dokumen Anda, lalu melakukan penilaian seleksi masuk.</p>
                        </div>
                    </div>

                    <!-- Step 5: Pengumuman -->
                    <div class="relative flex flex-col md:flex-row items-center gap-6 md:gap-0 reveal">
                        <div class="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1">
                            <h3 class="text-xl font-bold text-navy-900 mb-2">Pengumuman Hasil</h3>
                            <p class="text-slate-500 leading-relaxed">Cek hasil seleksi langsung di portal akun Anda. Jika diterima, cetak bukti penerimaan dan lanjutkan proses pembayaran.</p>
                        </div>
                        <div class="relative z-10 flex-shrink-0 order-1 md:order-2">
                            <div class="w-16 h-16 bg-gradient-to-br from-gold-300 to-gold-500 rounded-2xl flex items-center justify-center shadow-xl shadow-gold-300/30">
                                <i data-lucide="party-popper" class="w-7 h-7 text-navy-900"></i>
                            </div>
                            <div class="absolute -top-2 -right-2 w-7 h-7 bg-navy-800 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-lg">5</div>
                        </div>
                        <div class="md:w-1/2 md:pl-12 order-3 hidden md:block"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================================
         SECTION 4: KONTAK
         — Split layout: Formulir di kiri, Info kontak + Peta di kanan.
    ============================================================= -->
    <section id="kontak" class="py-24 lg:py-32 bg-surface-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <!-- Section Header -->
            <div class="text-center max-w-3xl mx-auto mb-20 reveal">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-500/10 border border-electric-500/20 mb-6">
                    <i data-lucide="message-circle" class="w-4 h-4 text-electric-600"></i>
                    <span class="text-electric-600 font-semibold text-sm">Ada Pertanyaan?</span>
                </div>
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 tracking-tight mb-6">
                    Hubungi
                    <span class="gradient-text">Kami</span>
                </h2>
                <p class="text-lg text-slate-500 leading-relaxed">
                    Jangan ragu untuk menghubungi kami jika Anda membutuhkan informasi lebih lanjut tentang proses pendaftaran.
                </p>
            </div>

            <!-- Grid dua kolom -->
            <div class="grid lg:grid-cols-2 gap-8 lg:gap-12">

                <!-- Kolom Kiri: Formulir Kontak -->
                <div class="bg-white rounded-3xl p-8 lg:p-10 border border-surface-200 shadow-sm reveal">
                    <h3 class="text-2xl font-bold text-navy-900 mb-2">Kirim Pesan</h3>
                    <p class="text-slate-500 mb-8">Isi formulir di bawah dan tim kami akan segera merespons.</p>

                    <form id="contact-form" class="space-y-6">
                        @csrf
                        <!-- Nama -->
                        <div>
                            <label for="contact-name" class="block text-sm font-semibold text-navy-700 mb-2">Nama Lengkap</label>
                            <input type="text" id="contact-name" name="name" placeholder="Masukkan nama lengkap Anda"
                                   class="form-input w-full px-5 py-3.5 rounded-xl border border-surface-200 bg-surface-50 text-navy-800 placeholder-slate-400 text-sm transition-all duration-300 hover:border-navy-300">
                        </div>
                        <!-- Email -->
                        <div>
                            <label for="contact-email" class="block text-sm font-semibold text-navy-700 mb-2">Alamat Email</label>
                            <input type="email" id="contact-email" name="email" placeholder="contoh@email.com"
                                   class="form-input w-full px-5 py-3.5 rounded-xl border border-surface-200 bg-surface-50 text-navy-800 placeholder-slate-400 text-sm transition-all duration-300 hover:border-navy-300">
                        </div>
                        <!-- Pesan -->
                        <div>
                            <label for="contact-message" class="block text-sm font-semibold text-navy-700 mb-2">Pesan</label>
                            <textarea id="contact-message" name="message" rows="5" placeholder="Tuliskan pertanyaan atau pesan Anda di sini..."
                                      class="form-input w-full px-5 py-3.5 rounded-xl border border-surface-200 bg-surface-50 text-navy-800 placeholder-slate-400 text-sm transition-all duration-300 hover:border-navy-300 resize-none"></textarea>
                        </div>
                        <!-- Tombol Kirim -->
                        <button type="submit" id="contact-submit"
                                class="group w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-navy-700 to-navy-800 hover:from-navy-800 hover:to-navy-900 text-white py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg shadow-navy-800/25 hover:shadow-navy-800/40 hover:-translate-y-0.5">
                            <i data-lucide="send" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
                            Kirim Pesan
                        </button>
                    </form>
                </div>

                <!-- Kolom Kanan: Info Kontak + Peta -->
                <div class="flex flex-col gap-8 reveal">
                    <!-- Info Kontak -->
                    <div class="bg-white rounded-3xl p-8 lg:p-10 border border-surface-200 shadow-sm flex-1">
                        <h3 class="text-2xl font-bold text-navy-900 mb-2">Informasi Kontak</h3>
                        <p class="text-slate-500 mb-8">Anda juga dapat menghubungi kami langsung melalui informasi berikut.</p>

                        <div class="space-y-6">
                            <!-- Alamat -->
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center flex-shrink-0">
                                    <i data-lucide="map-pin" class="w-5 h-5 text-navy-600"></i>
                                </div>
                                <div>
                                    <div class="font-semibold text-navy-800 mb-1">Alamat Sekolah</div>
                                    <div class="text-slate-500 text-sm leading-relaxed">Jl. Pendidikan No. 123, Kelurahan Maju Jaya, Kecamatan Cendekia, Kota Bandung, Jawa Barat 40123</div>
                                </div>
                            </div>
                            <!-- WhatsApp -->
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                                    <i data-lucide="phone" class="w-5 h-5 text-green-600"></i>
                                </div>
                                <div>
                                    <div class="font-semibold text-navy-800 mb-1">WhatsApp</div>
                                    <div class="text-slate-500 text-sm">+62 812-3456-7890</div>
                                    <a href="https://wa.me/6281234567890" target="_blank" class="text-sm text-green-600 hover:text-green-700 font-semibold mt-1 inline-flex items-center gap-1">
                                        Chat Sekarang <i data-lucide="external-link" class="w-3 h-3"></i>
                                    </a>
                                </div>
                            </div>
                            <!-- Email -->
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <i data-lucide="mail" class="w-5 h-5 text-blue-600"></i>
                                </div>
                                <div>
                                    <div class="font-semibold text-navy-800 mb-1">Email</div>
                                    <div class="text-slate-500 text-sm">info@smpdarmabakti.sch.id</div>
                                </div>
                            </div>
                            <!-- Jam Operasional -->
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                                    <i data-lucide="clock" class="w-5 h-5 text-amber-600"></i>
                                </div>
                                <div>
                                    <div class="font-semibold text-navy-800 mb-1">Jam Layanan</div>
                                    <div class="text-slate-500 text-sm">Senin - Jumat: 08.00 - 15.00 WIB</div>
                                    <div class="text-slate-500 text-sm">Sabtu: 08.00 - 12.00 WIB</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Google Maps Placeholder -->
                    <div class="bg-white rounded-3xl overflow-hidden border border-surface-200 shadow-sm">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.792097645944!2d107.61875897499551!3d-6.917463993085078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e63d77ee3e53%3A0x20a7a7c0a4d76b4!2sBandung%2C%20Kota%20Bandung%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                            width="100%" height="220" style="border:0;" allowfullscreen="" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                            class="w-full h-52 lg:h-56"
                            title="Lokasi SMP Dharma Bakti">
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================================
         FOOTER — Informasi lengkap, links, dan branding
    ============================================================= -->
    <footer class="bg-navy-900 text-white pt-16 pb-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                <!-- Kolom 1: Brand -->
                <div class="lg:col-span-2">
                    <div class="flex items-center gap-3 mb-5">
                        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center">
                            <span class="font-black text-lg text-navy-900">DB</span>
                        </div>
                        <div>
                            <div class="font-bold text-lg text-white">SMP Dharma Bakti</div>
                            <div class="text-xs text-navy-300 font-medium uppercase tracking-widest">Penerimaan Murid Baru</div>
                        </div>
                    </div>
                    <p class="text-navy-300 leading-relaxed max-w-md mb-6">
                        Membangun generasi unggul melalui pendidikan berkualitas, berkarakter, dan berbasis teknologi. Pendaftaran dibuka untuk tahun ajaran 2025/2026.
                    </p>
                    <div class="flex gap-3">
                        <a href="#" class="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-navy-300 hover:text-white transition-all duration-300">
                            <i data-lucide="instagram" class="w-4 h-4"></i>
                        </a>
                        <a href="#" class="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-navy-300 hover:text-white transition-all duration-300">
                            <i data-lucide="facebook" class="w-4 h-4"></i>
                        </a>
                        <a href="#" class="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-navy-300 hover:text-white transition-all duration-300">
                            <i data-lucide="youtube" class="w-4 h-4"></i>
                        </a>
                    </div>
                </div>

                <!-- Kolom 2: Tautan Cepat -->
                <div>
                    <h4 class="font-bold text-sm uppercase tracking-widest text-navy-300 mb-5">Tautan</h4>
                    <ul class="space-y-3">
                        <li><a href="#beranda" class="text-navy-300 hover:text-white transition-colors text-sm font-medium">Beranda</a></li>
                        <li><a href="#informasi" class="text-navy-300 hover:text-white transition-colors text-sm font-medium">Informasi</a></li>
                        <li><a href="#alur" class="text-navy-300 hover:text-white transition-colors text-sm font-medium">Alur Pendaftaran</a></li>
                        <li><a href="#kontak" class="text-navy-300 hover:text-white transition-colors text-sm font-medium">Kontak</a></li>
                        <li><a href="{{ route('register') }}" class="text-navy-300 hover:text-white transition-colors text-sm font-medium">Daftar Sekarang</a></li>
                    </ul>
                </div>

                <!-- Kolom 3: Kontak -->
                <div>
                    <h4 class="font-bold text-sm uppercase tracking-widest text-navy-300 mb-5">Kontak</h4>
                    <ul class="space-y-3">
                        <li class="flex items-center gap-2 text-navy-300 text-sm">
                            <i data-lucide="phone" class="w-4 h-4 flex-shrink-0"></i>
                            +62 812-3456-7890
                        </li>
                        <li class="flex items-center gap-2 text-navy-300 text-sm">
                            <i data-lucide="mail" class="w-4 h-4 flex-shrink-0"></i>
                            info@smpdarmabakti.sch.id
                        </li>
                        <li class="flex items-start gap-2 text-navy-300 text-sm">
                            <i data-lucide="map-pin" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                            Jl. Pendidikan No. 123, Bandung
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Bottom bar / Copyright -->
            <div class="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p class="text-navy-400 text-sm text-center sm:text-left">
                    &copy; {{ date('Y') }} SMP Dharma Bakti. Seluruh hak cipta dilindungi.
                </p>
                <p class="text-navy-500 text-xs">
                    Dibangun dengan <span class="text-red-400">&hearts;</span> untuk Pendidikan Indonesia
                </p>
            </div>
        </div>
    </footer>

    <!-- ============================================================
         JAVASCRIPT
         — Mobile menu toggle, scroll-reveal (IntersectionObserver),
           navbar style on scroll, smooth scrolling fix, dan inisiasi
           Lucide icons.
    ============================================================= -->
    <script>
        // ==========================================
        // 1. Inisialisasi Lucide Icons
        // ==========================================
        document.addEventListener('DOMContentLoaded', function() {
            lucide.createIcons();
        });

        // ==========================================
        // 2. Toggle Mobile Menu
        // ==========================================
        const mobileToggle = document.getElementById('mobile-toggle');
        const mobileMenu   = document.getElementById('mobile-menu');
        const mobileClose  = document.getElementById('mobile-close');
        const menuOverlay  = document.getElementById('menu-overlay');
        const mobileLinks  = document.querySelectorAll('.mobile-link');

        /** Buka mobile menu */
        function openMobileMenu() {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
            setTimeout(() => { menuOverlay.style.opacity = '1'; }, 50);
        }

        /** Tutup mobile menu */
        function closeMobileMenu() {
            menuOverlay.style.opacity = '0';
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }

        mobileToggle.addEventListener('click', openMobileMenu);
        mobileClose.addEventListener('click', closeMobileMenu);
        menuOverlay.addEventListener('click', closeMobileMenu);

        // Tutup menu saat link diklik
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // ==========================================
        // 3. Navbar Style on Scroll
        // ==========================================
        const navbar = document.getElementById('navbar');
        const brandText = document.getElementById('brand-text');

        function updateNavbar() {
            if (window.scrollY > 80) {
                navbar.classList.add('bg-white/90', 'backdrop-blur-xl', 'shadow-lg', 'shadow-navy-900/5', 'border-b', 'border-surface-200');
                navbar.classList.remove('bg-transparent');
            } else {
                navbar.classList.remove('bg-white/90', 'backdrop-blur-xl', 'shadow-lg', 'shadow-navy-900/5', 'border-b', 'border-surface-200');
                navbar.classList.add('bg-transparent');
            }
        }

        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar(); // Jalankan sekali saat load

        // ==========================================
        // 4. Scroll Reveal Animation (IntersectionObserver)
        //    Lebih performa daripada scroll event listener.
        // ==========================================
        const revealElements = document.querySelectorAll('.reveal, .reveal-child');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger delay untuk reveal-child
                    const delay = entry.target.classList.contains('reveal-child')
                        ? index * 150
                        : 0;
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // ==========================================
        // 5. Form Submit Handler (Mencegah default)
        // ==========================================
        const contactForm = document.getElementById('contact-form');
        const submitBtn   = document.getElementById('contact-submit');

        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                // Ganti tampilan tombol ke status loading
                const originalHTML = submitBtn.innerHTML;
                submitBtn.innerHTML = '<svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Mengirim...';
                submitBtn.disabled = true;

                // Simulasi pengiriman (karena belum ada backend endpoint)
                setTimeout(() => {
                    submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> Pesan Terkirim!';
                    submitBtn.classList.remove('from-navy-700', 'to-navy-800');
                    submitBtn.classList.add('from-green-500', 'to-green-600');

                    // Reset setelah 3 detik
                    setTimeout(() => {
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('from-green-500', 'to-green-600');
                        submitBtn.classList.add('from-navy-700', 'to-navy-800');
                        contactForm.reset();
                        // Re-init lucide icon di tombol
                        lucide.createIcons();
                    }, 3000);
                }, 1500);
            });
        }

        // ==========================================
        // 6. Active Nav Link Highlight on Scroll
        // ==========================================
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('text-navy-800', 'bg-navy-50');
                        link.classList.add('text-navy-600');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('text-navy-800', 'bg-navy-50');
                            link.classList.remove('text-navy-600');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        });

        sections.forEach(section => sectionObserver.observe(section));
    </script>
</body>
</html>
