<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['exam_id', 'name', 'description', 'weightage_percentage'];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    // Retained for backward compatibility during transition
    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }
}
