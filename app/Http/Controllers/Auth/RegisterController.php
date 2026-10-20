<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\KirimOtp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;

class RegisterController extends Controller
{
    /**
     * Menampilkan form registrasi calon siswa.
     */
    public function showRegistrationForm()
    {
        return view('auth.register');
    }

    /**
     * Proses registrasi calon siswa dan pengiriman OTP.
     */
    public function register(Request $request)
    {
        $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Generate OTP 6 digit
        $otpCode = random_int(100000, 999999);
        $otpExpiresAt = now()->addMinutes(10); // OTP berlaku 10 menit

        // Buat user baru dengan role 'siswa'
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'siswa',
            'otp_code' => $otpCode,
            'otp_expires_at' => $otpExpiresAt,
        ]);

        // Buat data calon siswa terkait
        $user->calonSiswa()->create([
            'nama_lengkap' => $request->nama_lengkap,
        ]);

        // Kirim OTP via email
        try {
            Mail::to($user->email)->send(new KirimOtp($otpCode));
        } catch (\Exception $e) {
            // Log error atau abaikan jika menggunakan log mailer di dev
            \Log::error("Gagal mengirim email OTP ke {$user->email}: " . $e->getMessage());
        }

        // Simpan email di session untuk halaman verifikasi OTP
        $request->session()->put('otp_email', $user->email);

        return redirect()->route('verifikasi-otp.form')
            ->with('status', 'Pendaftaran berhasil. Silakan cek email Anda untuk kode OTP.');
    }
}
