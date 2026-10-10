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
      <div className='relative'>
        <Breadcrumb title="About Us" />
      </div>
      <ScrollTrigger onEnter={() => setIsEntered(true)} onExit={() => setIsEntered(false)}>
        <div className="about-experience flex flex-col md:flex-row md:items-center gap-8 mt-16 md:mt-32 mb-8 px-4 max-w-7xl mx-auto">
          <div className={`about-exp-left relative top-8 ${isEntered ? 'animate-fadeinleft' : ''}`}>
            <div className="qualityexp bg-black flex items-center gap-1 border-none rounded-xl h-16  w-60 absolute">
              <p className='bg-accent h-14 w-14 border-none rounded-xl m-2 flex items-center justify-center'>
                <Image alt="Car Repair Icon" src={carrepairicon} className='h-10 w-10 ' />
              </p>
              <p className='text-white font-bold text-sm'>30 Years Of Quality Service</p>
            </div>
            <Image alt="After about car" src={aftaboutcar} height={600} width={700} className='max-w-full h-auto object-contain' />
          </div>
          <div className={`about-exp-right ${isEntered ? 'animate-fadeinright' : ''}`}>
            <span className='text-accent flex  gap-2 items-center text-xl font-semibold'>
              <IoCarSportSharp /> About US
            </span>
            <p className='text-4xl lg:text-[3rem] font-bold w-full lg:w-[65%] leading-tight'>
              World Largest <span className='text-accent'> Car Dealer</span> Marketplace.
            </p>
            <p className='text-bodytextcolor'>
              The world&#8217;s largest car dealer marketplace offers a vast selection of new <br className='hidden md:block' /> and used vehicles, connecting buyers with dealerships globally.
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
      <div className="team py-16 flex flex-col items-center">
        <p className='text-accent tracking-widest text-xl font-medium mt-10'>TEAM</p>
        <p className='text-3xl md:text-5xl font-bold mt-2 mb-4 text-center'>
          Meet With Our <span className='text-accent'>Team</span>
        </p>
        <div className="divider"></div>
        <div className="cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto w-full mt-8">
          {teamdata.map((data) => (
            <div key={data.id} className="Card border-none rounded-xl p-4 flex flex-col items-center">
              <Image src={data.img} height={300} width={260} className='border-none rounded-xl w-full max-w-[260px] h-auto object-cover' alt={`${data.Name}'s photo`} />
              <p className='text-2xl font-semibold text-center mt-2 hover:text-accent'>{data.Name}</p>
              <p className='text-accent text-xl mb-2 text-center tracking-wider'>{data.role}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="Brands py-16 flex flex-col items-center">
        <div className="heading1 flex mt-5 items-center font-semibold text-accent text-2xl tracking-widest">
          <IoIosCar />Popular Brands
        </div>
        <div className="heading2 mt-2 mb-3 text-3xl md:text-5xl font-bold text-center">
          Our Top Quality <span className='text-accent'>Brands</span>
        </div>
        <div className="divider"></div>
        <div className="brandscard flex flex-wrap justify-center gap-4 sm:gap-5 mt-8 px-4">
          {branddata.map((data) => (
            <div key={data.id} className={`${data.id} bg-themebglight w-40 sm:w-52 p-3 flex flex-col justify-center border-none rounded-xl items-center hover:animate-fadeup`}>
              <Image src={data.img} alt={data.text} height={156} width={156} className='w-full h-auto object-contain' />
              <p className=' text-xl font-semibold  hover:text-accent text-center'>{data.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default About;
