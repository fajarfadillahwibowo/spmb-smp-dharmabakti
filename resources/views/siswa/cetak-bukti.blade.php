<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Bukti Penerimaan - {{ $pendaftaran->nomor_pendaftaran }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0 0 5px 0;
            font-size: 24px;
            text-transform: uppercase;
        }
        .header p {
            margin: 0;
            font-size: 14px;
            color: #555;
        }
        .title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 30px;
            text-transform: uppercase;
            text-decoration: underline;
        }
        .content {
            margin-bottom: 40px;
        }
        .content p {
            margin-bottom: 15px;
        }
        .table-data {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table-data td {
            padding: 8px 0;
            vertical-align: top;
        }
        .table-data td:first-child {
            width: 30%;
            font-weight: bold;
        }
        .table-data td:nth-child(2) {
            width: 5%;
        }
        .footer {
            margin-top: 50px;
            width: 100%;
        }
        .signature {
            float: right;
            text-align: center;
            width: 250px;
        }
        .signature p {
            margin: 0;
        }
        .sign-area {
            height: 80px;
        }
        .stamp {
            position: absolute;
            top: 50px;
            right: 40px;
            color: #ccc;
            font-size: 40px;
            font-weight: bold;
            border: 4px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            transform: rotate(-15deg);
            z-index: -1;
            opacity: 0.5;
        }
    </style>
</head>
<body>

    <!-- Kop Surat Resmi SMP Dharma Bakti -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 0;">
        <tr>
            <td style="width: 15%; text-align: center; vertical-align: middle; padding: 0;">
                @if(file_exists(public_path('logo.png')))
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('logo.png'))) }}" style="width: 75px; height: auto;" alt="Logo">
                @endif
            </td>
            <td style="width: 85%; text-align: center; vertical-align: middle; padding: 0 10px;">
                <p style="font-weight: bold; font-size: 13px; margin: 0; color: #1e293b; letter-spacing: 0.5px; text-transform: uppercase;">YAYASAN PENDIDIKAN DHARMA BAKTI</p>
                <h1 style="margin: 2px 0; font-size: 21px; color: #1e3a8a; font-weight: 900; letter-spacing: 1px;">SMP DHARMA BAKTI</h1>
                <p style="font-weight: bold; font-size: 10.5px; margin: 1px 0; color: #0f172a;">STATUS TERAKREDITASI &nbsp;&nbsp; NDS: 2011050007 &nbsp; NSS: 2011020018 &nbsp; NPSN: 10609254</p>
                <p style="font-size: 10px; margin: 1px 0; color: #334155;">Jln. Rambutan, Rt.10 dusun 2 Desa Suka Maju Kec. Lempuing Jaya</p>
                <p style="font-size: 9.5px; margin: 1px 0; color: #334155;">Kab. OKI Prop. Sumatera Selatan &nbsp; email: smpsdb72@gmail.com &nbsp; Kode Pos: 30657 &nbsp; Telp: 082185769311</p>
            </td>
        </tr>
    </table>

    <!-- Garis Ganda Resmi Kop Surat -->
    <div style="border-top: 2.5px solid #000; border-bottom: 1px solid #000; height: 2px; margin-top: 8px; margin-bottom: 22px;"></div>

    <div class="title" style="margin-bottom: 25px;">
        <span style="font-size: 16px;">SURAT KETERANGAN KELULUSAN SELEKSI PPDB</span><br>
        <span style="font-size: 11px; font-weight: normal; text-decoration: none;">Nomor: 421.3 / SPMB-SMP.DB / 2026 / {{ $pendaftaran->nomor_pendaftaran }}</span><br>
        <span style="font-size: 11px; font-weight: bold; text-decoration: none; color: #1e3a8a;">TAHUN PELAJARAN 2026 / 2027</span>
    </div>
    
    <div class="stamp">
        LULUS
    </div>

    <div class="content">
        <p>Berdasarkan hasil verifikasi dokumen dan penilaian seleksi akademik yang diselenggarakan oleh Panitia Seleksi Penerimaan Murid Baru (SPMB) SMP Dharma Bakti Tahun Pelajaran 2026 / 2027, dengan ini menerangkan bahwa:</p>

        <table class="table-data">
            <tr>
                <td>Nomor Pendaftaran</td>
                <td>:</td>
                <td><strong>{{ $pendaftaran->nomor_pendaftaran }}</strong></td>
            </tr>
            <tr>
                <td>Nama Lengkap</td>
                <td>:</td>
                <td><strong>{{ $calonSiswa->nama_lengkap }}</strong></td>
            </tr>
            <tr>
                <td>NISN</td>
                <td>:</td>
                <td>{{ $calonSiswa->nisn ?? '-' }}</td>
            </tr>
            <tr>
                <td>Tempat, Tanggal Lahir</td>
                <td>:</td>
                <td>{{ $calonSiswa->tempat_lahir }}, {{ $calonSiswa->tanggal_lahir?->locale('id')->translatedFormat('d F Y') }}</td>
            </tr>
            <tr>
                <td>Jenis Kelamin</td>
                <td>:</td>
                <td>{{ $calonSiswa->jenis_kelamin }}</td>
            </tr>
            <tr>
                <td>Asal Sekolah (SD/MI)</td>
                <td>:</td>
                <td>{{ $pendaftaran->asal_sekolah }}</td>
            </tr>
            <tr>
                <td>Nilai Ujian Seleksi</td>
                <td>:</td>
                <td><strong>{{ $pengumuman?->seleksi?->nilai_seleksi ?? ($pendaftaran->seleksi?->nilai_seleksi ?? '-') }}</strong></td>
            </tr>
        </table>

        <div style="background-color: #ecfdf5; border: 1.5px solid #10b981; border-radius: 6px; padding: 12px; text-align: center; margin: 15px 0;">
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #065f46; letter-spacing: 1px;">
                ★ DINYATAKAN LULUS / DITERIMA ★
            </p>
            <p style="margin: 4px 0 0 0; font-size: 11px; color: #047857;">
                Sebagai Peserta Didik Baru Kelas VII SMP Dharma Bakti Tahun Pelajaran 2026 / 2027
            </p>
        </div>

        <p>Diharapkan kepada calon peserta didik / orang tua/wali murid untuk segera menyelesaikan administrasi pembayaran daftar ulang.</p>
    </div>

    <div class="footer">
        <div class="signature">
            <p>Sukamaju, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2026</p>
            <p>Ketua Panitia SPMB,</p>
            <div class="sign-area"></div>
            <p><strong><u>Ngaisah Maisaroh S. Pd.</u></strong></p>
        </div>
        <div style="clear: both;"></div>
    </div>

</body>
</html>
