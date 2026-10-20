<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Kata Sandi</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            padding: 20px;
            color: #1e293b;
        }
        .container {
            max-width: 520px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #172554;
            padding: 28px 24px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            font-size: 20px;
            margin: 0;
            letter-spacing: 0.5px;
        }
        .header p {
            color: #93c5fd;
            font-size: 13px;
            margin-top: 6px;
            margin-bottom: 0;
        }
        .content {
            padding: 32px 28px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #0f172a;
        }
        .desc {
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 24px;
        }
        .otp-card {
            background: #eff6ff;
            border: 2px dashed #93c5fd;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-bottom: 24px;
        }
        .otp-label {
            font-size: 12px;
            color: #1e40af;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        .otp-code {
            font-size: 34px;
            font-weight: 800;
            color: #1d4ed8;
            letter-spacing: 8px;
            font-family: monospace;
            margin: 0;
        }
        .otp-exp {
            font-size: 12px;
            color: #64748b;
            margin-top: 8px;
            margin-bottom: 0;
        }
        .warning {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 12px;
            color: #991b1b;
            line-height: 1.5;
            margin-bottom: 24px;
        }
        .footer {
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SMP DHARMA BAKTI</h1>
            <p>Sistem Penerimaan Murid Baru (SPMB)</p>
        </div>
        <div class="content">
            <div class="greeting">
                Halo, {{ $user->name ?: ($user->username ?: 'Pengguna') }}!
            </div>
            <div class="desc">
                Kami menerima permintaan untuk mengatur ulang kata sandi akun SPMB Anda dengan username <strong>{{ $user->username }}</strong>. Gunakan kode verifikasi (OTP) berikut untuk melanjutkan proses reset kata sandi:
            </div>

            <div class="otp-card">
                <div class="otp-label">Kode Verifikasi Reset Kata Sandi</div>
                <div class="otp-code">{{ $otpCode }}</div>
                <p class="otp-exp">Berlaku selama 15 menit ke depan</p>
            </div>

            <div class="warning">
                <strong>Penting:</strong> Jangan berikan kode OTP ini kepada siapapun demi keamanan akun Anda. Jika Anda tidak merasa meminta reset kata sandi, abaikan email ini dan akun Anda tetap aman.
            </div>

            <div class="desc" style="margin-bottom: 0;">
                Salam hangat,<br>
                <strong>Panitia SPMB SMP Dharma Bakti</strong>
            </div>
        </div>
        <div class="footer">
            Email ini dikirim secara otomatis oleh sistem SPMB SMP Dharma Bakti. Mohon jangan membalas email ini secara langsung.
        </div>
    </div>
</body>
</html>
