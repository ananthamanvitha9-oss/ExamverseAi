<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'mock_test_id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option', 'explanation'
    ];

    public function mockTest()
    {
        return $this->belongsTo(MockTest::class);
    }
}
