<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['exam_id', 'name', 'description'];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }
}
