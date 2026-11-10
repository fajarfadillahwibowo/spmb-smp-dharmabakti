<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kartu Ujian Seleksi - {{ $pendaftaran->nomor_pendaftaran }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1e293b;
            line-height: 1.4;
            margin: 0;
            padding: 15px;
        }
        .container {
            border: 3px solid #1e3a8a;
            padding: 3px;
        }
        .inner-container {
            border: 1px solid #1e3a8a;
            padding: 18px;
            position: relative;
        }
        .header {
            border-bottom: 2px double #1e3a8a;
            padding-bottom: 12px;
            margin-bottom: 16px;
        }
        .logo-box {
            float: left;
            width: 70px;
            text-align: left;
        }
        .header-text {
            margin-left: 80px;
        }
        .header-text h1 {
            margin: 0;
            font-size: 18px;
            color: #1e3a8a;
            text-transform: uppercase;
            font-weight: 800;
            letter-spacing: 0.5px;
        }
        .header-text p {
            margin: 2px 0 0 0;
            font-size: 11px;
            color: #475569;
        }
        .title-badge {
            text-align: center;
            margin: 14px 0 10px 0;
        }
        .title-badge span {
            background-color: #1e3a8a;
            color: #ffffff;
            font-size: 14px;
            font-weight: bold;
            padding: 6px 20px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: inline-block;
        }
        .card-no {
            text-align: center;
            font-size: 13px;
            margin-bottom: 18px;
            color: #334155;
        }
        .card-no strong {
            font-size: 16px;
            background-color: #eff6ff;
            color: #1d4ed8;
            padding: 4px 14px;
            border: 1.5px dashed #3b82f6;
            border-radius: 4px;
            display: inline-block;
            margin-top: 4px;
        }
        .content-wrap {
            width: 100%;
            margin-bottom: 16px;
        }
        .table-data {
            width: 73%;
            float: left;
            border-collapse: collapse;
        }
        .table-data td {
            padding: 5px 0;
            vertical-align: top;
            font-size: 12.5px;
        }
        .table-data td:first-child {
            width: 38%;
            font-weight: bold;
            color: #475569;
        }
        .table-data td:nth-child(2) {
            width: 4%;
            color: #64748b;
        }
        .table-data td:last-child {
            font-weight: 600;
            color: #0f172a;
        }
        .photo-area {
            width: 25%;
            float: right;
            text-align: center;
        }
        .photo-box {
            width: 3cm;
            height: 4cm;
            border: 1.5px solid #94a3b8;
            border-radius: 4px;
            margin: 0 auto;
            text-align: center;
            color: #94a3b8;
            font-size: 11px;
            background-color: #f8fafc;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .photo-img {
            width: 3cm;
            height: 4cm;
        }
        .clear {
            clear: both;
        }
        .exam-info {
            margin-top: 14px;
            border: 1.5px solid #3b82f6;
            border-radius: 6px;
            padding: 12px 16px;
            background-color: #f0fdf4;
        }
        .exam-info h4 {
            margin: 0 0 8px 0;
            font-size: 13px;
            color: #065f46;
            text-transform: uppercase;
            border-bottom: 1px solid #bbf7d0;
            padding-bottom: 4px;
        }
        .exam-info table {
            width: 100%;
            border-collapse: collapse;
        }
        .exam-info table td {
            font-size: 12px;
            padding: 3px 0;
            vertical-align: top;
        }
        .rules {
            margin-top: 14px;
            font-size: 11px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 14px;
        }
        .rules h4 {
            margin: 0 0 6px 0;
            font-size: 11.5px;
            color: #334155;
            text-transform: uppercase;
        }
        .rules ol {
            margin: 0;
            padding-left: 18px;
        }
        .rules li {
            margin-bottom: 2px;
            color: #475569;
        }
        .footer {
            margin-top: 20px;
            width: 100%;
        }
        .signature {
            float: right;
            text-align: center;
            width: 200px;
            font-size: 12px;
        }
        .signature p {
            margin: 0;
        }
        .sign-area {
            height: 50px;
        }
        .security-badge {
            float: left;
            width: 280px;
            font-size: 10px;
            color: #64748b;
            margin-top: 15px;
            border: 1px dashed #cbd5e1;
            padding: 6px 10px;
            border-radius: 4px;
        }
        .watermark {
            position: absolute;
            top: 42%;
            left: 20%;
            color: #1e3a8a;
            font-size: 65px;
            font-weight: 800;
            transform: rotate(-25deg);
            z-index: -1;
            opacity: 0.05;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="inner-container">
            <div class="watermark">KARTU UJIAN</div>
            
            <div class="header">
                @if(file_exists(public_path('logo.png')))
                    <div class="logo-box">
                        <img src="{{ public_path('logo.png') }}" style="width: 55px; height: 55px;" alt="Logo">
                    </div>
                @endif
                <div class="{{ file_exists(public_path('logo.png')) ? 'header-text' : '' }}" style="{{ file_exists(public_path('logo.png')) ? 'padding-top: 14px;' : 'text-align: center;' }}">
                    <h1>PANITIA SPMB SMP DHARMA BAKTI</h1>
                </div>
                <div class="clear"></div>
            </div>

            <div class="title-badge">
                <span>KARTU PESERTA UJIAN SELEKSI</span>
            </div>
            
            <div class="card-no">
                Nomor Peserta Ujian: <br>
                <strong>{{ $pendaftaran->nomor_pendaftaran }}</strong>
            </div>

            <div class="content-wrap">
                <table class="table-data">
                    <tr>
                        <td>Nama Lengkap</td>
                        <td>:</td>
                        <td>{{ $calonSiswa->nama_lengkap }}</td>
                    </tr>
                    <tr>
                        <td>NISN</td>
                        <td>:</td>
                        <td>{{ $calonSiswa->nisn ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td>Tempat, Tgl Lahir</td>
                        <td>:</td>
                        <td>
                            {{ $calonSiswa->tempat_lahir ?? '-' }}, 
                            {{ $calonSiswa->tanggal_lahir ? \Carbon\Carbon::parse($calonSiswa->tanggal_lahir)->locale('id')->translatedFormat('d F Y') : '-' }}
                        </td>
                    </tr>
                    <tr>
                        <td>Asal Sekolah (SD/MI)</td>
                        <td>:</td>
                        <td>{{ $pendaftaran->asal_sekolah }}</td>
                    </tr>
                    <tr>
                        <td>Jenis Kelamin</td>
                        <td>:</td>
                        <td>{{ in_array($calonSiswa->jenis_kelamin, ['L', 'Laki-laki']) ? 'Laki-laki' : 'Perempuan' }}</td>
                    </tr>
                    <tr>
                        <td>Tanggal Pendaftaran</td>
                        <td>:</td>
                        <td>{{ $pendaftaran->tanggal_daftar ? \Carbon\Carbon::parse($pendaftaran->tanggal_daftar)->locale('id')->translatedFormat('d F Y') : date('d F Y') }}</td>
                    </tr>
                </table>
                
                <div class="photo-area">
                    <div class="photo-box">
                        @if($pendaftaran->dokumen && $pendaftaran->dokumen->pasfoto && file_exists(storage_path('app/public/' . $pendaftaran->dokumen->pasfoto)))
                            <img src="{{ storage_path('app/public/' . $pendaftaran->dokumen->pasfoto) }}" class="photo-img" alt="Pasfoto">
                        @else
                            <div style="line-height: 1.5; padding-top: 1.3cm;">
                                <strong>PAS FOTO</strong><br>
                                3 x 4 cm
                            </div>
                        @endif
                    </div>
                </div>
                <div class="clear"></div>
            </div>

            <div class="exam-info">
                <h4>JADWAL & LOKASI UJIAN SELEKSI MASUK</h4>
                <table>
                    <tr>
                        <td style="width: 25%;"><strong>Hari, Tanggal</strong></td>
                        <td style="width: 3%;">:</td>
                        <td><strong>{{ $seleksi && $seleksi->tanggal_seleksi ? \Carbon\Carbon::parse($seleksi->tanggal_seleksi)->locale('id')->translatedFormat('l, d F Y') : 'Menunggu Penetapan Panitia' }}</strong></td>
                    </tr>
                    <tr>
                        <td><strong>Waktu Pelaksanaan</strong></td>
                        <td>:</td>
                        <td>{{ $seleksi->waktu_seleksi ?? '08.00 WIB - 10.00 WIB' }}</td>
                    </tr>
                    <tr>
                        <td><strong>Lokasi / Ruangan</strong></td>
                        <td>:</td>
                        <td>{{ $seleksi->tempat_seleksi ?? 'Ruang Lab CBT / Kampus SMP Dharma Bakti' }}</td>
                    </tr>
                    <tr>
                        <td><strong>Materi Ujian</strong></td>
                        <td>:</td>
                        <td>Tes Potensi Akademik (Matematika, IPA, B. Indonesia) & Wawancara</td>
                    </tr>
                </table>
            </div>

            <div class="rules">
                <h4>TATA TERTIB PESERTA SELEKSI:</h4>
                <ol>
                    <li>Wajib membawa lembar cetak <strong>Kartu Peserta Ujian</strong> ini saat memasuki ruang ujian.</li>
                    <li>Hadir di lokasi ujian paling lambat 15 menit sebelum waktu ujian dimulai.</li>
                    <li>Membawa pensil 2B, penghapus, dan kartu identitas / bukti diri yang sah.</li>
                    <li>Mengenakan pakaian seragam sekolah asal (SD/MI) rapi, sopan, dan bersepatu.</li>
                    <li>Dilarang membawa alat komunikasi / ponsel aktif ke dalam ruang ujian.</li>
                </ol>
            </div>

            <div class="footer">
                <div class="security-badge">
                    <strong>VALIDASI DOKUMEN RESMI SPMB</strong><br>
                    Dokumen ini digenerate secara otomatis oleh sistem SPMB Digital SMP Dharma Bakti dan sah tanpa cap basah.
                </div>

                <div class="signature">
                    <p>Sukamaju, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2026</p>
                    <p>Ketua Panitia SPMB,</p>
                    <div class="sign-area"></div>
                    <p><strong>Ngaisah Maisaroh S. Pd.</strong></p>
                </div>
                <div class="clear"></div>
            </div>
        </div>
    </div>

</body>
</html>
