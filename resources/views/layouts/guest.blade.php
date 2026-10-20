<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'SPMB SMP Dharma Bakti')</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#4f46e5', // Indigo 600
                        secondary: '#1e293b', // Slate 800
                        accent: '#38bdf8', // Light blue
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

    <style>
        body { font-family: 'Inter', sans-serif; }
        .page-transition { opacity: 0; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen flex items-center justify-center">

    <div class="page-transition w-full max-w-md p-6">
        @yield('content')
    </div>

    <!-- GSAP Page Transition Script -->
    <script>
        document.addEventListener("DOMContentLoaded", (event) => {
            gsap.to(".page-transition", {
                opacity: 1,
                y: -20,
                duration: 0.8,
                ease: "power3.out",
                startAt: { y: 20 }
            });
        });
    </script>
</body>
</html>
