<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    protected $fillable = [
        'chapter_id', 'name', 'learning_objectives', 'ncert_references', 
        'standard_books', 'difficulty_level', 'estimated_time_minutes', 
        'tags', 'order'
    ];

    protected $casts = [
        'learning_objectives' => 'array',
        'ncert_references' => 'array',
        'standard_books' => 'array',
        'tags' => 'array',
    ];

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function subTopics()
    {
        return $this->hasMany(SubTopic::class);
    }
}
