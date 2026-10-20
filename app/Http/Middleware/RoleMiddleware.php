<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     * Mendukung multi-role, contoh: middleware('role:admin,kepala_sekolah')
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!Auth::check()) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated. Sesi login tidak ditemukan.',
                ], Response::HTTP_UNAUTHORIZED);
            }
            return redirect('/login');
        }

        $user = Auth::user();

        if (!in_array($user->role, $roles)) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Forbidden. Anda tidak memiliki hak akses ke resource ini.',
                    'your_role' => $user->role,
                ], Response::HTTP_FORBIDDEN);
            }

            // Fallback untuk web routes
            if (method_exists($user, 'isAdmin') && $user->isAdmin()) {
                return redirect('/admin/dashboard');
            } elseif (method_exists($user, 'isSiswa') && $user->isSiswa()) {
                return redirect('/siswa/dashboard');
            }
            
            abort(403, 'Akses ditolak.');
        }

        return $next($request);
    }
}
