import React, { useState } from 'react';
import Image from 'next/image';
import testcover from '../../../public/jpgs/testcover.webp';
import { FaHome } from "react-icons/fa";
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if(pnumber.length<10||pnumber.length>10){
      alert("Incorrect phone number")
    }
    else{
    const res = await fetch('/api/testdrive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({ name, pnumber, city,brandname,carModel,transmission,TestDriveLocation,selectedDate }),
    });
    const data = await res.json();
    if (res.ok) {
      alert(`TestDrive Booked on ${selectedDate} Sucessfully`)
      setname('');
      setpnumber('');
      setCity('');
      setbrandname('');
      setCarModel('');
      setTransmission('');
      setTestDriveLocation('');
      setSelectedDate('');
      setIsSubmitting(true)
      isclick(true)
    } else {
      alert(data.message || 'An error occurred');
      setIsSubmitting(false);
    }
  }
  };
  return (
    <>
    <form onSubmit={handleSubmit}>
      <h1 className='text-white absolute left-[43vw] top-60 z-20 text-5xl font-bold'>TestDrive</h1>
      <Breadcrumb />
      <div className="container flex mt-16 justify-center">
        <Image src={testcover} height={600} width={600} className="ContactFrom p-8" />
        <div className={`Card  form flex-col mt-16 mb-10 w-2/5 rounded-xl text-xl pl-10 gap-6 ${click ? 'hidden' : 'flex'}`}>
          <h1 className="text-2xl bg-black text-white font-black w-4/6 flex justify-center rounded-3xl mt-4 ml-20">
            Please enter your details.
          </h1>
          <div className="form-group">
            <label htmlFor="Name">Enter Your Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
              required
              placeholder="Your Name"
              className="ml-2 mt-2 border-[2px] rounded-xl h-8 w-64 focus:ring-none"
              style={{ borderColor: '#ced4da', outline: 'none' }}
              onFocus={(e) => (e.target.style.borderColor = '#EF1D26')}
              onBlur={(e) => (e.target.style.borderColor = '#ced4da')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="number">Enter Your Contact:</label>
            <input
              type="number"
              value={pnumber}
              onChange={(e)=>setpnumber(e.target.value)}
              required
              placeholder="Phone Number"
              className="ml-2 border-[2px] rounded-xl h-8 w-64 focus:ring-none"
              style={{ borderColor: '#ced4da', outline: 'none' }}
              onFocus={(e) => (e.target.style.borderColor = '#EF1D26')}
              onBlur={(e) => (e.target.style.borderColor = '#ced4da')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">Enter City or Pincode:</label>
            <input
              type="text"
              value={city}
              onChange={(e)=>setCity(e.target.value)}
              required
              placeholder="Enter city or pincode"
              className="ml-2 border-[2px] rounded-xl h-8 w-64 focus:ring-none"
              style={{ borderColor: '#ced4da', outline: 'none' }}
              onFocus={(e) => (e.target.style.borderColor = '#EF1D26')}
              onBlur={(e) => (e.target.style.borderColor = '#ced4da')}
            />
          </div>
          <div className="form-group flex gap-2">
            <label htmlFor="brandname">Brand Name:</label>
            <select
              id="brandname"
              value={brandname}
              onChange={(e)=>setbrandname(e.target.value)}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-accent block w-96 p-2"
            >
              <option defaultValue>All Brands</option>
              <option value="BMW">BMW</option>
              <option value="Ferrari">Ferrari</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Hyundai">Hyundai</option>
              <option value="Nissan">Nissan</option>
            </select>
          </div>
           <div className="form-group flex relative gap-2">
          <label htmlFor="carModel">Car Model:</label>
          <select
            id="carModel"
            value={carModel}
            onChange={(e)=>setCarModel(e.target.value)}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-accent block w-96 p-2"
          >
            <option defaultValue>All Models</option>
            <option value="3Series">3Series</option>
            <option value="G-TR">G-TR</option>
            <option value="Maccan">Maccan</option>
            <option value="Hyundai">Hyundai</option>
            <option value="N-Series">N-Series</option>
          </select>
        </div>
        
          <div className="form-group flex gap-2" >
            <label>Select Transmission:</label>
            <div className="radio-group flex gap-2">
              <label>
                <input
                  type="radio"
                  name="transmission"
                  value="MANUAL"
                  checked={transmission === 'MANUAL'}
                  onChange={(e)=>setTransmission(e.target.value)}
                />
                MT MANUAL
              </label>
              <label>
                <input
                  type="radio"
                  name="transmission"
                  value="AUTOMATIC"
                  checked={transmission === 'AUTOMATIC'}
                  onChange={(e)=>setTransmission(e.target.value)}
                />
                AT AUTOMATIC
              </label>
            </div>
          </div>
          <div className="form-group flex items-center gap-4">
            <label htmlFor="testDrive">Test Drive Location:</label>
            <button
            type='button'
              onClick={() => setTestDriveLocation('Home')}
              className={`border border-black rounded w-28 h-10 flex items-center justify-center gap-1 ${
                TestDriveLocation === 'Home' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              <FaHome /> Home
            </button>
            <button
            type='button'
              onClick={() => setTestDriveLocation('DealerShip')}
              className={`border border-black rounded w-36 h-10 flex items-center justify-center gap-1 ${
                TestDriveLocation === 'DealerShip' ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              <BiSolidCarGarage className="text-xl" /> DealerShip
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="selectedDate">Select a Date:</label>
            <input
              type="date"
              id="selectedDate"
              value={selectedDate}
              onChange={(e)=>setSelectedDate(e.target.value)}
              required
            />
          </div>
          <button
              type="submit"
              disabled={isSubmitting}
              className={`theme-btn w-32 mb-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submiting...' : 'Submit'}
              
            </button>
        </div>
        <div className={`Card  form flex-col mt-16 mb-10 w-2/5 rounded-xl text-xl pl-10 gap-6  ${click ? 'flex' : 'hidden'}` }>
        <h1 className='text-4xl text-accent mt-10 ml-2'>Want to Book another TestDrive?</h1>
        <button onClick={()=>{isclick(false)}} className='theme-btn w-4/5 ml-5 mt-5'>Yes</button>
        <div className='theme-btn w-4/5 ml-5 mt-5'> <Link href={"/home"}>Back to HomePage</Link></div>
        </div>
      </div>
      </form>
    </>
  );
};

export default Testdrive;
