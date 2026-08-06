<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningMaterial extends Model
{
    protected $fillable = [
        'sub_topic_id', 'type', 'title', 'content_data', 'metadata', 'order'
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function subTopic()
    {
        return $this->belongsTo(SubTopic::class);
    }
}
