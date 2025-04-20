import { clearCart } from "@/Redux/counter/counterSlice";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PaymentSuccess() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Clear the cart on component mount
    dispatch(clearCart());

    // Confetti effect (optional)
    const confettiScript = document.createElement('script');
    confettiScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/canvas-confetti/1.6.0/confetti.browser.min.js';
    document.body.appendChild(confettiScript);

    confettiScript.onload = () => {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };

    return () => {
      document.body.removeChild(confettiScript);
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <div className="h-1 w-16 bg-green-500 mx-auto my-4"></div>

        <p className="text-gray-600 mb-6">
          Your transaction has been completed successfully. A confirmation email with your purchase details has been sent to your registered email address.
        </p>

        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <p className="text-gray-700 font-medium">Check your email for the invoice</p>
          </div>
          <p className="text-sm text-gray-500">
            If you don&apos;t see it in your inbox, please check your spam folder.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/orders" className="py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition duration-200">
            View Orders
          </Link>
          <Link href="/shop" className="py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition duration-200">
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? <a href="/contact" className="text-red-600 hover:text-red-700">Contact our support team</a></p>
        </div>
      </div>
    </div>
  );
}