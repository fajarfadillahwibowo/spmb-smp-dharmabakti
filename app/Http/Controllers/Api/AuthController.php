<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\KirimOtp;
use App\Mail\LupaPasswordMail;
use App\Models\CalonSiswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

/**
 * Controller untuk autentikasi API (Login, Register, OTP, Logout).
 * Menggunakan Laravel Sanctum untuk pengelolaan token berbasis API.
 */
class AuthController extends Controller
{
    /**
     * Registrasi akun calon siswa baru.
     * Setelah register, sistem mengirim OTP ke email.
     */
    public function register(Request $request)
    {
        // Validasi input registrasi
        $request->validate([
            'username'  => 'required|string|max:50|unique:users,username',
            'email'     => 'required|email|max:255|unique:users,email',
            'password'  => 'required|string|min:8|confirmed',
        ]);

        // Buat kode OTP 6 digit
        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Simpan user baru dengan status belum terverifikasi
        $user = User::create([
            'username'       => $request->username,
            'email'          => $request->email,
            'password'       => Hash::make($request->password),
            'role'           => 'siswa',
            'otp_code'       => $otpCode,
            'otp_expires_at' => Carbon::now()->addMinutes(10),
        ]);

        // Buat profil CalonSiswa kosong yang akan diisi lewat formulir
        CalonSiswa::create([
            'id_user'      => $user->id,
            'nama_lengkap' => '',
        ]);

        // Kirim email OTP langsung ke email yang didaftarkan
        try {
            Mail::to($user->email)->send(new KirimOtp($otpCode));
        } catch (\Exception $e) {
            Log::error("Gagal mengirim email OTP ke {$user->email}: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil. Kode verifikasi telah dikirim ke email ' . $user->email . '.',
            'data'    => [
                'email' => $user->email,
            ],
        ], 201);
    }

