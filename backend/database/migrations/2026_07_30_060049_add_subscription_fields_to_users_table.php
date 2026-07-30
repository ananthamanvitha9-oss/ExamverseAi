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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_pro')->default(false)->after('fcm_token');
            $table->timestamp('pro_expires_at')->nullable()->after('is_pro');
            $table->integer('daily_ai_requests')->default(0)->after('pro_expires_at');
            $table->date('last_request_date')->nullable()->after('daily_ai_requests');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_pro', 'pro_expires_at', 'daily_ai_requests', 'last_request_date']);
        });
    }
};
