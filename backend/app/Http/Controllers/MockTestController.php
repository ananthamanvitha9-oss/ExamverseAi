<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MockTest;

class MockTestController extends Controller
{
    public function index()
    {
        return response()->json(MockTest::with('questions')->get());
    }

    public function show($id)
    {
        $mockTest = MockTest::with('questions')->findOrFail($id);
        return response()->json($mockTest);
    }
}
