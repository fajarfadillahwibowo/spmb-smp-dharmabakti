<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Kartu Ujian Seleksi - {{ $pendaftaran->nomor_pendaftaran }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.5;
            margin: 0;
            padding: 20px;
        }
        .container {
            border: 2px solid #1e293b;
            padding: 2px;
        }
        .inner-container {
            border: 1px solid #1e293b;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #1e293b;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0 0 5px 0;
            font-size: 20px;
            text-transform: uppercase;
        }
        .header p {
            margin: 0;
            font-size: 12px;
            color: #555;
        }
        .title {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 20px;
            text-transform: uppercase;
            text-decoration: underline;
        }
        .card-no {
            text-align: center;
            font-size: 14px;
            margin-bottom: 25px;
        }
        .card-no strong {
            font-size: 18px;
            background-color: #f1f5f9;
            padding: 5px 15px;
            border: 1px dashed #cbd5e1;
        }
        .content-wrap {
            width: 100%;
            margin-bottom: 30px;
        }
        .table-data {
            width: 75%;
            float: left;
            border-collapse: collapse;
        }
        .table-data td {
            padding: 6px 0;
            vertical-align: top;
            font-size: 14px;
        }
        .table-data td:first-child {
            width: 35%;
            font-weight: bold;
        }
        .table-data td:nth-child(2) {
            width: 5%;
        }
        .photo-area {
            width: 20%;
            float: right;
            text-align: center;
        }
        .photo-box {
            width: 3cm;
            height: 4cm;
            border: 1px solid #999;
            margin: 0 auto;
            line-height: 4cm;
            text-align: center;
            color: #999;
            font-size: 12px;
            background-color: #f8fafc;
        }
        .clear {
            clear: both;
        }
        .exam-info {
            margin-top: 20px;
            border: 1px solid #cbd5e1;
            padding: 15px;
            background-color: #f8fafc;
        }
        .exam-info h4 {
            margin: 0 0 10px 0;
            font-size: 14px;
        }
        .exam-info table td {
            font-size: 14px;
            padding: 3px 0;
        }
        .rules {
            margin-top: 20px;
            font-size: 12px;
        }
        .rules h4 {
            margin: 0 0 5px 0;
        }
        .rules ol {
            margin: 0;
            padding-left: 20px;
        }
        .rules li {
            margin-bottom: 3px;
        }
        .footer {
            margin-top: 30px;
            width: 100%;
        }
        .signature {
            float: right;
            text-align: center;
            width: 250px;
            font-size: 14px;
        }
        .signature p {
            margin: 0;
        }
        .sign-area {
            height: 70px;
        }
        .watermark {
            position: absolute;
            top: 40%;
            left: 25%;
            color: #f1f5f9;
            font-size: 80px;
            font-weight: bold;
            transform: rotate(-30deg);
            z-index: -1;
            opacity: 0.5;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="inner-container relative">
            <div class="watermark">KARTU UJIAN</div>
            
            <div class="header">
                <h1>PANITIA SPMB SMP DHARMA BAKTI</h1>
                <p>Jl. Pendidikan No. 123, Kota Pelajar, Provinsi Ilmu</p>
                <p>Telp: (021) 1234567 | Website: www.smpdharmabakti.sch.id</p>
            </div>

            <div class="title">
                KARTU UJIAN SELEKSI MASUK
            </div>
            
            <div class="card-no">
                No. Ujian: <br><br><strong>{{ $pendaftaran->nomor_pendaftaran }}</strong>
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
                        <td>Asal Sekolah</td>
                        <td>:</td>
                        <td>{{ $pendaftaran->asal_sekolah }}</td>
                    </tr>
                    <tr>
                        <td>Jenis Kelamin</td>
                        <td>:</td>
                        <td>{{ $calonSiswa->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                    </tr>
                    <tr>
                        <td>Tanggal Daftar</td>
                        <td>:</td>
                        <td>{{ $pendaftaran->tanggal_daftar->locale('id')->translatedFormat('d F Y') }}</td>
                    </tr>
                </table>
                
                <div class="photo-area">
                    <div class="photo-box">
                        Pas Foto<br>3 x 4
                    </div>
                </div>
                <div class="clear"></div>
            </div>

            <div class="exam-info">
                <h4>JADWAL UJIAN SELEKSI OFFLINE</h4>
                <table style="width: 100%;">
                    <tr>
                        <td style="width: 25%;"><strong>Tanggal Ujian</strong></td>
                        <td style="width: 5%;">:</td>
                        <td>{{ $seleksi->tanggal_seleksi ? $seleksi->tanggal_seleksi->locale('id')->translatedFormat('l, d F Y') : '-' }}</td>
                    </tr>
                    <tr>
                        <td><strong>Waktu</strong></td>
                        <td>:</td>
                        <td>08.00 WIB - Selesai</td>
                    </tr>
                    <tr>
                        <td><strong>Lokasi</strong></td>
                        <td>:</td>
                        <td>Gedung Utama SMP Dharma Bakti</td>
                    </tr>
                </table>
            </div>

            <div class="rules">
                <h4>TATA TERTIB PESERTA UJIAN:</h4>
                <ol>
                    <li>Peserta diwajibkan membawa <strong>Kartu Ujian</strong> ini pada saat pelaksanaan seleksi.</li>
                    <li>Peserta hadir paling lambat 30 menit sebelum ujian dimulai.</li>
                    <li>Membawa alat tulis (Pensil 2B, Penghapus, Rautan, dan Papan Ujian).</li>
                    <li>Mengenakan pakaian seragam asal sekolah yang rapi dan bersepatu.</li>
                    <li>Peserta yang terlambat lebih dari 30 menit tidak diperkenankan mengikuti ujian.</li>
                </ol>
            </div>

            <div class="footer">
                <div class="signature">
                    <p>Panitia Seleksi,</p>
                    <div class="sign-area"></div>
                    <p>_______________________</p>
                    <p><em>Tanda Tangan & Stempel</em></p>
                </div>
                <div class="clear"></div>
            </div>
        </div>
    </div>

</body>
</html>
