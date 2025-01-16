import { React, useState } from 'react'
import Breadcrumb from '@/Components/layouts/BreadCrumb'
import Image from 'next/image'
import ScrollTrigger from 'react-scroll-trigger'
import carrepairicon from '../../../Assets/pngs/car-repair.png'
import aftaboutcar from '../../../Assets/pngs/01-aftabout.png'
import teamposter1 from '../../../Assets/jpgs/teamposter1.jpg'
import teamposter2 from '../../../Assets/jpgs/teamposter2.jpg'
import teamposter3 from '../../../Assets/jpgs/teamposter3.jpg'
import teamposter4 from '../../../Assets/jpgs/teamposter4.jpg'
import { FaCheckCircle } from "react-icons/fa";
import { IoCarSportSharp } from "react-icons/io5";
import Counter from '@/Components/layouts/counter'
import Testimonals from '@/Components/layouts/testimonal'
import brand1img from '../../../Assets/pngs/1-brandimg.png'
import brand2img from '../../../Assets/pngs/2-brandimg.png'
import brand3img from '../../../Assets/pngs/3-brandimg.png'
import brand4img from '../../../Assets/pngs/4-brandimg.png'
import brand5img from '../../../Assets/pngs/5-brandimg.png'
import brand6img from '../../../Assets/pngs/6-brandimg.png'
import { IoIosCar } from 'react-icons/io'

const About = () => {
  const [isEntered, setIsEntered] = useState(false);
  const teamdata = [
    {
      id: 1,
      img: teamposter1,
      Name: "Chad Smith",
      role: 'HR Manager'
    },
    {
      id: 2,
      img: teamposter2,
      Name: "Malissa Fie",
      role: 'Technician'
    },
    {
      id: 3,
      img: teamposter3,
      Name: "Arron Rodri",
      role: 'CEO & Founder'
    },
    {
      id: 4,
      img: teamposter4,
      Name: "Tony Pinto",
      role: 'Mechanical Engineer'
    }
  ]
  const branddata = [
    {
      id: 1,
      img: brand1img,
      text: 'Ferrari'
    },
    {
      id: 2,
      img: brand2img,
      text: 'Hyundai'
    },
    {
      id: 3,
      img: brand3img,
      text: 'Mercedes Benz'
    },
    {
      id: 4,
      img: brand4img,
      text: 'Toyota'
    },
    {
      id: 5,
      img: brand5img,
      text: 'BMW'
    },
    {
      id: 6,
      img: brand6img,
      text: 'Nissan'
    }
  ]
  
  return (
    <>
      <h1 className='text-white absolute left-[44vw] top-60 z-20 text-5xl font-bold'>About us</h1>
      <Breadcrumb />
      <ScrollTrigger onEnter={() => setIsEntered(true)} onExit={() => setIsEntered(false)}>
        <div className="about-experience h-3/4 flex mt-32 mb-8">
          <div className={`about-exp-left ml-[170px] top-8 ${isEntered ? 'animate-fadeinleft' : ''}`}>
            <div className="qualityexp bg-black flex items-center gap-1 border-none rounded-xl h-16  w-60 absolute">
              <p className='bg-accent h-14 w-14 border-none rounded-xl m-2 flex items-center justify-center'>
                <Image alt="Car Repair Icon" src={carrepairicon} className='h-10 w-10 ' />
              </p>
              <p className='text-white font-bold'>30 Years Of Quality Service</p>
            </div>
            <Image alt="After about car" src={aftaboutcar} />
          </div>
          <div className={`about-exp-right ml-14 ${isEntered ? 'animate-fadeinright' : ''}`}>
            <span className='text-accent flex  gap-2 items-center text-xl font-semibold'>
              <IoCarSportSharp /> About US
            </span>
            <p className='text-[3rem] font-bold w-[65%]'>
              World Largest <span className='text-accent'> Car Dealer</span> Marketplace.
            </p>
            <p className='text-bodytextcolor'>
              The world's largest car dealer marketplace offers a vast selection of new <br /> and used vehicles, connecting buyers with dealerships globally.
            </p>
            <p className='text-accent flex text-center font-semibold text-base mt-4 gap-2'>
              <span className='mt-1'><FaCheckCircle /></span>
              <span className='text-bodytextcolor flex text-center'>
                Largest global platform htmlFor car buying and selling.
              </span>
            </p>
            <p className='text-accent flex text-center font-semibold text-base mt-4 gap-2'>
              <span className='mt-1'><FaCheckCircle /></span>
              <span className='text-bodytextcolor flex text-center'>
                Connects buyers with trusted dealerships worldwide.
              </span>
            </p>
            <p className='text-accent flex text-center font-semibold text-base mt-4 gap-2'>
              <span className='mt-1'><FaCheckCircle /></span>
              <span className='text-bodytextcolor flex text-center'>
                Extensive inventory of new and used vehicles.
              </span>
            </p>
          </div>
        </div>
      </ScrollTrigger>
      <div>
        <Counter />
      </div>
      <Testimonals />
      <div className="team h-[80vh] flex flex-col items-center">
        <p className='text-accent tracking-widest text-xl font-medium mt-10'>TEAM</p>
        <p className='text-5xl font-bold mt-2 mb-4'>
          Meet With Our <span className='text-accent'>Team</span>
        </p>
        <div className="divider"></div>
        <div className="cards flex gap-10">
          {teamdata.map((data) => (
            <div key={data.id} className="Card h-[25rem] w-72 border-none rounded-xl">
              <Image src={data.img} height={300} width={260} className='border-none rounded-xl ml-4 mt-4' alt={`${data.Name}'s photo`} />
              <p className='text-2xl font-semibold ml-4 text-center mt-2 hover:text-accent'>{data.Name}</p>
              <p className='text-accent ml-4 text-xl mb-2 text-center tracking-wider'>{data.role}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="Brands h-[70vh] flex flex-col items-center">
        <div className="heading1 flex mt-5 items-center font-semibold text-accent text-2xl tracking-widest">
          <IoIosCar />Popular Brands
        </div>
        <div className="heading2 mt-2 mb-3 text-5xl font-bold">
          Our Top Quality <span className='text-accent'>Brands</span>
        </div>
        <div className="divider"></div>
        <div className="brandscard flex mt-5">
          {branddata.map((data) => (
            <div key={data.id} className={`${data.id} bg-themebglight mr-5 w-52 h-48 flex flex-col justify-center border-none rounded-xl items-center mt-10 hover:animate-fadeup`}>
              <Image src={data.img} alt={data.text} height={156} width={156} />
              <p className=' text-xl font-semibold  hover:text-accent'>{data.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default About
