import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../Components/layouts/BreadCrumb';
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

  useEffect(() => {
    fetchFilteredData(filters);
  }, [filters]);

  const fetchFilteredData = async (filters) => {
    try {
      const response = await axios.get('/api/inventory', { params: filters });
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleLoadMore = async () => {
    try {
      const response = await axios.get('/api/inventory', { params: filters });
      setFilteredData((prev) => [...prev, ...response.data]);
      setLoadMoreClickCount((prev) => prev + 1); // Increment the click count
    } catch (error) {
      console.error('Error loading more data:', error);
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
      <h1 className='text-white absolute left-[43vw] top-60 z-20 text-5xl font-bold'>Inventory</h1>
      <Breadcrumb />
      <div className="results">
        <p className='Card text-2xl font-semibold p-8 border-none rounded-xl mt-5 mb-10 ml-20 mr-20'>
          Showing {filteredData.length} Results
        </p>
      </div>
      <div key={"Search"} className="Search bg-white shadow-lg mt-10">
        <p className='text-black font-semibold text-2xl pt-5 pl-6 pb-3 tracking-widest'>Let&#8217;s Find Your Perfect Car</p>
        <hr className='border-solid ml-6 mr-6' />
        <div className='Form-search grid grid-cols-3'>
          {Object.keys(filterOptions).map((filterName) => (
            <form key={filterName} className="max-w-64 ml-10">
              <label htmlFor={filterName} className="block mb-2 mt-10 text-sm font-medium text-gray-900 dark:text-white">
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
          <button onClick={handleDefault} className='theme-btn max-w-64 mt-16 ml-4 h-15 flex items-center justify-center gap-1 '>
            Default Result
          </button>
        </div>
      </div>
      <Products filteredData={filteredData} />
      {loadMoreMessage && <p className="text-center mt-4 text-red-500">{loadMoreMessage}</p>}
      {!loadMoreMessage && (
        <button onClick={handleLoadMore} className='theme-btn h-12 m-auto relative bottom-24 flex items-center justify-center gap-1'>
          Load More <FaArrowRotateRight />
        </button>
      )}
    </>
  );
};

export default Inventory;
