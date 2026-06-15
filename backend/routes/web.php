<?php

use Illuminate\Support\Facades\Route;
use Barryvdh\DomPDF\Facade\Pdf;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-pdf', function () {
    $data = ['title' => 'Test Dompdf'];
    $pdf = Pdf::loadView('test-pdf', $data);
    return $pdf->download('test.pdf');
});
