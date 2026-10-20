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

    <div class="header">
        <h1>PANITIA SPMB SMP DHARMA BAKTI</h1>
        <p>Jl. Pendidikan No. 123, Kota Pelajar, Provinsi Ilmu</p>
        <p>Telp: (021) 1234567 | Email: spmb@smpdharmbakti.sch.id | Website: www.smpdharmabakti.sch.id</p>
    </div>

    <div class="title">
        SURAT BUKTI KELULUSAN / PENERIMAAN
    </div>
    
    <div class="stamp">
        LULUS
    </div>

    <div class="content">
        <p>Berdasarkan hasil penilaian dokumen dan seleksi akademik yang diselenggarakan oleh Panitia Seleksi Penerimaan Murid Baru (SPMB) SMP Dharma Bakti Tahun Ajaran 2024/2025, maka dengan ini menyatakan bahwa:</p>

        <table class="table-data">
            <tr>
                <td>Nomor Pendaftaran</td>
                <td>:</td>
                <td><strong>{{ $pendaftaran->nomor_pendaftaran }}</strong></td>
            </tr>
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
                <td>Tempat, Tanggal Lahir</td>
                <td>:</td>
                <td>{{ $calonSiswa->tempat_lahir }}, {{ $calonSiswa->tanggal_lahir->locale('id')->translatedFormat('d F Y') }}</td>
            </tr>
            <tr>
                <td>Asal Sekolah</td>
                <td>:</td>
                <td>{{ $pendaftaran->asal_sekolah }}</td>
            </tr>
            <tr>
                <td>Nilai Seleksi</td>
                <td>:</td>
                <td>{{ $pengumuman->seleksi->nilai_seleksi }}</td>
            </tr>
        </table>

        <p>Dinyatakan <strong>DITERIMA</strong> sebagai siswa/siswi di SMP Dharma Bakti.</p>

        <p>Bagi calon siswa yang telah dinyatakan diterima, diwajibkan untuk segera melakukan proses administrasi pembayaran daftar ulang sesuai dengan ketentuan yang berlaku paling lambat 7 hari setelah surat ini dicetak. Kelalaian dalam melakukan proses daftar ulang dapat mengakibatkan batalnya status penerimaan.</p>
    </div>

    <div class="footer">
        <div class="signature">
            <p>Ditetapkan di Kota Pelajar,</p>
            <p>Tanggal: {{ \Carbon\Carbon::now()->locale('id')->translatedFormat('d F Y') }}</p>
            <br>
            <p><strong>Ketua Panitia SPMB</strong></p>
            <div class="sign-area"></div>
            <p><u>Drs. H. Ahmad Pendidikan, M.Pd</u></p>
            <p>NIP. 19800101 200501 1 001</p>
        </div>
        <div style="clear: both;"></div>
    </div>

</body>
</html>
