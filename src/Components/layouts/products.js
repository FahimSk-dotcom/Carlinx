import React, { useState } from 'react';
import ScrollTrigger from 'react-scroll-trigger';
import Image from 'next/image';
import { RiStarFill } from "react-icons/ri";
import { IoStarHalfSharp } from "react-icons/io5";
import { GiRoad } from "react-icons/gi";
import { FaArrowRotateRight } from "react-icons/fa6";
import { IoIosCar } from "react-icons/io";
import { TbSteeringWheel } from "react-icons/tb";
import { LuFuel } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import car1 from '../../../public/jpgs/car01.jpg';
import car2 from '../../../public/jpgs/car02.jpg';
import car3 from '../../../public/jpgs/car03.jpg';
import car4 from '../../../public/jpgs/car04.jpg';
import car5 from '../../../public/jpgs/car05.jpg';
import car6 from '../../../public/jpgs/car06.jpg';
import car7 from '../../../public/jpgs/car07.jpg';
import car8 from '../../../public/jpgs/car08.jpg';
const DefaultData = [
  {
    id: 1,
    name: 'Mercedes Benz Car',
    price: '$45,620',
    image: car1,
    rating: 5.0,
    reviews: '58.5k',
    transmission: 'Automatic',
    mileage: '10.15km / 1-litre',
    model: '2023',
    fuel: 'Hybrid',
  },
  {
    id: 2,
    name: 'Yellow Ferrari 458',
    price: '$90,250',
    image: car2,
    rating: 5.0,
    reviews: '58.5k',
    transmission: 'Automatic',
    mileage: '8.15km / 1-litre',
    model: '2022',
    fuel: 'Hybrid',
  },
  {
    id: 3,
    name: 'Black Audi Q7',
    price: '$44,350',
    image: car3,
    rating: 4.0,
    reviews: '50.5k',
    transmission: 'Manual',
    mileage: '12.15km / 1-litre',
    model: '2020',
    fuel: 'Premium Gas',
  },
  {
    id: 4,
    name: 'BMW Sports Car',
    price: '$78,760',
    image: car4,
    rating: 4.5,
    reviews: '50.5k',
    transmission: 'Manual',
    mileage: '11.15km / 1-litre',
    model: '2021',
    fuel: 'Petrol',
  },
  {
    id: 5,
    name: 'White Tesla Car',
    price: '$64,230',
    image: car5,
    rating: 5.0,
    reviews: '58.5k',
    transmission: 'Manual',
    mileage: '7.15km / 1-litre',
    model: '2023',
    fuel: 'Hybrid',
  },
  {
    id: 6,
    name: 'White Nissan Car',
    price: '$34,540',
    image: car6,
    rating: 3.5,
    reviews: '35.5k',
    transmission: 'Manual',
    mileage: '9.15km / 1-litre',
    model: '2019',
    fuel: 'Diesel',
  },
  {
    id: 7,
    name: 'Mercedes Benz SUV',
    price: '$60,500',
    image: car7,
    rating: 3.5,
    reviews: '35.5k',
    transmission: 'Automatic',
    mileage: '10.15km / 1-litre',
    model: '2021',
    fuel: 'Hybrid',
  },
  {
    id: 8,
    name: 'Red Hyundai Car',
    price: '$25,620',
    image: car8,
    rating: 5.0,
    reviews: '70.2k',
    transmission: 'Automatic',
    mileage: '9.5km / 1-litre',
    model: '2023',
    fuel: 'Hybrid',
  }
];

const Products = (carsdata) => {
  const [isHovered, setIsHovered] = useState(null);
  const [isEntered, setIsEntered] = useState(false);
  const handleMouseEnter = (CardID) => {
    setIsHovered(CardID);
  };
  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  return (
    <ScrollTrigger onEnter={() => setIsEntered(true)} onExit={() => setIsEntered(false)}>
      
      <div className={`container flex flex-wrap justify-center ${isEntered ? 'animate-fadeup' : ''}`}>
        {DefaultData.map((car) => (
          <div key={car.id} className="Card h-[400px] m-4 shadow-white shadow-xl w-72 bg-white flex justify-center border-none rounded">
            <div className='card ml-4'>
              <div onMouseEnter={() => { handleMouseEnter(car.id) }} onMouseLeave={handleMouseLeave}>
                <div className='flex '>
                  <p className='text-white font-semibold inline p-1 border-none rounded relative bg-accent top-10 left-2 z-10'>Used</p>
                  <div className={`text-white font-semibold bg-accent h-8 w-8 flex justify-center items-center border-none rounded-full relative top-10 opacity-0 z-10 hover:text-white hover:bg-black ${isHovered === car.id ? 'left-[69%] z-10 opacity-100 animate-fadein' : 'opacity-0 z-0 '} `}>
                    <FavoriteBorderOutlinedIcon />
                  </div>
                </div>
                <Image src={car.image} width={250} height={100} className='border-none rounded hover:scale-105 transition-all' />
              </div>
              <p className='text-xl font-semibold mt-2 hover:text-accent'>{car.name}</p>
              <p className='text-yellow-400 flex items-center gap-1 mt-2'>
                {[...Array(Math.floor(car.rating))].map((_, i) => <RiStarFill key={i} />)}
                {car.rating % 1 !== 0 && <IoStarHalfSharp />}
                <span className='text-bodytextcolor'>{car.rating} ({car.reviews} Review)</span>
              </p>
              <ul className='grid grid-cols-2'>
                <li className='text-accent mt-2 flex gap-2 items-center'><TbSteeringWheel /><span className='text-bodytextcolor'>{car.transmission}</span></li>
                <li className='text-accent mt-2 flex ml-[-1rem] items-center'><GiRoad /><span className='text-bodytextcolor'>{car.mileage}</span></li>
                <li className='text-accent mt-2 flex gap-2 items-center'><IoIosCar /><span className='text-bodytextcolor'>Model: {car.model}</span></li>
                <li className='text-accent mt-2 flex gap-2 items-center'><LuFuel /><span className='text-bodytextcolor'>{car.fuel}</span></li>
              </ul>
              <hr className='mt-4' />
              <div className="price-details flex gap-10">
                <p className='price text-accent font-bold text-xl mt-4'>{car.price}</p>
                <button className='theme-btn max-w-64 h-10 mt-2 flex items-center justify-center gap-1'>
                  <FaRegEye />Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="loadmore h-20 w-screen justify-center flex mt-10">
        <button  className=' theme-btn max-w-64 h-12  flex items-center justify-center gap-1 '>Load More<FaArrowRotateRight /></button></div>
    </ScrollTrigger>
  )
};

export default Products;


