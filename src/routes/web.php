<?php

declare(strict_types=1);

use App\Http\Controllers\AddressController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/product/{slug}', ProductController::class)->name('product.show');
Route::get('/category/{slug}', CategoryController::class)->name('category.show');
Route::get('/cart', [\App\Http\Controllers\CartController::class, 'index'])->name('cart.index');

Route::middleware('auth')->group(function () {
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'index'])->name('index');

        Route::get('/edit', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/edit', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');

        Route::resource('addresses', AddressController::class)->except(['show']);

        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    });
});

require __DIR__.'/auth.php';
