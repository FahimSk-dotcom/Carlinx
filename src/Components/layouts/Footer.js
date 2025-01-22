import React from 'react'
import Image from 'next/image'
import { FiPhone } from "react-icons/fi"
import { MdOutlineLocationOn } from "react-icons/md"
import { MdOutlineEmail } from "react-icons/md";
import logo from '../../../Assets/jpgs/logo-footer.jpg'
import { MdArrowRight } from "react-icons/md"
import Link from 'next/link';
import { SlSocialFacebook } from "react-icons/sl";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
const Footer = () => {
  return (
    <>
      <footer className="Footer h-[600px] w-screen bg-black text-white">
        <div className="footer-wrapper pt-32 flex gap-10">
          <div className="content-logo flex flex-col w-[25%] relative left-32 text-white">
            <div className="logo flex relative mt-[-20px]">
              <Image src={logo} height={200} width={250} alt='logo'></Image>
            </div>
            <p className=' mt-8 '>Carlinx simplifies the buying and selling of Cars and Auto parts with a seamless, userfriendly platform.
              Explore, trade, and manage your automotive needs with ease through our comprehensive service</p>
            <ul className='flex flex-col text-white mt-4 text-lg'>
              <li className='flex gap-2 mt-4 items-center'><span className='flex items-center justify-center h-8 w-8 bg-accent boredr-none rounded-xl font-bold'><FiPhone /></span><a href="tel:+918976946230">+91 12 6405 7898</a></li>
              <li className='flex gap-2 mt-4 items-center'><span className='flex items-center justify-center h-8 w-8 bg-accent boredr-none rounded-xl font-b'><MdOutlineLocationOn /></span>Located at 178 Cst Road, Mumbai, India</li>
              <li className='flex gap-2 mt-4 items-center'><span className='flex items-center justify-center h-8 w-8 bg-accent boredr-none rounded-xl font-bold'><MdOutlineEmail /></span> <a href="mailto:skfahim0504@gmail.com">info@Carlinx.com</a></li>
            </ul>
          </div>
          <div className="QuickLinks relative left-[140px]">
            <div className=' font-semibold text-xl tracking-wide relative left-[43] bottom-[45]'>Quick Links
              <div className="divider-footer"><hr className='border-bodytextcolor border w-24 ml-2 mt-1' /></div></div>
            <ul >
              <Link  href={"/about"}><li className='flex items-center gap-2 text-xl relative left-[43] bottom-[45] mt-6 mb-2 font-medium  cursor-pointer hover:translate-x-3 hover:text-accent transition-all'><span className='text-accent text-2xl font-bold'><MdArrowRight /></span> About us</li></Link>
              <Link  href={"/blog"}><li className='flex items-center gap-2 text-xl relative left-[43] bottom-[45] mt-2 mb-2 font-medium  cursor-pointer hover:translate-x-3 hover:text-accent transition-all'><span className='text-accent text-2xl font-bold'><MdArrowRight /></span>  Testimonials</li></Link>
              
              <Link  href={"/dealers"}><li className='flex items-center gap-2 text-xl relative left-[43] bottom-[45] mt-2 font-medium  cursor-pointer hover:translate-x-3 hover:text-accent transition-all'><span className='text-accent text-2xl font-bold'><MdArrowRight /></span> Our Dealers</li></Link>
            </ul>
          </div>
          <div className="Support Center relative left-[160px]">
            <div className=' font-semibold text-xl tracking-wide relative left-[65] bottom-[73]'>Support Center
              <div className="divider-footer"><hr className='border-bodytextcolor border w-28 ml-4 mt-1' /></div></div>
            <ul >
              <Link  href={"/sell"}><li className='flex items-center gap-2 text-xl  mt-6 mb-2 font-medium hover:translate-x-3 cursor-pointer  hover:text-accent transition-all'><span className='text-accent text-2xl font-bold'><MdArrowRight /></span> Sell Vehicle</li></Link>
              <Link  href={"/testdrive"}><li className='flex items-center gap-2 text-xl  mt-2  font-medium hover:translate-x-3 cursor-pointer  hover:text-accent transition-all'><span className='text-accent text-2xl font-bold'><MdArrowRight /></span> Test Drive</li></Link>
              <Link  href={"/contactus"}><li className='flex items-center gap-2 text-xl  mt-2  font-medium hover:translate-x-3 cursor-pointer  hover:text-accent transition-all'><span className='text-accent text-2xl font-bold'><MdArrowRight /></span> Contact us</li></Link>
            </ul>
          </div>
        </div>
        <div className="copyright ">
          <div className="left">
            <h2 className=''>&copy; Copyright 1024 <span className='text-accent'>Carlinx</span> All Rights Reserved.</h2></div>
          <div className="right flex gap-2 ">
              <li className='flex justify-center items-center text-accent bg-white font-semibold text-xl h-10 w-10 border-none rounded-xl hover:text-white hover:bg-black  transition-all'><SlSocialFacebook /></li>
              <li className='flex justify-center items-center text-accent bg-white font-semibold text-xl h-10 w-10 border-none rounded-xl hover:text-white hover:bg-black transition-all' transition-all><FaInstagram /></li>
              <li className='flex justify-center items-center text-accent bg-white font-semibold text-xl h-10 w-10 border-none rounded-xl hover:text-white hover:bg-black transition-all'><FaLinkedinIn/></li>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
