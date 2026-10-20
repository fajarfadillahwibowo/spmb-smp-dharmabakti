<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Penerimaan Murid Baru</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            color: #333;
            margin: 0;
            padding: 10px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0 0 5px 0;
            font-size: 18px;
            text-transform: uppercase;
        }
        .header p {
            margin: 0;
            font-size: 11px;
        }
        .title {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table, th, td {
            border: 1px solid #000;
        }
        th {
            background-color: #f2f2f2;
            padding: 8px;
            text-align: center;
            font-weight: bold;
        }
        td {
            padding: 6px;
        }
        .text-center {
            text-align: center;
        }
        .status-lulus {
            color: #006600;
            font-weight: bold;
        }
        .status-gagal {
            color: #cc0000;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
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
            height: 60px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>PANITIA SPMB SMP DHARMA BAKTI</h1>
        <p>Jl. Pendidikan No. 123, Kota Pelajar, Provinsi Ilmu | Telp: (021) 1234567</p>
    </div>

    <div class="title">
        LAPORAN REKAPITULASI PENERIMAAN MURID BARU<br>
        TAHUN AJARAN {{ date('Y') }}/{{ date('Y', strtotime('+1 year')) }}
    </div>

    <table>
        <thead>
            <tr>
                <th width="3%">No</th>
                <th width="12%">No Pendaftaran</th>
                <th width="20%">Nama Calon Siswa</th>
                <th width="10%">Jenis Kelamin</th>
                <th width="15%">Asal Sekolah</th>
                <th width="15%">Status Berkas</th>
                <th width="12%">Hasil Seleksi</th>
                <th width="13%">Daftar Ulang (Keuangan)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($pendaftarans as $index => $p)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td class="text-center">{{ $p->nomor_pendaftaran }}</td>
                <td>{{ $p->calonSiswa->nama_lengkap }}</td>
                <td class="text-center">{{ $p->calonSiswa->jenis_kelamin }}</td>
                <td>{{ $p->asal_sekolah ?? '-' }}</td>
                <td class="text-center">
                    @if($p->status_pendaftaran == 'terverifikasi')
                        Terverifikasi
                    @elseif($p->status_pendaftaran == 'menunggu_verifikasi')
                        Menunggu Verif
                    @else
                        {{ ucwords(str_replace('_', ' ', $p->status_pendaftaran)) }}
                    @endif
                </td>
                <td class="text-center">
                    @if($p->seleksi && $p->seleksi->status_seleksi == 'diterima')
                        <span class="status-lulus">Lulus ({{ $p->seleksi->nilai_seleksi }})</span>
                    @elseif($p->seleksi && $p->seleksi->status_seleksi == 'tidak_diterima')
                        <span class="status-gagal">Tidak Lulus</span>
                    @else
                        Belum
                    @endif
                </td>
                <td class="text-center">
                    @if($p->pembayaran)
                        @if($p->pembayaran->status_pembayaran == 'lunas')
                            Lunas
                        @elseif($p->pembayaran->status_pembayaran == 'cicilan')
                            Cicilan
                        @else
                            {{ ucwords(str_replace('_', ' ', $p->pembayaran->status_pembayaran)) }}
                        @endif
                    @else
                        Belum
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" class="text-center">Tidak ada data pendaftar.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <p><em>* Laporan dicetak pada: {{ date('d F Y H:i:s') }}</em></p>

    <div class="footer">
        <div class="signature">
            <p>Kepala Sekolah,</p>
            <div class="sign-area"></div>
            <p><u>Drs. Budi Santoso, M.Si</u></p>
            <p>NIP. 19750505 200012 1 002</p>
        </div>
        <div style="clear: both;"></div>
    </div>

</body>
</html>
