import React, { useEffect, useState } from 'react'
import ScrollTrigger from 'react-scroll-trigger'
import EmblaCarousel from '@/Components/layouts/EmblaCarousel'
import Counter from '@/Components/layouts/counter'
import Product from '@/Components/layouts/products'
import Dealer from '@/Components/layouts/dealers'
import Testimonals from '@/Components/layouts/testimonal'
import BlogComponet from '@/Components/layouts/blogComponent'
import search from '../../public//svgs/search-iconw.svg'
import Image from 'next/image'
import Link from 'next/link'
import { IoCarSportSharp } from "react-icons/io5";
import { FaCheckCircle, FaUserPlus } from "react-icons/fa";
import { IoIosCar } from "react-icons/io"
import { FaArrowRightLong, FaUserGraduate } from "react-icons/fa6";
import { TbBrandStackshare } from "react-icons/tb";
import { MdOutlinePriceChange } from "react-icons/md";
import aftaboutcar from '../../public//pngs/01-aftabout.png'
import carrepairicon from '../../public//pngs/car-repair.png'
import choosecar from '../../public//pngs/chooseus-car.png'
import brand1img from '../../public//pngs/1-brandimg.png'
import brand2img from '../../public//pngs/2-brandimg.png'
import brand3img from '../../public//pngs/3-brandimg.png'
import brand4img from '../../public//pngs/4-brandimg.png'
import brand5img from '../../public//pngs/5-brandimg.png'
import brand6img from '../../public//pngs/6-brandimg.png'
const index = () => {
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
        <p className='text-black font-semibold text-2xl pt-5 pl-6 pb-3 tracking-widest'>Let's Find Your Perfect Car</p>
        <hr className='border-solid ml-6 mr-6 ' />
        <div className='Form-search grid grid-cols-3'>
          <form className="Car Condition max-w-64 ml-10">
            <label htmlFor="Condition" className="block mb-2 mt-10 text-sm font-medium text-gray-900 dark:text-white">Car Condition</label>
            <select id="Condition" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-accent block w-full p-2.5 dark:bg-red-400 dark:border-accent dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-400 dark:focus:border-red-500">
              <option defaultValue className='text-accent'>All Status</option>
              <option defaultValue="NC">New Car</option>
              <option defaultValue="UC">Used Car</option>
            </select>
          </form>
          <form className="Brand max-w-64 ml-3">
            <label htmlFor="Brand-Name" className="block mb-2 mt-10 text-sm font-medium text-gray-900 dark:text-white">Brand Name</label>
            <select id="Brand-Name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-accent block w-full p-2.5 dark:bg-red-400 dark:border-accent dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-400 dark:focus:border-red-500">
              <option defaultValue className='text-accent'>All Brands</option>
              <option defaultValue="BMW">BMW</option>
              <option defaultValue="Ferrari">Ferrari</option>
              <option defaultValue="MD">Mercedes-Benz</option>
              <option defaultValue="Hyundai">Hyundai</option>
              <option defaultValue="Nisan">Nisan</option>
            </select>
          </form>
          <form className="Brand max-w-64 ml-3">
            <label htmlFor="Car-Model" className="block mb-2 mt-10 text-sm font-medium text-gray-900 dark:text-white">Car Model</label>
            <select id="Car-Model" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-accent block w-full p-2.5 dark:bg-red-400 dark:border-accent dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-400 dark:focus:border-red-500">
              <option defaultValue className='text-accent'>All Model</option>
              <option defaultValue="3Series">3Series</option>
              <option defaultValue="G-TR">G-TR</option>
              <option defaultValue="Maccan">Maccan</option>
              <option defaultValue="Hyundai">Hyundai</option>
              <option defaultValue="N-Series">N-Series</option>
            </select>
          </form>
          <form className="Brand max-w-64 ml-10 ">
            <label htmlFor="Choose-Year" className="block mb-2 mt-10 text-sm font-medium text-gray-900 dark:text-white">Choose Year</label>
            <select id="Choose-Year" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-accent block w-full p-2.5 dark:bg-red-400 dark:border-accent dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-400 dark:focus:border-red-500">
              <option defaultValue className='text-accent'>All Year</option>
              <option defaultValue="2023">2023</option>
              <option defaultValue="2022">2022</option>
              <option defaultValue="2021">2021</option>
              <option defaultValue="2020">2020</option>
            </select>
          </form>
          <form className="Brand max-w-64 ml-3">
            <label htmlFor="Choose-Year" className="block mb-2 mt-10 text-sm font-medium text-gray-900 dark:text-white">Choose Year</label>
            <select id="Choose-Year" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-accent block w-full p-2.5 dark:bg-red-400 dark:border-accent dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-400 dark:focus:border-red-500">
              <option defaultValue className='text-accent'>All Year</option>
              <option defaultValue="$1-$5">$1000-$5000</option>
              <option defaultValue="$5-$10">$5000-$10000</option>
              <option defaultValue="$10-$15">$10000-$15000</option>
              <option defaultValue="$15-$20">$15000-$20000</option>
            </select>
          </form>
          <button className=' theme-btn max-w-64  mt-16 ml-4 h-15 flex items-center justify-center gap-1 '><Image src={search} alt='Search icon' ></Image>Find Your Car</button>
        </div>
      </div>
      <ScrollTrigger onEnter={() => setIsEntered(true)} onExit={() => setIsEntered(false)}>
        <div className="about-experience h-3/4 flex mb-48" >
          <div className={`about-exp-left ml-[170px] top-8 ${isEntered ? 'animate-fadeinleft' : ''}`}>
            <div className="qualityexp bg-black flex items-center gap-1 border-none rounded-xl h-16  w-60 absolute">
              <p className='bg-accent h-14 w-14 border-none rounded-xl m-2 flex items-center justify-center'><Image alt="after" src={carrepairicon} className='h-10 w-10 '></Image></p>
              <p className='text-white font-bold'>30 Years Of Quality Service</p>
            </div>/pngs
            <Image  alt="" src={aftaboutcar} ></Image>
          </div>
          <div className={`about-exp-right ml-14 ${isEntered ? 'animate-fadeinright' : ''}`}>
            <span className='text-accent flex  gap-2 items-center text-xl font-semibold'><IoCarSportSharp /> About US</span>
            <p className='text-[3rem] font-bold w-[65%]'>World Largest <span className='text-accent'> Car Dealer</span> Marketplace.</p>
            <p className='text-bodytextcolor'>The world's largest car dealer marketplace offers a vast selection of new <br /> and used vehicles, connecting buyers with dealerships globally.</p>
            <p className='text-accent flex text-center font-semibold text-base mt-4 gap-2'><span className='mt-1'><FaCheckCircle /></span><span className='text-bodytextcolor flex text-center'>Largest global platform htmlFor car buying and selling.</span></p>
            <p className='text-accent flex text-center font-semibold text-base mt-4 gap-2'><span className='mt-1'><FaCheckCircle /></span><span className='text-bodytextcolor flex text-center'>Connects buyers with trusted dealerships worldwide.</span></p>
            <p className='text-accent flex text-center font-semibold text-base mt-4 gap-2'><span className='mt-1'><FaCheckCircle /></span><span className='text-bodytextcolor flex text-center'>Extensive inventory of new and used vehicles.</span></p>
            <Link  href={"/about"}><button className=' theme-btn max-w-48 mt-8 h-15 flex items-center justify-center gap-1 '>Discover More <FaArrowRightLong /></button></Link>
          </div>
        </div>
      </ScrollTrigger>
      <div>
        <Counter />
      </div>
      <div className="new-arrival h-[120px] w-screen flex flex-col items-center mt-32">
        <span className='text-accent text-xl flex items-center gap-2 font-bold tracking-widest'> <IoIosCar />NEW ARRIVALS</span>
        <span className='text-5xl font-bold tracking-wide'>Let's Check Latest <span className='text-accent'>Cars</span></span>
        <div className="divider"></div>
      </div>
      <Product />
      <Dealer />
      <div className="Choose-us bg-black h-[90vh] flex justify-between">
        <div className="left-choose ml-32 ">
          <div className="heading-top text-white mt-6 text-2xl flex gap-1 items-center ">
            <IoIosCar />Why Choose Us
          </div>
          <p className='heading text-white text-5xl font-bold mt-2'>We are dedicated <span className='text-accent'>to <br /> provide</span> quality service</p>
          <p className='description text-white text-base mt-3 mb-3 '>We are committed to delivering exceptional quality in every service we provide,<br /> ensuring customer satisfaction and trust. Our goal is to exceed expectations with <br /> reliable and professional solutions tailored to your needs.</p>
          <Image  src={choosecar} height={300} width={600} alt='car-img'></Image>
        </div>
        <div className="right-choose">
          <div className="cards mr-32 mt-10 grid grid-cols-2">
            <div className="card1 mt-10 mr-2 bg-white boredr-none rounded-xl h-64 w-60"><div className="icon-text flex justify-between items-center ml-3 mr-5"><p className='bg-accent h-16 w-16 border-none rounded-full flex items-center justify-center'><Image alt="after" src={carrepairicon} className='h-10 w-10 '></Image></p>
              <p className='choose-count'>01</p></div>
              <p className='heading text-black text-lg font-semibold ml-3'>Best Quality Cars</p>
              <p className='description ml-3 text-bodytextcolor'>Offering the finest selection of top-quality cars, combining performance, reliability, and value.</p>
            </div>
            <div className="card2  mr-10 bg-white boredr-none rounded-xl h-64 w-60"><div className="icon-text flex justify-between items-center ml-3 mr-5"><p className='bg-accent text-white h-16 w-16 border-none rounded-full flex items-center justify-center'><FaUserGraduate className='h-10 w-10 ' /></p>
              <p className='choose-count'>02</p></div>
              <p className='heading text-black text-lg font-semibold ml-3'>Certified Mechanics</p>
              <p className='description ml-3 text-bodytextcolor'>Expert certified mechanics ensuring your vehicle receives top-tier maintenance and care.</p>
            </div>
            <div className="card3 mt-5 mr-2 bg-white boredr-none rounded-xl h-64 w-60"><div className="icon-text flex justify-between items-center ml-3 mr-5"><p className='bg-accent text-white h-16 w-16 border-none rounded-full flex items-center justify-center'>< TbBrandStackshare className='h-10 w-10 ' /></p>
              <p className='choose-count'>03</p></div>
              <p className='heading text-black text-lg font-semibold ml-3'>Popular Brands</p>
              <p className='description ml-3 text-bodytextcolor'>Featuring a wide selection of popular car brands known for quality and performance.</p>
            </div>
            <div className="card4 mt-[-1.25rem] mr-10 bg-white boredr-none rounded-xl h-64 w-60"><div className="icon-text flex justify-between items-center ml-3 mr-5"><p className='bg-accent text-white h-16 w-16 border-none rounded-full flex items-center justify-center'>< MdOutlinePriceChange className='h-10 w-10 ' /></p>
              <p className='choose-count'>04</p></div>
              <p className='heading text-black text-lg font-semibold ml-3'>Reasonable Price</p>
              <p className='description ml-3 text-bodytextcolor'>Offering the finest selection of top-quality cars, combining performance, reliability, and value.</p>
            </div></div>
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
              <div className={`${data.id} bg-themebglight mr-5 w-52 h-48 flex flex-col justify-center border-none rounded-xl items-center mt-10 hover:animate-fadeup`}>
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
export default index
