<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/tasks', [TaskController::class, 'getAllTasks']);
Route::get('/api/tasks/{id}', [TaskController::class, 'getTaskById']);
Route::put('/api/tasks/{task}', [TaskController::class, 'updateTask']);
Route::post('/api/tasks/create', [TaskController::class, 'createTask']);
Route::delete('/api/tasks/{task}', [TaskController::class, 'deleteTask']);
