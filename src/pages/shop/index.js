import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/Components/layouts/BreadCrumb';
import Assistant from '@/Components/GeminiChat';
import { IoIosSearch } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Redux/counter/counterSlice';
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaRegEye } from 'react-icons/fa6';
import Link from 'next/link';
import axios from 'axios';

const Shop = () => {
  const dispatch = useDispatch();
  const [partsData, setPartsData] = useState([]);
  const [minValue, setMinValue] = useState(400);
  const [maxValue, setMaxValue] = useState(100000);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Fetch parts data from the API
  useEffect(() => {
    const fetchParts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/parts', {
          params: { search: searchTerm, minPrice: minValue, maxPrice: maxValue },
        });
        setPartsData(response.data);
      } catch (error) {
        console.error('Error fetching parts data:', error);
      }
      setLoading(false);
    };

    fetchParts();
  }, [searchTerm, minValue, maxValue]);

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

  return (
    <>
      <div className='relative'>
        <Breadcrumb title="Shop" />
        <Assistant/>
      </div>
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4 mt-10">
        {/* Sidebar */}
        <div className="sidebar w-full lg:w-3/12">
          <div className="search Card mt-10 border rounded-xl flex flex-col p-5">
            <h4 className='text-xl font-semibold'>Search</h4>
            <div className='relative mt-4'>
              <input
                type='text'
                placeholder='Search Item'
                onChange={handleSearch}
                className='border-[2px] rounded-xl h-12 w-full pr-10 focus:ring-none'
                style={{ borderColor: '#ced4da', outline: 'none' }}
                onFocus={(e) => (e.target.style.borderColor = '#EF1D26')}
                onBlur={(e) => (e.target.style.borderColor = '#ced4da')}
              />
              <IoIosSearch className='text-accent h-6 w-6 absolute right-3 top-1/2 -translate-y-1/2' />
            </div>
          </div>
          <div className="price Card mt-6 border rounded-xl flex flex-col p-5">
            <h4 className='text-xl font-semibold'>Price Range</h4>
            <div className="mt-2">₹{minValue} - ₹{maxValue}</div>
            <input
              type="range"
              name="min"
              min="400"
              max="100000"
              value={minValue}
              onChange={handlePriceChange}
              className='w-full mt-2'
            />
            <input
              type="range"
              name="max"
              min="400"
              max="100000"
              value={maxValue}
              onChange={handlePriceChange}
              className='w-full mt-2'
            />
          </div>
        </div>

        {/* Product Cards */}
        <div className="w-full lg:w-9/12 flex flex-wrap">
          {loading ? (
            <div className="flex justify-center items-center w-full h-64">
              {/* Enhanced Attractive Loader */}
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-transparent border-t-[#ef1d26] rounded-full animate-spin absolute top-0 left-0"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#ef1d26" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {partsData.map((data) => (
                <div key={data.item_id} className="Card shadow-xl bg-white flex flex-col border-none rounded overflow-hidden">
                  <Image src={data.img} width={250} height={100} className='w-full h-40 object-cover border-none rounded hover:scale-105 transition-all' alt='' />
                  <div className="content flex flex-col items-center p-4">
                    <p className='text-lg xl:text-xl font-bold mt-2 hover:text-accent text-center'>{data.name}</p>
                    <p className='text-bold text-lg xl:text-xl flex items-center gap-2 font-semibold mt-1 text-accent'>
                      <FaRupeeSign /> {data.price}
                    </p>
                    <div className="buttons flex flex-wrap justify-center gap-2">
                      <Link href={`/details/${data.item_id}`}>
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
              ))}
              {partsData.length === 0 && (
                <p className='col-span-full text-center mt-10'>No products found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;