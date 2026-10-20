<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\KirimOtp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class OtpController extends Controller
{
    /**
     * Menampilkan form verifikasi OTP.
     */
    public function showOtpForm(Request $request)
    {
        if (!$request->session()->has('otp_email')) {
            return redirect()->route('login');
        }

        return view('auth.verifikasi-otp');
    }

    /**
     * Memproses verifikasi kode OTP.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'otp' => ['required', 'numeric', 'digits:6'],
        ]);

        $email = $request->session()->get('otp_email');
        if (!$email) {
            return redirect()->route('login')->withErrors(['otp' => 'Sesi kedaluwarsa. Silakan login kembali.']);
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            return redirect()->route('login');
        }

        // Cek OTP valid dan belum kedaluwarsa
        if ($user->otp_code !== $request->otp || now()->greaterThan($user->otp_expires_at)) {
            return back()->withErrors(['otp' => 'Kode OTP tidak valid atau sudah kedaluwarsa.']);
        }

        // Verifikasi berhasil
        $user->update([
            'email_verified_at' => now(),
            'otp_code' => null, // Bersihkan OTP
            'otp_expires_at' => null,
        ]);

        $request->session()->forget('otp_email');

        // Langsung login user tersebut
        Auth::login($user);

        return redirect()->route('siswa.dashboard')->with('status', 'Akun berhasil diverifikasi.');
    }

    /**
     * Mengirim ulang kode OTP.
     */
    public function resend(Request $request)
    {
        $email = $request->session()->get('otp_email');
        if (!$email) {
            return redirect()->route('login')->withErrors(['otp' => 'Sesi kedaluwarsa. Silakan login kembali.']);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return redirect()->route('login');
        }

        // Generate OTP baru
        $otpCode = random_int(100000, 999999);
        $otpExpiresAt = now()->addMinutes(10);

        $user->update([
            'otp_code' => $otpCode,
            'otp_expires_at' => $otpExpiresAt,
        ]);

        // Kirim ulang
        try {
            Mail::to($user->email)->send(new KirimOtp($otpCode));
        } catch (\Exception $e) {
            \Log::error("Gagal mengirim ulang email OTP ke {$user->email}: " . $e->getMessage());
        }

        return back()->with('status', 'Kode OTP baru telah dikirim ke email Anda.');
    }
}
