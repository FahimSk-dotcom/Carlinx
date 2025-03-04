// pages/api/create-order.js
import Razorpay from 'razorpay';
import { MongoClient } from 'mongodb';
// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const client = new MongoClient(process.env.MONGODB_URI);
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
    let id=order.id;
    let amount_data =order.amount;
    let status =order.status;
    let c_name=userDetails.name;
    let c_no=userDetails.phone;
    // You might want to save order details to your database here
    // await saveOrderToDatabase({ ...order, items, userDetails });
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection('Orders');
    const result = await usersCollection.insertOne({
      id,
      amount_data,
      status,
      c_name,
      c_no
    });

    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      message: "Order saved sucessfully", order: result
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      message: 'Error creating order',
      error: error.message
    });
  }
}