<?php

/*
|--------------------------------------------------------------------------
| Konfigurasi CORS (Cross-Origin Resource Sharing)
|--------------------------------------------------------------------------
| Pengaturan ini memungkinkan aplikasi React Native mengakses API Laravel
| dari device yang berbeda (HP/emulator) di jaringan yang sama.
|
| Untuk produksi, ganti 'allowed_origins' dengan domain server yang tepat.
*/

return [

    /*
    |--------------------------------------------------------------------------
    | Path yang diizinkan CORS
    |--------------------------------------------------------------------------
    | Hanya path API yang dibuka untuk CORS, bukan seluruh aplikasi web.
    */
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    /*
    |--------------------------------------------------------------------------
    | Metode HTTP yang diizinkan
    |--------------------------------------------------------------------------
    */
    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Origin yang diizinkan
    |--------------------------------------------------------------------------
    | Untuk development: izinkan semua origin ('*').
    | Untuk produksi: ganti dengan URL spesifik.
    */
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    /*
    |--------------------------------------------------------------------------
    | Header yang diizinkan
    |--------------------------------------------------------------------------
    */
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | Credentials
    |--------------------------------------------------------------------------
    | Set ke false untuk token-based auth (Sanctum).
    | Cookies tidak digunakan di mobile app.
    */
    'supports_credentials' => false,

];
