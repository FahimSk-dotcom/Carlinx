import React, { useState, useEffect } from 'react';
import Breadcrumb from '@/Components/layouts/BreadCrumb';
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
        <div className="card w-3/5 flex flex-wrap ">
          {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-xl">Loading...</p>
                    </div>

        ):(
          <div className="cards grid grid-cols-3">
          {partsData.map((data) => (
            <div key={data.id} className="Card h-[350px] m-4 shadow-xl w-72 bg-white flex justify-center border-none rounded">
              <div className='card ml-4'>
                <Image src={data.img} width={250} height={100} className='border-none rounded hover:scale-105 transition-all' alt='' />
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
          {partsData.length === 0 && (
            <p className='col-span-3 text-center mt-10'>No products found.</p>
          )}
        </div>
        )}
        </div>
      </div>
    </>
  );
};

export default Shop;
