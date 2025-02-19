import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/Components/layouts/BreadCrumb';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, clearCart, addToCart } from '../../Redux/counter/counterSlice';
import { FaRupeeSign } from "react-icons/fa";
import Image from 'next/image';
import RazorpayForm from '@/Components/layouts/RazorpayPayment';
const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState({}); // Store messages and positions by item id
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  const handleQuantityChange = (id, type) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {


      if (type === "increase") {
        if (item.quantity + 1 < item.Stock) {
          // Increase the quantity and clear the StockMessage
          dispatch(addToCart({ item: { ...item, quantity: item.quantity + 1 }, type }));

          // Clear message if not exceeding stock
          setMessages((prevMessages) => {
            const updatedMessages = { ...prevMessages };
            delete updatedMessages[id]; // Remove message for this item
            return updatedMessages;
          });
        } else {
          // Set the StockMessage if quantity exceeds stock

          dispatch(addToCart({ item: { ...item, quantity: item.quantity + 1 }, type }));
          setMessages((prevMessages) => {
            const updatedMessages = { ...prevMessages };
            updatedMessages[id] = {
              message: `Only ${item.Stock} items are available in Stock.`,
              position: { left: 105 }, // Adjust position for the message
            };
            return updatedMessages;
          });
        }
      } else if (type === "decrease" && item.quantity > 1) {
        // Decrease the quantity and clear the StockMessage
        dispatch(addToCart({ item: { ...item, quantity: item.quantity - 1 }, type }));

        // Log before clearing the message state

        setMessages((prevMessages) => {
          const updatedMessages = { ...prevMessages };
          delete updatedMessages[id]; // Remove message for this item
          return updatedMessages;
        });
      }
    }
  };
  const handleBuyNow = () => {
    setShowPaymentForm(true);
  };
  if (cartItems.length === 0) {
    return <p className="text-center mt-32 mb-20 text-5xl font-bold">Your cart is empty</p>;
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <h1 className="text-white mx-auto text-center top-60 text-5xl font-bold">Cart</h1>
      <Breadcrumb />
      <div className="cartdetails mt-20 border rounded-lg p-5 bg-white shadow-lg">
        <div className="details bg-accent grid grid-cols-5 gap-4 text-white text-xl font-bold p-3 border rounded-lg">
          <p>IMAGE</p>
          <p>PRODUCT NAME</p>
          <p>PRICE</p>
          <p>QUANTITY</p>
          <p>SUB TOTAL</p>
        </div>

        {cartItems.map((item) => (
          <div key={item.id} className="details grid grid-cols-5 gap-4 items-center text-black text-lg font-semibold p-3 border-b">
            <Image src={item.img || '/jpgs/default.jpg'} alt={item.name} width={100} height={80} className="rounded" />
            <p className="truncate">{item.name}</p>
            <p className="flex items-center gap-1"><FaRupeeSign /> {item.price}</p>
            <div className="flex gap-2 items-center relative">
              <button
                onClick={() => handleQuantityChange(item.id, "decrease")}
                className="px-2 py-1 bg-gray-300 rounded"
              >
                -
              </button>
              <p>{item.quantity}</p>
              <button
                onClick={() => handleQuantityChange(item.id, "increase")}
                className={`px-2 py-1 rounded ${item.quantity >= item.Stock ? "bg-gray-400 cursor-not-allowed" : "bg-gray-300"}`}
                disabled={item.quantity >= item.Stock}
              >
                +
              </button>

              {/* Popup Message */}
              {messages[item.id] && (
                <div
                  className="popup-message absolute bg-red-500 text-white p-2 rounded-md shadow-md z-50"
                  style={{ left: `${messages[item.id].position.left}px` }}
                >
                  {/* Arrow */}
                  <div className="arrow absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-0 h-0 border-l-10 border-r-10 border-t-10 border-transparent border-t-red-500"></div>
                  <p>{messages[item.id].message}</p>
                </div>
              )}
            </div>
            <p className="flex items-center gap-1"><FaRupeeSign /> {item.quantity * item.price}</p>
            <button onClick={() => handleRemove(item.id)} className="text-red-500 text-right col-span-1">Remove</button>
          </div>
        ))}

        <div className="flex justify-between mt-4 p-4 bg-gray-200 rounded-lg">
          <button onClick={handleClearCart} className="bg-red-500 text-white px-4 py-2 rounded">Clear Cart</button>
          <div className="buycart flex w-2/12 justify-around items-center">
            <RazorpayForm/>
            <div className="text-xl font-bold ">
              Total: <p className='flex items-center'>
                <FaRupeeSign />
                {cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
