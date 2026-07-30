<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Razorpay\Api\Api;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function createOrder(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'type' => 'required|string'
        ]);

        $api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

        $orderData = [
            'receipt'         => 'rcptid_' . auth()->id() . '_' . time(),
            'amount'          => $request->amount * 100, // Amount in paise
            'currency'        => 'INR',
            'payment_capture' => 1 // auto capture
        ];

        try {
            $razorpayOrder = $api->order->create($orderData);

            $payment = Payment::create([
                'user_id' => auth()->id(),
                'amount' => $request->amount,
                'currency' => 'INR',
                'razorpay_order_id' => $razorpayOrder['id'],
                'status' => 'created',
                'type' => $request->type,
            ]);

            return response()->json([
                'order_id' => $razorpayOrder['id'],
                'amount' => $orderData['amount'],
                'currency' => $orderData['currency']
            ]);
        } catch (\Exception $e) {
            Log::error('Razorpay Order Creation Failed: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to create order'], 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string'
        ]);

        $api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

        try {
            $attributes = array(
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature
            );

            $api->utility->verifyPaymentSignature($attributes);

            $payment = Payment::where('razorpay_order_id', $request->razorpay_order_id)->first();
            if ($payment) {
                $payment->update([
                    'razorpay_payment_id' => $request->razorpay_payment_id,
                    'razorpay_signature' => $request->razorpay_signature,
                    'status' => 'paid'
                ]);

                // Here we could unlock premium features, e.g. user->is_premium = true;
                
                return response()->json(['message' => 'Payment verified successfully']);
            }

            return response()->json(['error' => 'Payment record not found'], 404);

        } catch (\Exception $e) {
            Log::error('Razorpay Payment Verification Failed: ' . $e->getMessage());
            
            $payment = Payment::where('razorpay_order_id', $request->razorpay_order_id)->first();
            if ($payment) {
                $payment->update(['status' => 'failed']);
            }

            return response()->json(['error' => 'Payment verification failed'], 400);
        }
    }
}
