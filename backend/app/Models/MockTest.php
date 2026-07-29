<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MockTest extends Model
{
    protected $fillable = ['exam_id', 'title', 'description', 'duration_minutes'];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
