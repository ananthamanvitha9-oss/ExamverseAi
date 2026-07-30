<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class AiLimitTest extends TestCase
{
    use RefreshDatabase;

    public function test_free_user_can_make_three_requests()
    {
        $user = User::factory()->create([
            'is_pro' => false,
            'daily_ai_requests' => 0,
            'last_request_date' => now()->toDateString()
        ]);

        $this->actingAs($user);

        // Simulate 3 successful hits to an AI endpoint (assuming mock testing logic)
        for ($i = 0; $i < 3; $i++) {
            $this->assertTrue($user->consumeAiRequest());
        }

        // 4th hit should fail
        $this->assertFalse($user->consumeAiRequest());
    }

    public function test_pro_user_has_unlimited_requests()
    {
        $user = User::factory()->create([
            'is_pro' => true,
            'daily_ai_requests' => 999, // Simulate high usage
            'last_request_date' => now()->toDateString()
        ]);

        $this->actingAs($user);

        // Even after 999 requests, Pro user should still be able to consume
        $this->assertTrue($user->consumeAiRequest());
        $this->assertTrue($user->consumeAiRequest());
    }

    public function test_daily_limit_resets_on_new_day()
    {
        $user = User::factory()->create([
            'is_pro' => false,
            'daily_ai_requests' => 3, // Maxed out yesterday
            'last_request_date' => now()->subDay()->toDateString()
        ]);

        $this->actingAs($user);

        // First request today should pass and reset count to 1
        $this->assertTrue($user->consumeAiRequest());
        
        $user->refresh();
        $this->assertEquals(1, $user->daily_ai_requests);
        $this->assertEquals(now()->toDateString(), $user->last_request_date->format('Y-m-d'));
    }
}
