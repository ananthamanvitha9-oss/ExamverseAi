<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LessonCompletion extends Model
{
    protected $fillable = ['user_id', 'lesson_id', 'time_spent_minutes'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
