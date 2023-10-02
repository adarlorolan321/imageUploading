<?php

use App\Http\Controllers\Simpro\Api\V1 as SimproApi;
use App\Http\Controllers\TakeFive\Api\V1\TakeFiveController;
use App\Http\Controllers\ServiceReport\Api\V1\ServiceReportController;
use App\Http\Middleware\OAuthMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/upload-ckeditor', function(){
    return response([
        "uploaded" => true, 
        'url' => 'http://15xb.test/img/999-200x300.jpg',
        'src' => 'http://15xb.test/img/999-200x300.jpg',
    ], 201);
});