import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../Components/layouts/BreadCrumb';
import Assistant from '@/Components/GeminiChat';
import Products from '../../Components/layouts/products';
import { FaArrowRotateRight } from "react-icons/fa6";
import axios from 'axios';

const Inventory = () => {
  const filterOptions = {
    condition: ['All Status', 'New', 'Used'],
    brand: ['All Brands', 'Mercedes', 'Ferrari', 'Audi', 'BMW', 'Tesla', 'Nissan', 'Hyundai'],
    model: ['All Model', '2023', '2022', '2021', '2020', '2019'],
    year: ['All Year', '2023', '2022', '2021', '2020', '2019'],
    price: ['All Price', '$10000-$30000', '$30000-$50000', '$50000-$70000', '$70000-$90000'],
  };

  const [filters, setFilters] = useState({
    condition: 'All Status',
    brand: 'All Brands',
    model: 'All Model',
    year: 'All Year',
    price: 'All Price',
  });

  const [filteredData, setFilteredData] = useState([]);
  const [loadMoreMessage, setLoadMoreMessage] = useState('');
  const [loadMoreClickCount, setLoadMoreClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // New state for loader

  useEffect(() => {
    fetchFilteredData(filters);
  }, [filters]);

  const fetchFilteredData = async (filters) => {
    setIsLoading(true); // Show loader before fetching
    try {
      const response = await axios.get('/api/inventory', { params: filters });
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setIsLoading(false); // Hide loader after fetching
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleLoadMore = async () => {
    setIsLoading(true); // Show loader before loading more
    try {
      const response = await axios.get('/api/inventory', { params: filters });
      setFilteredData((prev) => [...prev, ...response.data]);
      setLoadMoreClickCount((prev) => prev + 1); // Increment the click count
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setIsLoading(false); // Hide loader after loading more
    }
  };

  const handleDefault = () => {
    setFilters({
      condition: 'All Status',
      brand: 'All Brands',
      model: 'All Model',
      year: 'All Year',
      price: 'All Price',
    });
  };

  return (
    <>
      <div className='relative'>
        <Breadcrumb title="Inventory" />
        <Assistant/>
      </div>
      <div className="results w-full max-w-7xl mx-auto px-4">
        <p className='Card text-xl sm:text-2xl font-semibold p-6 sm:p-8 border-none rounded-xl mt-5 mb-10'>
          Showing {filteredData.length} Results
        </p>
      </div>
      <div key={"Search"} className="Search bg-white shadow-lg mt-10">
        <p className='text-black font-semibold text-xl sm:text-2xl pt-5 px-4 sm:pl-6 pb-3 tracking-widest'>Let&#8217;s Find Your Perfect Car</p>
        <hr className='border-solid mx-4 sm:mx-6' />
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 pb-8'>
          {Object.keys(filterOptions).map((filterName) => (
            <form key={filterName} className="w-full">
              <label htmlFor={filterName} className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">
                {filterName.charAt(0).toUpperCase() + filterName.slice(1)}
              </label>
              <select
                id={filterName}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-accent block w-full p-2.5"
                onChange={(e) => handleFilterChange(filterName, e.target.value)}
                value={filters[filterName]}
              >
                {filterOptions[filterName].map((option) => (
                  <option key={option} value={option}>
                    {option.replace(/'/g, '&apos;')} {/* Replacing ' with &apos; */}
                  </option>
                ))}
              </select>
            </form>
          ))}
          <div className='flex items-end'>
            <button onClick={handleDefault} className='theme-btn w-full mt-4 h-15 flex items-center justify-center gap-1'>
              Default Result
            </button>
          </div>
        </div>
      </div>
      
      {/* Loader Component */}
      {isLoading && (
        <div className="flex justify-center items-center my-20">
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
      )}
      
      {!isLoading && (
        <>
          <Products filteredData={filteredData} />
          {loadMoreMessage && <p className="text-center mt-4 text-red-500">{loadMoreMessage}</p>}
          {!loadMoreMessage && (
            <button onClick={handleLoadMore} className='theme-btn h-12 m-auto relative bottom-24 flex items-center justify-center gap-1'>
              Load More <FaArrowRotateRight />
            </button>
          )}
        </>
      )}
    </>
  );
};

export default Inventory;