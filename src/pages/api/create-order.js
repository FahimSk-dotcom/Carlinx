// pages/api/create-order.js
import Razorpay from 'razorpay';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, currency, items, userDetails } = req.body;

    // Validate required fields
    if (!amount || !currency) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    // Create order options
    const options = {
      amount: Math.round(amount), // amount should be in paise
      currency: currency || 'INR',
      receipt: 'order_' + Date.now(),
      notes: {
        ...userDetails && {
          shipping_address: userDetails.address,
          customer_name: userDetails.name,
          customer_phone: userDetails.phone,
          customer_email: userDetails.email
        }
      },
      payment_capture: 1 // Auto capture payment
    };

    // Create order using Razorpay
    const order = await razorpay.orders.create(options);

    // You might want to save order details to your database here
    // await saveOrderToDatabase({ ...order, items, userDetails });

    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Error creating order',
      error: error.message 
    });
  }
}