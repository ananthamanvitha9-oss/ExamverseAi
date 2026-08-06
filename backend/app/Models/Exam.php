<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $fillable = [
        'name', 'description', 'thumbnail_url',
        'overview', 'eligibility', 'exam_pattern', 'official_syllabus',
        'mock_test_structure', 'revision_strategy', 'daily_plan',
        'weekly_plan', 'monthly_plan'
    ];

    protected $casts = [
        'eligibility' => 'array',
        'exam_pattern' => 'array',
        'mock_test_structure' => 'array',
        'daily_plan' => 'array',
        'weekly_plan' => 'array',
        'monthly_plan' => 'array',
    ];

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }
}
