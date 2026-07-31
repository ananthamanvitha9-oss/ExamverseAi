<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Razorpay\Api\Api;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    private $razorpayId = '';
    private $razorpaySecret = '';

    public function __construct()
    {
        $this->razorpayId = env('RAZORPAY_KEY_ID');
        $this->razorpaySecret = env('RAZORPAY_KEY_SECRET');
    }

    public function createOrder(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric', // Amount in rupees
        ]);

        try {
            $api = new Api($this->razorpayId, $this->razorpaySecret);
            $orderData = [
                'receipt'         => 'rcptid_' . time(),
                'amount'          => $request->amount * 100, // Amount in paise
                'currency'        => 'INR',
                'payment_capture' => 1 // auto capture
            ];

            $razorpayOrder = $api->order->create($orderData);

            return response()->json([
                'success' => true,
                'order_id' => $razorpayOrder['id'],
                'amount' => $orderData['amount'],
                'currency' => $orderData['currency'],
                'key_id' => $this->razorpayId
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string'
        ]);

        try {
            $api = new Api($this->razorpayId, $this->razorpaySecret);
            
            $attributes = array(
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature
            );

            $api->utility->verifyPaymentSignature($attributes);

            // Payment is successful, upgrade user to PRO
            $user = Auth::user();
            if ($user) {
                // Assuming we want to set is_pro = true
                $user->is_pro = true;
                $user->save();
            }

            return response()->json(['success' => true, 'message' => 'Payment verified successfully. Account upgraded to Pro.']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Payment verification failed: ' . $e->getMessage()], 400);
        }
    }
}
