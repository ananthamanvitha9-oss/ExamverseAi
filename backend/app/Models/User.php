<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'password',
        'role',
        'preferred_language',
        'profile_photo',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'pro_expires_at' => 'datetime',
            'last_request_date' => 'date',
        ];
    }

    /**
     * Check if the user is allowed to make an AI request.
     * Increments the usage if allowed.
     *
     * @return bool
     */
    public function consumeAiRequest(): bool
    {
        if ($this->is_pro) {
            return true;
        }

        $today = now()->format('Y-m-d');
        $lastRequestDateString = $this->last_request_date ? $this->last_request_date->format('Y-m-d') : null;
        
        if ($lastRequestDateString !== $today) {
            $this->daily_ai_requests = 0;
            $this->last_request_date = $today;
        }

        if ($this->daily_ai_requests >= 3) {
            $this->save();
            return false;
        }

        $this->daily_ai_requests++;
        $this->save();

        return true;
    }
}
