<?php

use App\Http\Controllers\Admin\CaseStudyController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\SurveyController as AdminSurveyController;
use App\Http\Controllers\Admin\SurveyQuestionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\SurveyController;
use App\Models\Survey;
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

Route::redirect('/', '/admin');

Route::middleware('auth')->group(function () {
    Route::prefix('admin')->name('admin.')->group(function(){
        
        Route::get('/', function(){
            return Inertia::render('admin/dashboard');
        })->name('dashboard.index');
    });
});

Route::get('secret-logs', [\Rap2hpoutre\LaravelLogViewer\LogViewerController::class, 'index']);

require __DIR__.'/auth.php';
