<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pyq extends Model
{
    protected $fillable = ['question_id', 'exam_id', 'year'];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }
}
