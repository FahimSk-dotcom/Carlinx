import React, { useState } from 'react';
import Breadcrumb from '@/Components/layouts/BreadCrumb';
import { IoIosSearch } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Redux/counter/counterSlice';
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaRegEye } from 'react-icons/fa6';
import Link from 'next/link';
import part1 from '../../../public/jpgs/parts-1.jpg';
import part2 from '../../../public/jpgs/parts-2.jpg';
import part3 from '../../../public/jpgs/parts-3.jpg';
import part4 from '../../../public/jpgs/parts-4.jpg';
import part5 from '../../../public/jpgs/parts-5.jpg';
import part6 from '../../../public/jpgs/parts-6.jpg';
import part7 from '../../../public/jpgs/parts-7.jpg';
import part8 from '../../../public/jpgs/parts-8.jpg';
import part9 from '../../../public/jpgs/parts-9.jpg';

const Shop = () => {
  const dispatch = useDispatch();
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

  const [minValue, setMinValue] = useState(400);
  const [maxValue, setMaxValue] = useState(100000);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddToCart = (item) => {
    dispatch(addToCart({ item, type: "increase" }));
  };

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    if (e.target.name === "min") {
      setMinValue(Math.min(value, maxValue));
    } else {
      setMaxValue(Math.max(value, minValue));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredData = partsdata.filter((item) => {
    return (
      item.price >= minValue &&
      item.price <= maxValue &&
      item.name.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <>
      <div className='h-[380px]'>
        <h1 className='text-white absolute left-[46vw] top-60 z-20 text-5xl font-bold'>Shop</h1>
        <Breadcrumb />
      </div>
      <div className="Container w-screen flex justify-center">
        {/* Sidebar */}
        <div className="sidebar w-3/12">
          <div className="search Card h-40 w-80 mt-10 border rounded-xl flex flex-col p-5">
            <h4 className='text-xl ml-2 font-semibold'>Search</h4>
            <input
              type='text'
              placeholder='Search Item'
              onChange={handleSearch}
              className='relative top-10 border-[2px] rounded-xl h-12 w-64 focus:ring-none'
              style={{ borderColor: '#ced4da', outline: 'none' }}
              onFocus={(e) => (e.target.style.borderColor = '#EF1D26')}
              onBlur={(e) => (e.target.style.borderColor = '#ced4da')}
            />
            <IoIosSearch className='text-accent h-8 w-8 relative left-[208px]' />
          </div>
          <div className="price Card h-40 w-80 mt-10 mb-5 border rounded-xl flex flex-col p-5">
            <h4 className='text-xl ml-2 font-semibold'>Price Range</h4>
            <div className="mt-2">₹{minValue} - ₹{maxValue}</div>
            <input
              type="range"
              name="min"
              min="400"
              max="100000"
              value={minValue}
              onChange={handlePriceChange}
            />
            <input
              type="range"
              name="max"
              min="400"
              max="100000"
              value={maxValue}
              onChange={handlePriceChange}
            />
          </div>
        </div>

        {/* Product Cards */}
        <div className="card w-3/5 flex flex-wrap">
          <div className="cards grid grid-cols-3">
            {filteredData.map((data) => (
              <div key={data.id} className="Card h-[350px] m-4 shadow-xl w-72 bg-white flex justify-center border-none rounded">
                <div className='card ml-4'>
                  <Image src={data.img} width={250} height={100} className='border-none rounded hover:scale-105 transition-all' />
                  <div className="content flex flex-col items-center">
                    <p className='text-xl font-bold mt-2 hover:text-accent'>{data.name}</p>
                    <p className='text-bold text-xl flex items-center gap-2 font-semibold mt-1 text-accent'>
                      <FaRupeeSign /> {data.price}
                    </p>
                    <div className="buttons flex gap-2">
                      <Link href={`/details/${data.id}`}>
                        <button className='theme-btn max-w-32 h-9 mt-2 flex items-center justify-center gap-1'>
                          <FaRegEye /> Details
                        </button>
                      </Link>
                      <button
                        onClick={() => handleAddToCart(data)}
                        className='theme-btn max-w-64 h-9 mt-2 flex items-center justify-center'>
                        <HiOutlineShoppingCart className='text-xl' /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <p className='text-2xl text-center col-span-3'>No products found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
