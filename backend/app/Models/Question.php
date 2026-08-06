<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['topic_id', 'question_text', 'type', 'difficulty'];

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

    public function options()
    {
        return $this->hasMany(Option::class);
    }

    public function answer()
    {
        return $this->hasOne(Answer::class);
    }

    public function pyq()
    {
        return $this->hasOne(Pyq::class);
    }
}
