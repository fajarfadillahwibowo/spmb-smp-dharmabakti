<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekapitulasi Data Diri Calon Siswa Baru - SMP Dharma Bakti</title>
    <style>
        @page {
            margin: 12mm 10mm 14mm 10mm;
            size: a4 landscape;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 8pt;
            color: #111827;
            margin: 0;
            padding: 0;
            line-height: 1.25;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            border: none;
            margin-bottom: 0;
        }
        .header-table td {
            border: none;
            padding: 0;
        }
        .double-line {
            border-top: 2.5px solid #000;
            border-bottom: 1px solid #000;
            height: 2px;
            margin-top: 6px;
            margin-bottom: 12px;
        }
        .title-block {
            text-align: center;
            margin-bottom: 12px;
        }
        .title-block h2 {
            margin: 0;
            font-size: 11pt;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #1e3a8a;
        }
        .title-block p {
            margin: 2px 0 0 0;
            font-size: 9pt;
            font-weight: bold;
            color: #374151;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
        }
        table.data-table thead {
            display: table-header-group;
        }
        table.data-table th, table.data-table td {
            border: 0.8px solid #374151;
            padding: 4px 3px;
            font-size: 7.5pt;
        }
        table.data-table th {
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
        }
        .text-center {
            text-align: center;
        }
        .text-left {
            text-align: left;
        }
        .text-right {
            text-align: right;
        }
        .status-lulus {
            color: #15803d;
            font-weight: bold;
        }
        .status-gagal {
            color: #b91c1c;
            font-weight: bold;
        }
        .status-lunas {
            color: #0284c7;
            font-weight: bold;
        }
        .footer-table {
            width: 100%;
            border-collapse: collapse;
            border: none;
            page-break-inside: avoid;
            margin-top: 15px;
        }
        .footer-table td {
            border: none;
            padding: 0;
            vertical-align: top;
        }
        .sign-title {
            font-size: 8.5pt;
            margin: 0 0 45px 0;
        }
        .sign-name {
            font-size: 8.5pt;
            font-weight: bold;
            text-decoration: underline;
            margin: 0;
        }
        .sign-nip {
            font-size: 8pt;
            color: #374151;
            margin: 1px 0 0 0;
        }
    </style>
