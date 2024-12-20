import React from 'react';
import Breadcrumb from '@/Components/layouts/BreadCrumb';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, clearCart, addToCart } from '../../Redux/counter/counterSlice';
import { FaRupeeSign } from "react-icons/fa";
import Image from 'next/image'; // Import Image from Next.js
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

  // Parts data to map the cart items to images and descriptions
  const partsdata = [
    { id: 1, name: 'Engine Assembly', Description: 'Description', price: 70000, img: part9 },
    { id: 2, name: 'Alternator', Description: 'Description', price: 50000, img: part2 },
    { id: 3, name: 'Brake Rotor', Description: 'Description', price: 7000, img: part1 },
    { id: 4, name: 'Shock Absorbers', Description: 'Description', price: 6000, img: part7 },
    { id: 5, name: 'Oil Filter', Description: 'Description', price: 700, img: part6 },
    { id: 6, name: 'Engine Oil', Description: 'Description', price: 400, img: part5 },
    { id: 7, name: 'Car Tires (Set of 4)', Description: 'Description', price: 10000, img: part3 },
    { id: 8, name: 'Spark Plugs', Description: 'Description', price: 800, img: part4 },
    { id: 9, name: 'Car Suspension Parts', Description: 'Description', price: 20000, img: part8 },
  ];

  // Remove item from cart
  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  // Clear all items from the cart
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Update quantity (increase or decrease)
  const handleQuantityChange = (id, type) => {
    const item = cartItems.find((item) => item.id === id);
    const newQuantity = type === "increase" ? item.quantity + 1 : item.quantity - 1;

    // Prevent quantity from going below 1
    if (newQuantity > 0) {
      dispatch(addToCart({ ...item, quantity: newQuantity }));
    }
  };

  // If cart is empty, show a message
  if (cartItems.length === 0) {
    return <p className="text-center mt-32 mb-20 text-5xl font-bold">Your cart is empty</p>;
  }

  return (
    <>
      <div className='relative'>
        <h1 className='text-white absolute left-[46vw] top-60 z-20 text-5xl font-bold'>Cart</h1>
        <Breadcrumb />
        <div className="cartdetails mt-20 border rounded-lg p-5"> 
          <div className="details bg-accent  grid grid-cols-5  text-white text-xl font-bold mb-5">
            <p>IMAGE</p>
            <p>PRODUCT NAME</p>
            <p>PRICE</p>
            <p>QUANTITY</p>
            <p>SUB TOTAL</p>
          </div>

          {/* Loop over cart items and display them */}
          {cartItems.map((item) => (
            <div key={item.id} className="details mt-4 grid grid-cols-5  items-center text-black text-xl font-bold">
              <Image src={item.img} alt={item.name} width={150} height={100} className="rounded" />
              <p>{item.name}</p>
              <p className='flex gap-2'><FaRupeeSign /> {item.price}</p>

              {/* Quantity buttons */}
              <div className="flex gap-4 items-center">
                <button onClick={() => handleQuantityChange(item.id, "decrease")} className="px-2 py-1 bg-gray-300 rounded">-</button>
                <p>{item.quantity}</p>
                <button onClick={() => handleQuantityChange(item.id, "increase")} className="px-2 py-1 bg-gray-300 rounded">+</button>
              </div>

              {/* Subtotal */}
              <p className='flex gap-2'><FaRupeeSign /> {item.quantity * item.price}</p>

              {/* Remove button */}
              <button onClick={() => handleRemove(item.id)} className="text-red-500 col-start-6">Remove</button>
            </div>
          ))}

          {/* Cart total and clear cart button */}
          <div className="flex justify-between mt-4">
            <button onClick={handleClearCart} className="bg-red-500 text-white px-4 py-2 rounded">Clear Cart</button>
            <div className="total">
              <p>Total: ₹{cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
