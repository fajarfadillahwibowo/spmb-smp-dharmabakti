@echo off
echo ========================================
echo   Membuka Firewall untuk SPMB Mobile
echo ========================================
echo.

netsh advfirewall firewall delete rule name="Expo Web 8081" >nul 2>&1
netsh advfirewall firewall delete rule name="Laravel 8000" >nul 2>&1

netsh advfirewall firewall add rule name="Expo Web 8081" dir=in action=allow protocol=TCP localport=8081 profile=any
netsh advfirewall firewall add rule name="Laravel 8000" dir=in action=allow protocol=TCP localport=8000 profile=any

echo.
echo ========================================
echo  SELESAI! Firewall sudah dibuka.
echo    - Port 8081 (Expo)
echo    - Port 8000 (Laravel)
echo  Buka di Chrome HP: http://10.240.214.184:8081
echo ========================================
echo.
pause
