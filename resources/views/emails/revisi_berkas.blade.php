<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pemberitahuan Revisi Berkas - SMP Dharma Bakti</title>
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
            background-color: #991b1b;
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
            color: #fecaca;
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
        .alert-badge {
            display: inline-block;
            background-color: #fee2e2;
            color: #b91c1c;
            font-weight: 700;
            font-size: 12px;
            padding: 4px 12px;
            border-radius: 9999px;
            margin-bottom: 16px;
        }
        .rejection-box {
            background: #fff1f2;
            border: 2px dashed #fca5a5;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .rejection-title {
            font-size: 13px;
            font-weight: 700;
            color: #991b1b;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .rejection-text {
            font-size: 14px;
            line-height: 1.6;
            color: #881337;
            white-space: pre-line;
            font-weight: 500;
        }
        .instructions {
            background-color: #f8fafc;
            border-left: 4px solid #f59e0b;
            padding: 14px 16px;
            border-radius: 6px;
            font-size: 13px;
            color: #b45309;
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
            <p>Pemberitahuan Revisi / Perbaikan Berkas Persyaratan</p>
        </div>
        <div class="content">
            <span class="alert-badge">BERKAS PERLU DIPERBAIKI</span>
            <div class="greeting">Halo, {{ $pendaftaran->calonSiswa?->nama_lengkap ?? 'Calon Siswa' }}!</div>
            <p class="desc">
                Panitia SPMB SMP Dharma Bakti telah memeriksa dokumen persyaratan pendaftaran Anda (No. Pendaftaran: <strong>{{ $pendaftaran->nomor_pendaftaran }}</strong>).
            </p>
            <p class="desc">
                Saat ini terdapat beberapa dokumen yang <strong>belum memenuhi kriteria</strong> dan memerlukan perbaikan. Berikut keterangan resmi dari panitia:
            </p>
            
            <div class="rejection-box">
                <div class="rejection-title">📋 Keterangan Berkas yang Perlu Diperbaiki:</div>
                <div class="rejection-text">{{ $catatanVerifikasi }}</div>
            </div>

            <div class="instructions">
                <strong>Langkah Perbaikan:</strong><br>
                1. Buka aplikasi mobile SPMB SMP Dharma Bakti.<br>
                2. Masuk ke menu <strong>Dokumen</strong>.<br>
                3. Klik tombol <strong>Ganti File</strong> pada berkas yang perlu diperbaiki sesuai catatan di atas.<br>
                4. Klik <strong>Simpan & Unggah Berkas</strong> untuk mengirimkan berkas revisi kepada panitia.
            </div>

            <p class="desc" style="font-size: 13px; color: #64748b; margin-bottom: 0;">
                Setelah Anda mengunggah ulang berkas perbaikan, berkas Anda akan otomatis diajukan kembali untuk diverifikasi oleh panitia.
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Panitia SPMB SMP Dharma Bakti. Semua hak dilindungi.
        </div>
    </div>
</body>
</html>
