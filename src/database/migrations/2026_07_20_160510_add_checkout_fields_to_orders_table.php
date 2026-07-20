<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['shipping_address_id']);
        });

        DB::statement('ALTER TABLE orders MODIFY COLUMN user_id BIGINT UNSIGNED NULL');
        DB::statement('ALTER TABLE orders MODIFY COLUMN shipping_address_id BIGINT UNSIGNED NULL');

        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('shipping_address_id')->references('id')->on('shipping_addresses')->nullOnDelete();

            $table->foreignId('billing_address_id')->nullable()->after('shipping_address_id')
                ->constrained('shipping_addresses')->nullOnDelete();

            $table->json('shipping_address_data')->nullable()->after('billing_address_id');
            $table->json('billing_address_data')->nullable()->after('shipping_address_data');
            $table->string('guest_email')->nullable()->after('billing_address_data');
            $table->string('guest_phone')->nullable()->after('guest_email');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['billing_address_id']);
            $table->dropColumn([
                'billing_address_id',
                'shipping_address_data',
                'billing_address_data',
                'guest_email',
                'guest_phone',
            ]);

            $table->dropForeign(['user_id']);
            $table->dropForeign(['shipping_address_id']);
        });

        DB::statement('ALTER TABLE orders MODIFY COLUMN user_id BIGINT UNSIGNED NOT NULL');
        DB::statement('ALTER TABLE orders MODIFY COLUMN shipping_address_id BIGINT UNSIGNED NULL');

        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('shipping_address_id')->references('id')->on('shipping_addresses')->nullOnDelete();
        });
    }
};
