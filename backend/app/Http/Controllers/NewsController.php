<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NewsController extends Controller
{
    public function index()
    {
        $news = DB::table('news_articles')->orderBy('created_at', 'desc')->get();
        return response()->json($news);
    }
}
