<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jadwal Tes Seleksi - SMP Dharma Bakti</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            padding: 20px;
            color: #1e293b;
        }
        .container {
            max-width: 560px;
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
            margin-bottom: 20px;
        }
        .success-badge {
            display: inline-block;
            background-color: #dcfce7;
            color: #15803d;
            font-weight: 700;
            font-size: 12px;
            padding: 4px 12px;
            border-radius: 9999px;
            margin-bottom: 16px;
        }
        .schedule-card {
            background: #f8fafc;
            border: 1.5px solid #cbd5e1;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .schedule-row {
            display: flex;
            margin-bottom: 12px;
            border-bottom: 1px dashed #e2e8f0;
            padding-bottom: 10px;
        }
        .schedule-row:last-child {
            margin-bottom: 0;
            border-bottom: none;
            padding-bottom: 0;
        }
        .schedule-label {
            width: 140px;
            font-size: 13px;
            font-weight: 600;
            color: #64748b;
        }
        .schedule-value {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
        }
        .notice {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 14px 16px;
            border-radius: 6px;
            font-size: 13px;
            color: #1e40af;
            line-height: 1.5;
            margin-bottom: 24px;
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SPMB SMP DHARMA BAKTI</h1>
            <p>Pemberitahuan Verifikasi Berkas & Jadwal Seleksi</p>
        </div>
        <div class="content">
            <span class="success-badge">BERKAS TERVERIFIKASI</span>
            <div class="greeting">Halo, {{ $pendaftaran->calonSiswa?->nama_lengkap ?? 'Calon Siswa' }}!</div>
            <p class="desc">
                Selamat! Seluruh berkas pendaftaran Anda telah diperiksa dan <strong>dinyatakan VALID & TERVERIFIKASI</strong> oleh Panitia SPMB SMP Dharma Bakti.
            </p>
            <p class="desc">
                Berikut adalah <strong>Jadwal Pelaksanaan Tes Seleksi Masuk</strong> Anda:
            </p>
            
            <div class="schedule-card">
                <div class="schedule-row">
                    <div class="schedule-label">No. Pendaftaran</div>
                    <div class="schedule-value">{{ $pendaftaran->nomor_pendaftaran }}</div>
                </div>
                <div class="schedule-row">
                    <div class="schedule-label">📅 Tanggal Tes</div>
                    <div class="schedule-value">{{ $seleksi->tanggal_seleksi ? \Carbon\Carbon::parse($seleksi->tanggal_seleksi)->translatedFormat('l, d F Y') : '-' }}</div>
                </div>
                <div class="schedule-row">
                    <div class="schedule-label">⏰ Waktu / Jam</div>
                    <div class="schedule-value">{{ $seleksi->waktu_seleksi ?: '08:00 - Selesai WIB' }}</div>
                </div>
                <div class="schedule-row">
                    <div class="schedule-label">📍 Lokasi / Ruang</div>
                    <div class="schedule-value">{{ $seleksi->tempat_seleksi ?: 'Kampus SMP Dharma Bakti' }}</div>
                </div>
                @if($seleksi->catatan)
                <div class="schedule-row">
                    <div class="schedule-label">📝 Catatan Panitia</div>
                    <div class="schedule-value" style="font-weight: 500; color: #334155;">{{ $seleksi->catatan }}</div>
                </div>
                @endif
            </div>

            <div class="notice">
                <strong>Petunjuk Peserta:</strong><br>
                1. Hadir di lokasi tes minimal 30 menit sebelum jadwal dimulai.<br>
                2. Membawa fotokopi bukti pendaftaran / kartu ujian dan berkas asli persyaratan.<br>
                3. Mengenakan seragam sekolah asal lengkap dan rapi.
            </div>

            <p class="desc" style="font-size: 13px; color: #64748b; margin-bottom: 0;">
                Anda juga dapat melihat rincian jadwal dan kartu peserta ini secara langsung melalui aplikasi mobile SPMB pada tab menu <strong>Seleksi</strong>.
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Panitia SPMB SMP Dharma Bakti. Semua hak dilindungi.
        </div>
    </div>
</body>
</html>
