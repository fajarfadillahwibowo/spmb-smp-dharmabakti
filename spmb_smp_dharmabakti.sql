-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 20, 2026 at 11:55 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spmb_smp_dharmabakti`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id_admin` bigint UNSIGNED NOT NULL,
  `id_user` bigint UNSIGNED NOT NULL,
  `nama_admin` varchar(255) NOT NULL,
  `nip_nik` varchar(255) DEFAULT NULL,
  `no_hp` varchar(255) DEFAULT NULL,
  `jabatan` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id_admin`, `id_user`, `nama_admin`, `nip_nik`, `no_hp`, `jabatan`, `created_at`, `updated_at`) VALUES
(1, 1, 'Administrator', NULL, '081234567890', NULL, '2026-09-28 09:50:52', '2026-09-28 09:50:52');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `calon_siswas`
--

CREATE TABLE `calon_siswas` (
  `id_calon_siswa` bigint UNSIGNED NOT NULL,
  `id_user` bigint UNSIGNED NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `nisn` varchar(255) DEFAULT NULL,
  `tempat_lahir` varchar(255) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') DEFAULT NULL,
  `alamat` text,
  `nama_ortu_wali` varchar(255) DEFAULT NULL,
  `no_hp_ortu` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `calon_siswas`
--

INSERT INTO `calon_siswas` (`id_calon_siswa`, `id_user`, `nama_lengkap`, `nisn`, `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `nama_ortu_wali`, `no_hp_ortu`, `created_at`, `updated_at`) VALUES
(1, 2, 'Siswa Pendaftar Demo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 09:50:53', '2026-09-28 09:50:53'),
(2, 4, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 11:38:26', '2026-09-28 11:38:26'),
(3, 5, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 11:42:28', '2026-09-28 11:42:28'),
(4, 6, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 14:50:24', '2026-09-28 14:50:24'),
(5, 7, 'Saputra', '0081234567', 'medan', '2013-01-17', 'Laki-laki', 'simalungun', 'yanto', '085000001111', '2026-09-28 15:08:05', '2026-10-01 09:17:16');

-- --------------------------------------------------------

--
-- Table structure for table `dokumens`
--

CREATE TABLE `dokumens` (
  `id_dokumen` bigint UNSIGNED NOT NULL,
  `id_pendaftaran` bigint UNSIGNED NOT NULL,
  `akte_kelahiran` varchar(255) DEFAULT NULL,
  `kartu_keluarga` varchar(255) DEFAULT NULL,
  `pasfoto` varchar(255) DEFAULT NULL,
  `ijazah` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dokumens`
--

INSERT INTO `dokumens` (`id_dokumen`, `id_pendaftaran`, `akte_kelahiran`, `kartu_keluarga`, `pasfoto`, `ijazah`, `created_at`, `updated_at`) VALUES
(1, 1, 'dokumen/SPMB-2026-0001/OCRzCAGNzlif3eEh4ANzic2gUrGeglusremoQWCq.png', 'dokumen/SPMB-2026-0001/8CjGGXfSjZqE5hokYR4JuRjFGVlRMDZxPEEfbuQY.png', 'dokumen/SPMB-2026-0001/4mGExL5OUDbXhyGp3SpKMuC8AOZToQ3PUmkn7WTG.png', 'dokumen/SPMB-2026-0001/9nkh94RTcCEAXzetbz2rsYjoKIfdtUXCRn9OLu9v.png', '2026-10-01 09:44:19', '2026-10-01 10:49:08');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_01_01_000001_create_admins_table', 1),
(5, '2024_01_01_000002_create_calon_siswas_table', 1),
(6, '2024_01_01_000003_create_pendaftarans_table', 1),
(7, '2024_01_01_000004_create_dokumens_table', 1),
(8, '2024_01_01_000005_create_seleksis_table', 1),
(9, '2024_01_01_000006_create_pengumumans_table', 1),
(10, '2024_01_01_000007_create_pembayarans_table', 1),
(11, '2026_09_02_202910_create_personal_access_tokens_table', 1),
(12, '2026_09_03_200346_add_ditolak_to_status_pembayaran_enum', 1),
(13, '2026_09_03_210000_add_kepala_sekolah_to_users_role', 1),
(14, '2026_10_04_200000_add_verification_and_exam_schedule_fields', 2);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pembayarans`
--

CREATE TABLE `pembayarans` (
  `id_pembayaran` bigint UNSIGNED NOT NULL,
  `id_pendaftaran` bigint UNSIGNED NOT NULL,
  `bukti_pembayaran` varchar(255) DEFAULT NULL,
  `tanggal_upload` date DEFAULT NULL,
  `status_pembayaran` enum('belum_bayar','menunggu','cicilan','lunas','ditolak') DEFAULT 'belum_bayar',
  `catatan_admin` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pendaftarans`
--

CREATE TABLE `pendaftarans` (
  `id_pendaftaran` bigint UNSIGNED NOT NULL,
  `id_calon_siswa` bigint UNSIGNED NOT NULL,
  `nomor_pendaftaran` varchar(255) NOT NULL,
  `tanggal_daftar` date NOT NULL,
  `asal_sekolah` varchar(255) DEFAULT NULL,
  `status_pendaftaran` enum('belum_lengkap','menunggu_verifikasi','terverifikasi','ditolak') NOT NULL DEFAULT 'belum_lengkap',
  `catatan_verifikasi` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pendaftarans`
--

INSERT INTO `pendaftarans` (`id_pendaftaran`, `id_calon_siswa`, `nomor_pendaftaran`, `tanggal_daftar`, `asal_sekolah`, `status_pendaftaran`, `catatan_verifikasi`, `created_at`, `updated_at`) VALUES
(1, 5, 'SPMB-2026-0001', '2026-10-01', 'SDN 1 SIMALUNGUN', 'menunggu_verifikasi', NULL, '2026-10-01 08:56:13', '2026-10-04 13:06:34');

-- --------------------------------------------------------

--
-- Table structure for table `pengumumans`
--

CREATE TABLE `pengumumans` (
  `id_pengumuman` bigint UNSIGNED NOT NULL,
  `id_seleksi` bigint UNSIGNED NOT NULL,
  `hasil_pendaftaran` varchar(255) NOT NULL,
  `tanggal_pengumuman` date NOT NULL,
  `cetak_bukti` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seleksis`
--

CREATE TABLE `seleksis` (
  `id_seleksi` bigint UNSIGNED NOT NULL,
  `id_pendaftaran` bigint UNSIGNED NOT NULL,
  `tanggal_seleksi` date DEFAULT NULL,
  `waktu_seleksi` varchar(100) DEFAULT NULL,
  `tempat_seleksi` varchar(255) DEFAULT NULL,
  `nilai_seleksi` decimal(5,2) DEFAULT NULL,
  `status_seleksi` enum('menunggu','diterima','tidak_diterima') NOT NULL DEFAULT 'menunggu',
  `catatan` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `payload` longtext NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('2BeOSmptjyOXeKnwGVCXPiC8y7fJeIZBPF3FQqM5', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9444', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQXhoMG44VmJENEZXTzlOMWtqeDBPd1RSY3FFY2lNQ0t1VUV1UmFybCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9yZWdpc3RlciI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790843614),
('35cJN0LBsRv7Z3h7EBGgP7savGzCqzMUVERQcix6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9444', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZnBkc2ZBMUZ0elF6dkNJak95NTF4N0UybjNNUkNRUXNNWEVOdHpNNyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790594352),
('5Cmwp0obmK1EICP5UC8m9l7YXY5KTB3Z9JVSKUPo', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidlIxTXZOQlpWYm45RnNYWW9WVWhYV1J5ZFhjYkhlUVI0ck9hc0ttWSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790844278),
('aUeqQfhpgxrmEPgmQEh1hZs1IuIG9lzr8zrVfokP', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9444', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSWc5aW9sdXVQTjFQNndXMFVaVENhbUFNVDB3ZjZSOXdVNEZORVBVRiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790843483),
('CRBYwJpnzP0KofDss3DVyS0LEh6rBnEDzKbH6SD7', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36 Edg/153.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTzRHZFlYNjhmVWczanJYY2s4TGpZTGpxaWFqNWlxM2o3ZWpnZEdKNSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790589272),
('EBoy5irw0o04pIA3QKapZwRCDRgxFBCg3jxh7kHw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9444', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYk5pejd1VFBnWXRuSzBaRmdWM0Q2U3RKcWRXckhLbUxUMG5xNldzeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790851529),
('hvOKOMgVA95G0viExib8I9g1Ds3vwyXJsi4OIRuk', NULL, '127.0.0.1', 'curl/8.21.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiN0Znc2RLRFJwZ3Q5Y0hyR0JURjZFRGJGamo2ODl3enQyc2JmSUM1aCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1791035355),
('i5zJzqfSRTEXplDrwHA3uQkSEAR81Vllnvm8uQZZ', NULL, '127.0.0.1', 'curl/8.21.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiWEUxdkc2cHZ4OWdhUVVSOEpZb0lRZEtEV0FWZFdEd3pCamRKN3FCYyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1790589216),
('jojkTQIPsVmZcNcuc7cQhevIuozBjKssdDLPUsdm', NULL, '127.0.0.1', 'curl/8.21.0', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNHhkZ3d2VFRKOFIxTXh1RUlZcGdWNGlJWXpMRk00Y0x2amNIYVR1WCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1790589234),
('k9uoJ9vI98pI9PedkCGGxaZtluEQCdC0UKUQstTL', NULL, '10.153.208.184', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9444', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUm5GSndWVEozSW1ac1VEYWRhT0ZZTkpiTmN2allUclV1UnFDRFpPdSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjY6Imh0dHA6Ly8xMC4xNTMuMjA4LjE4NDo4MDAwIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1791037654),
('LEhTnHcv5ldYvWd4vfCgbD9Sv4uTYEzU7L1pRylR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9444', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWjhFNjlOajhyZWc5TUFIbE5UcG9RelNsUjNobkY3VGVVQjNHejRqeCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1791035354),
('TG8zIDnVPxjdeRBK97sWVH4V5TPxYDRBE4NSmzIV', NULL, '10.153.208.184', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9444', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRzhTSFZTZ0N3NWRDaGs3T1I2U2JvYVEwN3lpQkpUWE1GR3RUdThPWSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjY6Imh0dHA6Ly8xMC4xNTMuMjA4LjE4NDo4MDAwIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1791263094),
('y7beVV8yH8T9Y8tEmgva0epvM8HPA0aRG1pHrQyp', NULL, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoidHd2VFNLR1pzaUhjbWNYRGRpTWlpU1ljeG0xQk5aZk9rMFRUY2VIRSI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czo0OToiaHR0cDovLzEyNy4wLjAuMTo4MDAxL2FkbWluL2RhdGEtcGVuZGFmdGFyL2V4cG9ydCI7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjQ5OiJodHRwOi8vMTI3LjAuMC4xOjgwMDEvYWRtaW4vZGF0YS1wZW5kYWZ0YXIvZXhwb3J0Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1791265228),
('zRMWkfO1SVjUoj37qkz62syOPaiHI9ie3vHxp4Di', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9444', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoianVNY0pmVEVod0s5ejBObTlWeHRacks0MVExU01FWVBTbDZxZ1RISCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790842168),
('zZY4oETmobue5cni9wGKBD9joLBhvShwLcMGr9iz', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9444', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicE5nNnFPVkpBWGdLR2pJcnpPY2xtbEx5MFc0UldNYVpKNlBYTUl0VCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790843533);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','siswa','kepala_sekolah') NOT NULL DEFAULT 'siswa',
  `foto_profil` varchar(255) DEFAULT NULL,
  `otp_code` varchar(255) DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `name`, `email`, `email_verified_at`, `password`, `role`, `foto_profil`, `otp_code`, `otp_expires_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Administrator', 'admin@smpdharmabakti.sch.id', '2026-09-28 09:50:52', '$2y$12$fGEzt4x3LhB1dSuVl/pGDOGBuMPuujpOm/GypuXOkBEdVsICI4pby', 'admin', NULL, NULL, NULL, NULL, '2026-09-28 09:50:52', '2026-10-06 05:35:56'),
(2, 'siswa', 'Siswa Pendaftar Demo', 'siswa@example.com', '2026-09-28 09:50:53', '$2y$12$6Dq3m9HVGITcMarel6oP3ehKYPxXLFeQLOFC0mRF7yd.inHo8.qfC', 'siswa', NULL, NULL, NULL, NULL, '2026-09-28 09:50:53', '2026-10-04 11:01:52'),
(3, 'kepsek', 'Kepala Sekolah', 'kepsek@smpdharmabakti.sch.id', '2026-09-28 09:50:55', '$2y$12$vrrZFkZGi03I2PTMgjS1xuFaZE.MAO7UyeH2gt71cmksmOXybdxce', 'kepala_sekolah', NULL, NULL, NULL, NULL, '2026-09-28 09:50:55', '2026-10-06 05:41:48'),
(4, 'EBEN', NULL, 'benkrn.17@gmail.com', NULL, '$2y$12$OCh2FkMosx2UzSNT.gWfT.4ijlcLju11Uu4ZlqQ/RHL7wtoBedYGy', 'siswa', NULL, '353141', '2026-09-28 11:49:55', NULL, '2026-09-28 11:38:26', '2026-09-28 11:39:55'),
(5, 'ebenkrn', NULL, 'digitalpro217@gmail.com', NULL, '$2y$12$hVxCt7sJPl4LkkdZCLDIau4eIm14jhyJHlpSg8n.EO0R39lxf.2J2', 'siswa', NULL, '998789', '2026-09-28 15:14:44', NULL, '2026-09-28 11:42:28', '2026-09-28 15:04:44'),
(6, 'ando', NULL, 'benkrn17@gmail.com', '2026-09-28 14:51:18', '$2y$12$8wd2wWn2s6hnZuPF8zqer.Y.sLSc0Hn22h6RJZr.UseWOSUKIL/ge', 'siswa', NULL, NULL, NULL, NULL, '2026-09-28 14:50:24', '2026-09-28 14:51:18'),
(7, 'saputra', 'Saputra', 'bencanvapro217@gmail.com', '2026-09-28 15:08:53', '$2y$12$2T39Y8RDPigzaIrlrgCW0uR2FNvMOuKDfJm.Oh83I6wJFk8//Pz5S', 'siswa', 'profile_photos/nsdlXSjfTfHIRnFFaZpCYQP6Vsm9NyOGN7eiA2Jq.jpg', NULL, NULL, NULL, '2026-09-28 15:08:05', '2026-10-06 05:25:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id_admin`),
  ADD KEY `admins_id_user_foreign` (`id_user`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `calon_siswas`
--
ALTER TABLE `calon_siswas`
  ADD PRIMARY KEY (`id_calon_siswa`),
  ADD KEY `calon_siswas_id_user_foreign` (`id_user`);

--
-- Indexes for table `dokumens`
--
ALTER TABLE `dokumens`
  ADD PRIMARY KEY (`id_dokumen`),
  ADD KEY `dokumens_id_pendaftaran_foreign` (`id_pendaftaran`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `pembayarans`
--
ALTER TABLE `pembayarans`
  ADD PRIMARY KEY (`id_pembayaran`),
  ADD KEY `pembayarans_id_pendaftaran_foreign` (`id_pendaftaran`);

--
-- Indexes for table `pendaftarans`
--
ALTER TABLE `pendaftarans`
  ADD PRIMARY KEY (`id_pendaftaran`),
  ADD UNIQUE KEY `pendaftarans_nomor_pendaftaran_unique` (`nomor_pendaftaran`),
  ADD KEY `pendaftarans_id_calon_siswa_foreign` (`id_calon_siswa`);

--
-- Indexes for table `pengumumans`
--
ALTER TABLE `pengumumans`
  ADD PRIMARY KEY (`id_pengumuman`),
  ADD KEY `pengumumans_id_seleksi_foreign` (`id_seleksi`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `seleksis`
--
ALTER TABLE `seleksis`
  ADD PRIMARY KEY (`id_seleksi`),
  ADD KEY `seleksis_id_pendaftaran_foreign` (`id_pendaftaran`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id_admin` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `calon_siswas`
--
ALTER TABLE `calon_siswas`
  MODIFY `id_calon_siswa` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `dokumens`
--
ALTER TABLE `dokumens`
  MODIFY `id_dokumen` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `pembayarans`
--
ALTER TABLE `pembayarans`
  MODIFY `id_pembayaran` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pendaftarans`
--
ALTER TABLE `pendaftarans`
  MODIFY `id_pendaftaran` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pengumumans`
--
ALTER TABLE `pengumumans`
  MODIFY `id_pengumuman` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT for table `seleksis`
--
ALTER TABLE `seleksis`
  MODIFY `id_seleksi` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `calon_siswas`
--
ALTER TABLE `calon_siswas`
  ADD CONSTRAINT `calon_siswas_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `dokumens`
--
ALTER TABLE `dokumens`
  ADD CONSTRAINT `dokumens_id_pendaftaran_foreign` FOREIGN KEY (`id_pendaftaran`) REFERENCES `pendaftarans` (`id_pendaftaran`) ON DELETE CASCADE;

--
-- Constraints for table `pembayarans`
--
ALTER TABLE `pembayarans`
  ADD CONSTRAINT `pembayarans_id_pendaftaran_foreign` FOREIGN KEY (`id_pendaftaran`) REFERENCES `pendaftarans` (`id_pendaftaran`) ON DELETE CASCADE;

--
-- Constraints for table `pendaftarans`
--
ALTER TABLE `pendaftarans`
  ADD CONSTRAINT `pendaftarans_id_calon_siswa_foreign` FOREIGN KEY (`id_calon_siswa`) REFERENCES `calon_siswas` (`id_calon_siswa`) ON DELETE CASCADE;

--
-- Constraints for table `pengumumans`
--
ALTER TABLE `pengumumans`
  ADD CONSTRAINT `pengumumans_id_seleksi_foreign` FOREIGN KEY (`id_seleksi`) REFERENCES `seleksis` (`id_seleksi`) ON DELETE CASCADE;

--
-- Constraints for table `seleksis`
--
ALTER TABLE `seleksis`
  ADD CONSTRAINT `seleksis_id_pendaftaran_foreign` FOREIGN KEY (`id_pendaftaran`) REFERENCES `pendaftarans` (`id_pendaftaran`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
