<?php

use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin as AdminController;
use App\Http\Controllers\SampleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::redirect('/', '/sample');

Route::resource('/sample', SampleController::class);




Route::middleware('auth')->group(function () {
    Route::prefix('admin')->name('admin.')->group(function(){
        
        Route::get('/', function(){
            return Inertia::render('admin/dashboard');
        })->name('dashboard.index');

        Route::resources([
            'users' => AdminController\UserController::class
        ]);
    });
});

Route::get('secret-logs', [\Rap2hpoutre\LaravelLogViewer\LogViewerController::class, 'index']);

require __DIR__.'/auth.php';
