import { clearCart } from "@/Redux/counter/counterSlice";
import { useDispatch } from 'react-redux';
export default function PaymentSuccess() {
  const dispatch = useDispatch();
      dispatch(clearCart());
    return (
      <div className="text-center mt-32">
        <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
        <h1 className="mt-4 mb-2 text-xl">Check Your Mail for Purchase Bill.</h1>
        <p className="mb-4">Thank you for your purchase.</p>
      </div>
    );
  }