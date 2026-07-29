<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $fillable = ['name', 'description', 'thumbnail_url'];

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }
}
