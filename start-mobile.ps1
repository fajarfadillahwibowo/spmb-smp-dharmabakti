# =============================================================
# SPMB Mobile - Start Server untuk Akses dari HP via Hotspot
# =============================================================
# Cara pakai:
# 1. Aktifkan hotspot di HP
# 2. Sambungkan laptop ke hotspot HP
# 3. Jalankan script ini di PowerShell
# =============================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SPMB Mobile - Server Starter" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --- 1. Deteksi IP laptop saat ini ---
$ip = $null
try {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object {
        $_.IPAddress -notlike "127.*" -and
        $_.IPAddress -notlike "169.254.*" -and
        $_.PrefixOrigin -ne "WellKnown"
    } | Select-Object -First 1).IPAddress
} catch {}

if (-not $ip) {
    $ip = (ipconfig | Select-String "IPv4 Address" | ForEach-Object { ($_ -split ":")[1].Trim() } | Where-Object { $_ -notlike "127.*" -and $_ -notlike "169.254.*" } | Select-Object -First 1)
}

if (-not $ip) {
    Write-Host "[ERROR] Tidak bisa mendeteksi IP. Pastikan laptop sudah terhubung ke WiFi / hotspot HP!" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] IP Laptop terdeteksi: $ip" -ForegroundColor Green

# --- 2. Update WIFI_IP di config.js ---
$configPath = "$PSScriptRoot\mobile\src\config.js"
$configContent = Get-Content $configPath -Raw
$updatedConfig = $configContent -replace "const WIFI_IP = '[^']*';", "const WIFI_IP = '$ip';"
Set-Content $configPath $updatedConfig -NoNewline
Write-Host "[OK] config.js diupdate: WIFI_IP = '$ip'" -ForegroundColor Green

# --- 3. Tampilkan URL yang bisa dibuka di HP ---
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Buka URL ini di browser HP kamu:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  http://$ip`:8081" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host ""
Write-Host "  (Pastikan Laravel juga jalan di port 8000)" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# --- 4. Cek apakah MySQL sudah jalan ---
$mysqlRunning = netstat -ano | findstr ":3306" | findstr "LISTENING"
if ($mysqlRunning) {
    Write-Host "[OK] MySQL sudah berjalan di port 3306" -ForegroundColor Green
} else {
    Write-Host "[INFO] Menjalankan MySQL Laragon..." -ForegroundColor Cyan
    Start-Process "C:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysqld.exe" -WindowStyle Hidden
    Start-Sleep -Seconds 2
}

# --- 5. Cek apakah Expo web sudah jalan ---
$expoRunning = netstat -ano | findstr ":8081" | findstr "LISTENING"
if ($expoRunning) {
    Write-Host "[OK] Expo Web sudah berjalan di port 8081" -ForegroundColor Green
} else {
    Write-Host "[INFO] Menjalankan Expo Web Server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\mobile'; npx expo start --web --host lan" -WindowStyle Normal
}

# --- 6. Cek apakah Laravel sudah jalan ---
$laravelRunning = netstat -ano | findstr ":8000" | findstr "LISTENING"
if ($laravelRunning) {
    Write-Host "[OK] Laravel sudah berjalan di port 8000" -ForegroundColor Green
} else {
    Write-Host "[INFO] Menjalankan Laravel Server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; C:\laragon\bin\php\php-8.2.34-Win32-vs16-x64\php.exe artisan serve --host=0.0.0.0 --port=8000" -WindowStyle Normal
}

Write-Host ""
Write-Host "[SELESAI] Server siap! Buka browser di HP dan akses:" -ForegroundColor Green
Write-Host "  http://$ip`:8081" -ForegroundColor Cyan
Write-Host ""