</head>
<body>

    <!-- KOP SURAT RESMI SMP DHARMA BAKTI -->
    <table class="header-table">
        <tr>
            <td style="width: 10%; text-align: center; vertical-align: middle;">
                @if(file_exists(public_path('logo.png')))
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('logo.png'))) }}" style="width: 62px; height: auto;" alt="Logo SMP Dharma Bakti">
                @endif
            </td>
            <td style="width: 90%; text-align: center; vertical-align: middle; padding-left: 8px;">
                <p style="font-weight: bold; font-size: 11pt; margin: 0; color: #1e293b; letter-spacing: 0.5px; text-transform: uppercase;">YAYASAN PENDIDIKAN DHARMA BAKTI</p>
                <h1 style="margin: 2px 0; font-size: 16pt; color: #1e3a8a; font-weight: 900; letter-spacing: 1px;">SMP DHARMA BAKTI</h1>
                <p style="font-weight: bold; font-size: 8.5pt; margin: 1px 0; color: #0f172a;">STATUS TERAKREDITASI &nbsp;&bull;&nbsp; NDS: 2011050007 &nbsp;&bull;&nbsp; NSS: 2011020018 &nbsp;&bull;&nbsp; NPSN: 10609254</p>
                <p style="font-size: 8pt; margin: 1px 0; color: #334155;">Jln. Rambutan, Rt.10 Dusun 2 Desa Suka Maju, Kec. Lempuing Jaya, Kab. Ogan Komering Ilir (OKI), Sumatera Selatan</p>
                <p style="font-size: 7.5pt; margin: 1px 0; color: #334155;">Kode Pos: 30657 &nbsp;|&nbsp; Telepon / WhatsApp: 082185769311 &nbsp;|&nbsp; Email: smpsdb72@gmail.com</p>
            </td>
        </tr>
    </table>

    <div class="double-line"></div>

    <!-- JUDUL DOKUMEN -->
    <div class="title-block">
        <h2>REKAPITULASI DATA DIRI CALON PESERTA DIDIK BARU (BUKU INDUK PPDB)</h2>
        <p>TAHUN PELAJARAN 2026 / 2027</p>
    </div>

    <!-- TABEL DATA LENGKAP -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 2.5%;">No</th>
                <th style="width: 8%;">No. Daftar</th>
                <th style="width: 7.5%;">NISN</th>
                <th style="width: 8.5%;">NIK</th>
                <th style="width: 14%;">Nama Peserta Didik</th>
                <th style="width: 3.5%;">JK</th>
                <th style="width: 13%;">Tempat, Tgl Lahir</th>
                <th style="width: 5%;">Agama</th>
                <th style="width: 11%;">Asal Sekolah</th>
                <th style="width: 12%;">Nama Orang Tua</th>
                <th style="width: 7.5%;">No. HP / WA</th>
                <th style="width: 7.5%;">Seleksi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($pendaftarans as $index => $p)
                @php
                    $cs = $p->calonSiswa;
                    $jk = ($cs?->jenis_kelamin === 'Perempuan' || $cs?->jenis_kelamin === 'PR') ? 'PR' : 'LK';

                    // TTL format
                    $ttl = '-';
                    if ($cs?->tempat_lahir || $cs?->tanggal_lahir) {
                        $tempat = strtoupper(trim($cs->tempat_lahir ?: '-'));
                        if ($cs->tanggal_lahir) {
                            $tgl = \Carbon\Carbon::parse($cs->tanggal_lahir)->translatedFormat('d M Y');
                            $ttl = $tempat . ', ' . $tgl;
                        } else {
                            $ttl = $tempat;
                        }
                    }

                    // Nama ortu
                    $ayah = $cs?->nama_ayah ? strtoupper(trim($cs->nama_ayah)) : '';
                    $ibu = $cs?->nama_ibu ? strtoupper(trim($cs->nama_ibu)) : '';
                    if ($ayah && $ibu) {
                        $ortu = "A: $ayah / I: $ibu";
                    } elseif ($ayah) {
                        $ortu = "A: $ayah";
                    } elseif ($ibu) {
                        $ortu = "I: $ibu";
                    } else {
                        $ortu = '-';
                    }
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center" style="font-weight: bold; font-size: 7pt;">{{ $p->nomor_pendaftaran }}</td>
                    <td class="text-center">{{ $cs?->nisn ?? '-' }}</td>
                    <td class="text-center">{{ $cs?->nik ?? '-' }}</td>
                    <td class="text-left" style="font-weight: bold;">{{ strtoupper($cs?->nama_lengkap ?? '-') }}</td>
                    <td class="text-center">{{ $jk }}</td>
                    <td class="text-left">{{ $ttl }}</td>
                    <td class="text-center">{{ strtoupper($cs?->agama ?? 'ISLAM') }}</td>
                    <td class="text-left">{{ strtoupper($p->asal_sekolah ?? '-') }}</td>
                    <td class="text-left" style="font-size: 7pt;">{{ $ortu }}</td>
                    <td class="text-center">{{ $cs?->no_hp_ortu ?? '-' }}</td>
                    <td class="text-center">
                        @if($p->seleksi && $p->seleksi->status_seleksi == 'diterima')
                            <span class="status-lulus">LULUS ({{ $p->seleksi->nilai_seleksi }})</span>
                        @elseif($p->seleksi && $p->seleksi->status_seleksi == 'tidak_diterima')
                            <span class="status-gagal">TIDAK LULUS</span>
                        @else
                            <span style="color: #64748b;">MENUNGGU</span>
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="12" class="text-center" style="padding: 12px;">Tidak ada data calon peserta didik baru.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- TANDA TANGAN RESMI PENGESAHAN LAPORAN (KETUA PANITIA SPMB) -->
    <table class="footer-table">
        <tr>
            <td style="width: 65%;"></td>
            <td style="width: 35%; text-align: center;">
                <p class="sign-title">
                    Sukamaju, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2026<br>
                    Ketua Panitia SPMB,
                </p>
                <div style="height: 55px;"></div>
                <p class="sign-name">Ngaisah Maisaroh S. Pd.</p>
            </td>
        </tr>
    </table>

</body>
</html>
