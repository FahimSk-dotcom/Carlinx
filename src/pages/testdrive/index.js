import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import testcover from '../../../Assets/jpgs/testcover.webp';
import { FaHome, FaCalendarAlt } from "react-icons/fa";
import { BiSolidCarGarage } from "react-icons/bi";
import Breadcrumb from '@/Components/layouts/BreadCrumb';
import Link from 'next/link';

const Testdrive = () => {
  const [name, setname] = useState('');
  const [pnumber, setpnumber] = useState('');
  const [city, setCity] = useState('');
  const [brandname, setbrandname] = useState('');
  const [carModel, setCarModel] = useState('');
  const [transmission, setTransmission] = useState('');
  const [TestDriveLocation, setTestDriveLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [click, isclick] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minDate, setMinDate] = useState('');

  // Set minimum date to today when component mounts
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if(pnumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const res = await fetch('/api/testdrive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          pnumber, 
          city,
          brandname,
          carModel,
          transmission,
          TestDriveLocation,
          selectedDate 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert(`Test Drive Booked on ${selectedDate} Successfully`);
        setname('');
        setpnumber('');
        setCity('');
        setbrandname('');
        setCarModel('');
        setTransmission('');
        setTestDriveLocation('');
        setSelectedDate('');
        isclick(true);
      } else {
        alert(data.message || 'An error occurred');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className='h-[380px]'>
        <h1 className='text-white absolute left-[46vw] top-60 z-20 text-5xl font-bold'>Test Drive</h1>
        <Breadcrumb />
      </div>
      
      <form onSubmit={handleSubmit} className="bg-gray-50">
        <div className="container mx-auto flex flex-col md:flex-row py-16 px-4 justify-center items-center">
          {/* Image Section */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="relative overflow-hidden rounded-xl shadow-2xl transition-transform hover:scale-105 duration-500">
              <Image 
                src={testcover} 
                height={600} 
                width={600} 
                className="w-full object-cover" 
                alt="Test drive a luxury car"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">Experience Excellence</h2>
                  <p className="text-lg">Feel the power </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Section */}
          <div className="md:w-1/2 md:pl-10">
            {!click ? (
              <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-bold text-center mb-6 bg-black text-white py-3 rounded-xl">
                  Book Your Test Drive Experience
                </h2>
                
                <div className="space-y-5">
                  {/* Name Input */}
                  <div className="form-group">
                    <label htmlFor="Name" className="block text-gray-700 mb-2 font-medium">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 border-2 rounded-xl transition-colors duration-300 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  
                  {/* Phone Input */}
                  <div className="form-group">
                    <label htmlFor="number" className="block text-gray-700 mb-2 font-medium">Contact Number</label>
                    <input
                      type="number"
                      value={pnumber}
                      onChange={(e) => setpnumber(e.target.value)}
                      required
                      placeholder="Enter 10-digit phone number"
                      className="w-full px-4 py-2 border-2 rounded-xl transition-colors duration-300 focus:border-red-500 focus:outline-none"
                    />
                    {pnumber && pnumber.length !== 10 && (
                      <p className="text-red-500 text-sm mt-1">Please enter a valid 10-digit number</p>
                    )}
                  </div>
                  
                  {/* City Input */}
                  <div className="form-group">
                    <label htmlFor="city" className="block text-gray-700 mb-2 font-medium">City or Pincode</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="Enter your city or pincode"
                      className="w-full px-4 py-2 border-2 rounded-xl transition-colors duration-300 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  
                  {/* Brand Selection */}
                  <div className="form-group">
                    <label htmlFor="brandname" className="block text-gray-700 mb-2 font-medium">Brand Name</label>
                    <select
                      id="brandname"
                      value={brandname}
                      onChange={(e) => setbrandname(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border-2 rounded-xl transition-colors duration-300 focus:border-red-500 focus:outline-none"
                    >
                      <option value="">Select a Brand</option>
                      <option value="BMW">BMW</option>
                      <option value="Ferrari">Ferrari</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Nissan">Nissan</option>
                    </select>
                  </div>
                   
                  {/* Car Model */}
                  <div className="form-group">
                    <label htmlFor="carModel" className="block text-gray-700 mb-2 font-medium">Car Model</label>
                    <select
                      id="carModel"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-gray-50 border-2 rounded-xl transition-colors duration-300 focus:border-red-500 focus:outline-none"
                    >
                      <option value="">Select a Model</option>
                      <option value="3Series">3 Series</option>
                      <option value="G-TR">G-TR</option>
                      <option value="Maccan">Maccan</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="N-Series">N-Series</option>
                    </select>
                  </div>
                  
                  {/* Transmission */}
                  <div className="form-group">
                    <label className="block text-gray-700 mb-2 font-medium">Transmission Type</label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="transmission"
                          value="MANUAL"
                          checked={transmission === 'MANUAL'}
                          onChange={(e) => setTransmission(e.target.value)}
                          className="mr-2 h-5 w-5 accent-red-500"
                        />
                        <span>Manual</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="transmission"
                          value="AUTOMATIC"
                          checked={transmission === 'AUTOMATIC'}
                          onChange={(e) => setTransmission(e.target.value)}
                          className="mr-2 h-5 w-5 accent-red-500"
                        />
                        <span>Automatic</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Test Drive Location */}
                  <div className="form-group">
                    <label className="block text-gray-700 mb-2 font-medium">Test Drive Location</label>
                    <div className="flex gap-4 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setTestDriveLocation('Home')}
                        className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                          TestDriveLocation === 'Home' 
                            ? 'bg-black text-white shadow-md' 
                            : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <FaHome className="text-lg" /> At Home
                      </button>
                      <button
                        type="button"
                        onClick={() => setTestDriveLocation('DealerShip')}
                        className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                          TestDriveLocation === 'DealerShip' 
                            ? 'bg-black text-white shadow-md' 
                            : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <BiSolidCarGarage className="text-lg" /> At Dealership
                      </button>
                    </div>
                  </div>
                  
                  {/* Date Selection */}
                  <div className="form-group">
                    <label htmlFor="selectedDate" className="block text-gray-700 mb-2 font-medium">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-red-500" />
                        <span>Select a Date</span>
                      </div>
                    </label>
                    <input
                      type="date"
                      id="selectedDate"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={minDate}
                      required
                      className="w-full px-4 py-2 border-2 rounded-xl transition-colors duration-300 focus:border-red-500 focus:outline-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">Select a date starting from today</p>
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-xl text-white font-bold transition-all duration-300 ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-300/50'
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : 'Book Test Drive'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h2>
                <p className="text-xl text-gray-600 mb-8">Your test drive has been booked successfully.</p>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => isclick(false)} 
                    className="w-full py-3 px-6 bg-red-600 text-white font-bold rounded-xl transition-all duration-300 hover:bg-red-700"
                  >
                    Book Another Test Drive
                  </button>
                  
                  <Link href="/home" className="block w-full">
                    <div className="py-3 px-6 border-2 border-gray-300 text-gray-700 font-bold rounded-xl transition-all duration-300 hover:bg-gray-100">
                      Return to Homepage
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default Testdrive;