import React, { useEffect, useState } from 'react'
import ScrollTrigger from 'react-scroll-trigger'
import EmblaCarousel from '@/Components/layouts/EmblaCarousel'
import Counter from '@/Components/layouts/counter'
import Product from '@/Components/layouts/products'
import Dealer from '@/Components/layouts/dealers'
import Testimonals from '@/Components/layouts/testimonal'
import BlogComponet from '@/Components/layouts/blogComponent'
import search from '../../Assets/svgs/search-iconw.svg'
import Image from 'next/image'
import Link from 'next/link'
import { IoCarSportSharp } from "react-icons/io5";
import { FaCheckCircle, FaUserPlus } from "react-icons/fa";
import { IoIosCar } from "react-icons/io"
import { FaArrowRightLong, FaUserGraduate } from "react-icons/fa6";
import { TbBrandStackshare } from "react-icons/tb";
import { MdOutlinePriceChange } from "react-icons/md";
import aftaboutcar from '../../Assets/pngs/01-aftabout.png'
import carrepairicon from '../../Assets/pngs/car-repair.png'
import choosecar from '../../Assets/pngs/chooseus-car.png'
import brand1img from '../../Assets/pngs/1-brandimg.png'
import brand2img from '../../Assets/pngs/2-brandimg.png'
import brand3img from '../../Assets/pngs/3-brandimg.png'
import brand4img from '../../Assets/pngs/4-brandimg.png'
import brand5img from '../../Assets/pngs/5-brandimg.png'
import brand6img from '../../Assets/pngs/6-brandimg.png'

const Index = () => {
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
  const [isEntered, setIsEntered] = useState(false);
  return (
    <>
      <EmblaCarousel />
      <div key={"Search"} className="Search bg-white shadow-lg ">
        <p className='text-black font-semibold text-2xl pt-5 pl-6 pb-3 tracking-widest'>Let&#8217;s Find Your Perfect Car</p>
        <hr className='border-solid ml-6 mr-6 ' />
        <div className='Form-search grid grid-cols-3'>
          {/* Other form elements */}
          <button className=' theme-btn max-w-64  mt-16 ml-4 h-15 flex items-center justify-center gap-1 '><Image src={search} alt='Search icon' ></Image>Find Your Car</button>
        </div>
      </div>
      <ScrollTrigger onEnter={() => setIsEntered(true)} onExit={() => setIsEntered(false)}>
        <div className="about-experience h-3/4 flex mb-48" >
          <div className={`about-exp-left ml-[170px] top-8 ${isEntered ? 'animate-fadeinleft' : ''}`}>
            <div className="qualityexp bg-black flex items-center gap-1 border-none rounded-xl h-16  w-60 absolute">
              <p className='bg-accent h-14 w-14 border-none rounded-xl m-2 flex items-center justify-center'><Image alt="after" src={carrepairicon} className='h-10 w-10 '></Image></p>
              <p className='text-white font-bold'>30 Years Of Quality Service</p>
            </div>
            <Image  alt="" src={aftaboutcar} ></Image>
          </div>
          <div className={`about-exp-right ml-14 ${isEntered ? 'animate-fadeinright' : ''}`}>
            <span className='text-accent flex  gap-2 items-center text-xl font-semibold'><IoCarSportSharp /> About US</span>
            <p className='text-[3rem] font-bold w-[65%]'>World Largest <span className='text-accent'> Car Dealer</span> Marketplace.</p>
            {/* Other content */}
          </div>
        </div>
      </ScrollTrigger>
      <div>
        <Counter />
      </div>
      <div className="new-arrival h-[120px] w-screen flex flex-col items-center mt-32">
        <span className='text-accent text-xl flex items-center gap-2 font-bold tracking-widest'> <IoIosCar />NEW ARRIVALS</span>
        <span className='text-5xl font-bold tracking-wide'>Let&#8217;s Check Latest <span className='text-accent'>Cars</span></span>
        <div className="divider"></div>
      </div>
      <Product />
      <Dealer />
      <div className="Choose-us bg-black h-[90vh] flex justify-between">
        <div className="left-choose ml-32 ">
          <div className="heading-top text-white mt-6 text-2xl flex gap-1 items-center "><IoIosCar />Why Choose Us</div>
          <p className='heading text-white text-5xl font-bold mt-2'>We are dedicated <span className='text-accent'>to <br /> provide</span> quality service</p>
          <p className='description text-white text-base mt-3 mb-3 '>We are committed to delivering exceptional quality in every service we provide,<br /> ensuring customer satisfaction and trust. Our goal is to exceed expectations with <br /> reliable and professional solutions tailored to your needs.</p>
          <Image  src={choosecar} height={300} width={600} alt='car-img'></Image>
        </div>
        <div className="right-choose">
          <div className="cards mr-32 mt-10 grid grid-cols-2">
            {/* Cards */}
          </div>
        </div>
      </div>
      <div className="Brands h-[70vh] mt-20 flex flex-col items-center">
        <div className="heading1 flex mt-5 items-center font-semibold text-accent text-2xl tracking-widest">
          <IoIosCar />Popular Brands
        </div>
        <div className="heading2 mt-2 mb-3 text-5xl font-bold">Our Top Quality<span className='text-accent'>Brands</span></div>
        <div className="divider"></div>
        <div className="brandscard flex mt-5">
          {
            branddata.map((data) => (
              <div key={data.id} className={`${data.id} bg-themebglight mr-5 w-52 h-48 flex flex-col justify-center border-none rounded-xl items-center mt-10 hover:animate-fadeup`}>
                <Image src={data.img} alt="" height={156} width={156}></Image>
                <p className=' text-xl font-semibold  hover:text-accent'>{data.text}</p>
              </div>
            ))
          }
        </div>
      </div>
      <Testimonals />
      <BlogComponet />
    </>
  )
}
export default Index
