// pages/api/verify-payment.js
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userDetails
    } = req.body;

    // Validate the payment verification
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: 'Missing required payment verification parameters'
      });
    }

    // Generate signature for verification
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    // Verify signature
    if (generated_signature === razorpay_signature) {
      // Payment is verified
      // Here you can update your database with payment success status
      // await updatePaymentStatus({
      //   orderId: razorpay_order_id,
      //   paymentId: razorpay_payment_id,
      //   signature: razorpay_signature,
      //   status: 'success',
      //   userDetails
      // });

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      // Payment verification failed
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
}