<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

   'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000'], 
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,

    // Patterns d'origines autorisées (laissez vide)
    'allowed_origins_patterns' => [],

    // Headers autorisés
    'allowed_headers' => ['*'],

    // Headers exposés
    'exposed_headers' => [],

    // Durée de cache des pré-vols (en secondes)
    'max_age' => 0,

    // Autoriser les cookies/credentials
    'supports_credentials' => false,
];