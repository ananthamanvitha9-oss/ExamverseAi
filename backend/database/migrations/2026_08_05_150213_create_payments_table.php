<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('payments');
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('razorpay_order_id')->unique();
            $table->string('razorpay_payment_id')->nullable()->unique();
            $table->string('razorpay_signature')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('INR');
            $table->enum('status', ['created', 'successful', 'failed'])->default('created');
            $table->string('plan_name')->default('pro'); // e.g., 'pro', 'monthly'
            $table->timestamps();
        });

        // Add 'is_pro' to users table if it doesn't exist
        if (!Schema::hasColumn('users', 'is_pro')) {
            Schema::table('users', function (Blueprint $table) {
                $table->boolean('is_pro')->default(false)->after('role');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
        if (Schema::hasColumn('users', 'is_pro')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('is_pro');
            });
        }
    }
};
