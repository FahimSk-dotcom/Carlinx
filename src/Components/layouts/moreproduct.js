import {React,useState}from 'react';
import Image from 'next/image'; // Assuming you're using Next.js for image optimization
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'; // Make sure these icons are correctly imported
import { FaRegEye } from 'react-icons/fa';
import { RiStarFill } from 'react-icons/ri';
import { TbSteeringWheel } from 'react-icons/tb';
import { GiRoad } from 'react-icons/gi';
import { IoIosCar } from 'react-icons/io';
import { LuFuel } from 'react-icons/lu';

const MoreProduct = ({ carsdata = [] }) => {
    const [isHovered, setIsHovered] = useState(null);
    const [isEntered, setIsEntered] = useState(false);
    const handleMouseEnter = (CardID) => {
      setIsHovered(CardID);
    };
    const handleMouseLeave = () => {
      setIsHovered(null);
    };
  // Ensure carsdata is not undefined and is an array
  if (!carsdata || carsdata.length === 0) {
    return <p>No cars available</p>;
  }

  return (
    <>
      {carsdata.map((car, index) => (
        <div key={index} className="prod1 h-[400px] ml-16 shadow-white shadow-xl w-72  bg-white flex justify-center border-none rounded">
          <div className="card5 ml-4">
            <div onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
              <div className="flex">
                <p className="text-white font-semibold inline p-1 border-none rounded relative bg-accent top-10 left-2 z-10">
                  {car.condition} {/* For example, "Used" */}
                </p>
                <div
                  className={`text-white font-semibold bg-accent h-8 w-8 flex justify-center items-center border-none rounded-full relative top-10 opacity-0 z-10 hover:text-white hover:bg-black ${
                    isHovered == index ? 'left-[69%] z-10 opacity-100 animate-fadein' : 'opacity-0 z-0'
                  }`}
                >
                  <FavoriteBorderOutlinedIcon />
                </div>
              </div>
              <Image src={car.image} width={250} height={100} className="border-none rounded hover:scale-105 transition-all" />
            </div>
            <p className="text-xl font-semibold mt-2 hover:text-accent ">{car.name}</p>
            <p className="text-yellow-400 flex items-center gap-1 mt-2">
              <RiStarFill /> <RiStarFill /> <RiStarFill /> <RiStarFill /> <RiStarFill />{' '}
              <span className="text-bodytextcolor">{car.rating} ({car.reviews} Reviews)</span>
            </p>
            <ul className="grid grid-cols-2">
              <li className="text-accent mt-2 flex gap-2 items-center">
                <TbSteeringWheel />
                <span className="text-bodytextcolor">{car.transmission}</span>
              </li>
              <li className="text-accent mt-2 flex ml-[-1rem] items-center">
                <GiRoad />
                <span className="text-bodytextcolor">{car.fuelEfficiency}</span>
              </li>
              <li className="text-accent mt-2 flex gap-2 items-center">
                <IoIosCar />
                <span className="text-bodytextcolor">Model: {car.model}</span>
              </li>
              <li className="text-accent mt-2 flex gap-2 items-center">
                <LuFuel />
                <span className="text-bodytextcolor">{car.fuelType}</span>
              </li>
            </ul>
            <hr className="mt-4" />
            <div className="price-details flex gap-10">
              <p className="price text-accent font-bold text-xl mt-4">${car.price}</p>
              <button className="theme-btn max-w-64 h-10 mt-2 flex items-center justify-center gap-1">
                <FaRegEye />
                Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MoreProduct;
