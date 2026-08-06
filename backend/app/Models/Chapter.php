<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    protected $fillable = ['subject_id', 'unit_id', 'name', 'description', 'order'];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function topics()
    {
        return $this->hasMany(Topic::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }
}
