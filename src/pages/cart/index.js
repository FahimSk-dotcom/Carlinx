import React from 'react';
import Breadcrumb from '@/Components/layouts/BreadCrumb';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, clearCart, addToCart } from '../../Redux/counter/counterSlice';
import { FaRupeeSign } from "react-icons/fa";
import Image from 'next/image';
import part1 from '../../../public/jpgs/parts-1.jpg';
import part2 from '../../../public/jpgs/parts-2.jpg';
import part3 from '../../../public/jpgs/parts-3.jpg';
import part4 from '../../../public/jpgs/parts-4.jpg';
import part5 from '../../../public/jpgs/parts-5.jpg';
import part6 from '../../../public/jpgs/parts-6.jpg';
import part7 from '../../../public/jpgs/parts-7.jpg';
import part8 from '../../../public/jpgs/parts-8.jpg';
import part9 from '../../../public/jpgs/parts-9.jpg';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleQuantityChange = (id, type) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      dispatch(addToCart({ item, type }));
    }
  };

  if (cartItems.length === 0) {
    return <p className="text-center mt-32 mb-20 text-5xl font-bold">Your cart is empty</p>;
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <h1 className="text-white mx-auto text-center top-60 text-5xl font-bold">Cart</h1>
      <Breadcrumb />
      <div className="cartdetails mt-20 border rounded-lg p-5 bg-white shadow-lg">
        <div className="details bg-accent grid grid-cols-5 gap-4 text-white text-xl font-bold p-3">
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
            <div className="flex gap-2 items-center">
              <button onClick={() => handleQuantityChange(item.id, "decrease")} className="px-2 py-1 bg-gray-300 rounded">-</button>
              <p>{item.quantity}</p>
              <button onClick={() => handleQuantityChange(item.id, "increase")} className="px-2 py-1 bg-gray-300 rounded">+</button>
            </div>
            <p className="flex items-center gap-1"><FaRupeeSign /> {item.quantity * item.price}</p>
            <button onClick={() => handleRemove(item.id)} className="text-red-500 text-right col-span-1">Remove</button>
          </div>
        ))}

        <div className="flex justify-between mt-4 p-4 bg-gray-200 rounded-lg">
          <button onClick={handleClearCart} className="bg-red-500 text-white px-4 py-2 rounded">Clear Cart</button>
          <div className="text-xl font-bold">
            Total: <FaRupeeSign /> {cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
