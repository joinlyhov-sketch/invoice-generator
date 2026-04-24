<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $services = Service::where('status', 'active')
            ->select('id', 'title', 'description', 'base_price')
            ->orderBy('title')
            ->get();

        return response()->json($services);
    }
}