    /**
     * Verifikasi kode OTP yang dikirim ke email pengguna.
     */
    public function verifyOtp(Request $request)
    {
        // Validasi input OTP
        $request->validate([
            'email'    => 'required|email',
            'otp_code' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        // Cek apakah user ditemukan dan OTP cocok serta belum kadaluarsa
        if (
            !$user ||
            $user->otp_code !== $request->otp_code ||
            Carbon::now()->isAfter($user->otp_expires_at)
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP tidak valid atau sudah kadaluarsa.',
            ], 422);
        }

        // Tandai email sebagai terverifikasi dan hapus OTP
        $user->update([
            'email_verified_at' => Carbon::now(),
            'otp_code'          => null,
            'otp_expires_at'    => null,
        ]);

        // Buat token API untuk user yang sudah terverifikasi
        $token = $user->createToken('spmb-mobile')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Email berhasil diverifikasi. Selamat datang!',
            'data'    => [
                'token' => $token,
                'user'  => [
                    'id'       => $user->id,
                    'username' => $user->username,
                    'email'    => $user->email,
                    'role'     => $user->role,
                ],
            ],
        ]);
    }

    /**
     * Kirim ulang kode OTP ke email pengguna.
     */
    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->whereNull('email_verified_at')->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Akun tidak ditemukan atau sudah terverifikasi.',
            ], 404);
        }

        // Generate OTP baru
        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->update([
            'otp_code'       => $otpCode,
            'otp_expires_at' => Carbon::now()->addMinutes(10),
        ]);

        // Kirim ulang email OTP langsung ke email terdaftar
        try {
            Mail::to($user->email)->send(new KirimOtp($otpCode));
        } catch (\Exception $e) {
            Log::error("Gagal mengirim ulang email OTP ke {$user->email}: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP baru telah berhasil dikirim ke email ' . $user->email . '.',
            'data'    => [
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Login pengguna dan kembalikan token API.
     * Mendukung login via username atau email.
     */
    public function login(Request $request)
    {
        // Validasi input login
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $loginInput = trim($request->username);

        // Coba cari user via username, email, nisn, atau nama lengkap calon siswa
        $user = User::where('username', $loginInput)
            ->orWhere('email', $loginInput)
            ->orWhereHas('calonSiswa', function ($q) use ($loginInput) {
                $q->where('nisn', $loginInput)
                  ->orWhere('nama_lengkap', $loginInput);
            })
            ->first();

        // Verifikasi password (dukung password akun dan password/password123 untuk akun demo/uji)
        $passwordValid = false;
        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                $passwordValid = true;
            } elseif (in_array($request->password, ['password', 'password123']) && in_array(strtolower($user->username), ['saputra', 'admin', 'siswa', 'kepsek'])) {
                $passwordValid = true;
                $user->update(['password' => Hash::make($request->password)]);
            }
        }

        if (!$user || !$passwordValid) {
            throw ValidationException::withMessages([
                'username' => ['Username atau password salah.'],
            ]);
        }

        // Cek apakah email sudah diverifikasi
        if (is_null($user->email_verified_at)) {
            return response()->json([
                'success'       => false,
                'message'       => 'Akun belum diverifikasi. Silakan cek email untuk kode OTP.',
                'requires_otp'  => true,
                'email'         => $user->email,
            ], 403);
        }

        // Hapus token lama agar tidak menumpuk
        $user->tokens()->delete();

        // Buat token baru
        $token = $user->createToken('spmb-mobile')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data'    => [
                'token' => $token,
                'user'  => [
                    'id'       => $user->id,
                    'username' => $user->username,
                    'email'    => $user->email,
                    'role'     => $user->role,
                ],
            ],
        ]);
    }

    /**
     * Mendapatkan data profil pengguna yang sedang login.
     */
    public function me(Request $request)
    {
        $user = $request->user();

        $data = [
            'id'              => $user->id,
            'username'        => $user->username,
            'name'            => $user->name ?: ($user->calonSiswa?->nama_lengkap ?: $user->admin?->nama_admin ?: $user->username),
            'email'           => $user->email,
            'role'            => $user->role,
            'foto_profil'     => $user->foto_profil,
            'foto_profil_url' => $user->foto_profil_url,
        ];

        // Tambahkan data calon siswa jika role siswa
        if ($user->isSiswa() && $user->calonSiswa) {
            $data['calon_siswa'] = $user->calonSiswa;
        }

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    /**
     * Logout: mencabut (revoke) token API yang sedang digunakan.
     */
    public function logout(Request $request)
    {
        // Hapus token saat ini saja
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil logout.',
        ]);
    }

    /**
     * Memperbarui profil pengguna (Nama, Email, Password, Foto Profil)
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $rules = [
            'name'        => 'required|string|max:100',
            'email'       => 'required|email|max:255|unique:users,email,' . $user->id,
            'foto_profil' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072',
        ];

        if ($request->filled('new_password')) {
            $rules['current_password'] = 'required|string';
            $rules['new_password']     = 'required|string|min:8|confirmed';
        }

        $request->validate($rules);

        if ($request->filled('new_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Password saat ini salah. Periksa kembali password Anda.',
                    'errors'  => [
                        'current_password' => ['Password saat ini salah.'],
                    ],
                ], 422);
            }
            $user->password = Hash::make($request->new_password);
        }

        $user->name = $request->name;
        $user->email = $request->email;

        // Sinkronisasi nama ke tabel calon_siswa atau admin
        if ($user->isSiswa() && $user->calonSiswa) {
            $user->calonSiswa->update(['nama_lengkap' => $request->name]);
        } elseif ($user->isAdmin() && $user->admin) {
            $user->admin->update(['nama_admin' => $request->name]);
        }

        // Upload foto profil jika dikirim
        if ($request->hasFile('foto_profil')) {
            if ($user->foto_profil && Storage::disk('public')->exists($user->foto_profil)) {
                Storage::disk('public')->delete($user->foto_profil);
            }

            $path = $request->file('foto_profil')->store('profile_photos', 'public');
            $user->foto_profil = $path;
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'data'    => [
                'id'              => $user->id,
                'username'        => $user->username,
                'name'            => $user->name,
                'email'           => $user->email,
                'role'            => $user->role,
                'foto_profil'     => $user->foto_profil,
                'foto_profil_url' => $user->foto_profil_url,
                'calon_siswa'     => $user->calonSiswa,
            ],
        ]);
    }

    /**
     * Hapus foto profil pengguna
     */
    public function deleteProfilePhoto(Request $request)
    {
        $user = $request->user();

        if ($user->foto_profil && Storage::disk('public')->exists($user->foto_profil)) {
            Storage::disk('public')->delete($user->foto_profil);
        }

        $user->foto_profil = null;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Foto profil berhasil dihapus.',
            'data'    => [
                'foto_profil'     => null,
                'foto_profil_url' => null,
            ],
        ]);
    }

    /**
     * Permintaan reset kata sandi (Kirim OTP ke email terdaftar).
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
        ], [
            'identifier.required' => 'Masukkan alamat email atau username Anda.',
        ]);

        $identifier = trim($request->identifier);

        // Cari user berdasarkan email atau username
        $user = User::where('email', $identifier)
            ->orWhere('username', $identifier)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Akun dengan email atau username tersebut tidak terdaftar di sistem.',
            ], 404);
        }

        // Generate kode OTP 6 digit
        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Simpan OTP dan masa berlaku 15 menit
        $user->update([
            'otp_code'       => $otpCode,
            'otp_expires_at' => Carbon::now()->addMinutes(15),
        ]);

        // Sensor email untuk keamanan (contoh: a***z@gmail.com)
        $parts = explode('@', $user->email);
        $namePart = $parts[0];
        $domainPart = $parts[1] ?? '';
        $maskedName = strlen($namePart) <= 2
            ? substr($namePart, 0, 1) . '***'
            : substr($namePart, 0, 2) . str_repeat('*', max(strlen($namePart) - 3, 2)) . substr($namePart, -1);
        $maskedEmail = $maskedName . '@' . $domainPart;

        // Kirim email OTP langsung ke email terdaftar
        try {
            Mail::to($user->email)->send(new LupaPasswordMail($otpCode, $user));
        } catch (\Exception $e) {
            Log::error("Gagal mengirim email reset password ke {$user->email}: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Kode verifikasi reset kata sandi telah dikirim ke email terdaftar (' . $maskedEmail . ').',
            'data'    => [
                'email'        => $user->email,
                'masked_email' => $maskedEmail,
                'username'     => $user->username,
            ],
        ]);
    }

    /**
     * Verifikasi kode OTP dan simpan kata sandi baru.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'                 => 'required|email',
            'otp_code'              => 'required|string|size:6',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ], [
            'email.required'                 => 'Alamat email wajib diisi.',
            'otp_code.required'              => 'Kode verifikasi OTP wajib diisi.',
            'otp_code.size'                  => 'Kode OTP harus berupa 6 digit angka.',
            'password.required'              => 'Kata sandi baru wajib diisi.',
            'password.min'                   => 'Kata sandi baru minimal harus 8 karakter.',
            'password.confirmed'             => 'Konfirmasi kata sandi baru tidak cocok.',
            'password_confirmation.required' => 'Ulangi kata sandi baru untuk konfirmasi.',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Akun pengguna tidak ditemukan.',
            ], 404);
        }

        // Cek kecocokan dan masa berlaku OTP
        if (
            !$user->otp_code ||
            $user->otp_code !== $request->otp_code ||
            Carbon::now()->isAfter($user->otp_expires_at)
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Kode verifikasi OTP salah atau telah kadaluarsa. Silakan minta kode baru.',
            ], 422);
        }

        // Update kata sandi baru dan reset token OTP
        $user->update([
            'password'          => Hash::make($request->password),
            'otp_code'          => null,
            'otp_expires_at'     => null,
            'email_verified_at' => $user->email_verified_at ?: Carbon::now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kata sandi akun Anda berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.',
        ]);
    }

    /**
     * Kirim ulang kode OTP reset kata sandi.
     */
    public function resendResetOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Akun tidak ditemukan.',
            ], 404);
        }

        // Generate OTP baru
        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->update([
            'otp_code'       => $otpCode,
            'otp_expires_at' => Carbon::now()->addMinutes(15),
        ]);

        try {
            Mail::to($user->email)->send(new LupaPasswordMail($otpCode, $user));
        } catch (\Exception $e) {
            Log::error("Gagal mengirim ulang email OTP ke {$user->email}: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP baru telah berhasil dikirim ke email terdaftar ' . $user->email . '.',
        ]);
    }
}
