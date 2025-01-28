// components/RazorpayPayment.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const RazorpayPayment = () => {
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [showForm, setShowForm] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const totalAmount = cartItems.reduce((total, item) => 
    total + item.price * (item.quantity || 1), 0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      alert('Please fill in all required fields');
      return;
    }

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load');
      return;
    }

    try {
      const orderData = {
        amount: totalAmount * 100,
        currency: 'INR',
        items: cartItems,
        userDetails: userDetails
      };

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'Your Store Name',
        description: 'Purchase Description',
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userDetails: userDetails
            };

            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(verifyData),
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              alert('Payment successful!');
              router.push('/payment-success');
            } else {
              alert('Payment verification failed');
              router.push('/payment-failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed');
            router.push('/payment-failed');
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone
        },
        theme: {
          color: '#3399cc',
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <>
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          className="text-xl font-bold theme-btn"
          disabled={!cartItems.length}
        >
          Buy Now
        </button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>
            <form onSubmit={handlePayment}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={userDetails.name}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userDetails.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Address *</label>
                  <textarea
                    name="address"
                    value={userDetails.address}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={userDetails.city}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={userDetails.state}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={userDetails.pincode}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RazorpayPayment;