import { createHmac } from 'crypto';
import { sendOrderConfirmation } from '../../utils/emailService';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature, 
            userDetails, 
            items, 
            amount 
        } = req.body;
        // Validate required parameters
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing required payment verification parameters' });
        }

        // Ensure Razorpay Secret Key is available
        const secretKey = process.env.RAZORPAY_KEY_SECRET;
        if (!secretKey) {
            return res.status(500).json({ message: 'Razorpay secret key is missing in environment variables' });
        }

        // Generate signature using HMAC SHA256
        const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
        const generatedSignature = createHmac('sha256', secretKey)
            .update(sign)
            .digest('hex');


        // Compare generated signature with the received signature
        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }

        // Send order confirmation email
        try {
            await sendOrderConfirmation({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                amount,
                items: Array.isArray(items) ? items : [],
                userDetails: {
                    name: userDetails?.name,
                    email: userDetails?.email,
                    address: userDetails?.address,
                    city: userDetails?.city,
                    state: userDetails?.state,
                    pincode: userDetails?.pincode
                }
            });
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
        }

        return res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } catch (error) {
        console.error('Payment verification error:', error);
        return res.status(500).json({ success: false, message: 'Error verifying payment', error: error.message });
    }
}
