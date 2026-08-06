<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubTopic extends Model
{
    protected $fillable = ['topic_id', 'name', 'description', 'order'];

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

    public function learningMaterials()
    {
        return $this->hasMany(LearningMaterial::class);
    }
}
