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
      <footer className="Footer w-full bg-black text-white">
        <div className="footer-wrapper max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 flex flex-col md:flex-row flex-wrap gap-10">
          <div className="content-logo flex flex-col w-full md:w-2/5 lg:w-1/3 text-white">
            <div className="logo flex">
              <Image src={logo} height={200} width={250} alt='logo' className='max-w-full h-auto object-contain'></Image>
            </div>
            <p className=' mt-8 '>Carlinx simplifies the buying and selling of Cars and Auto parts with a seamless, userfriendly platform.
              Explore, trade, and manage your automotive needs with ease through our comprehensive service</p>
            <ul className='flex flex-col text-white mt-4 text-base lg:text-lg'>
              <li className='flex gap-2 mt-4 items-center'><span className='flex-shrink-0 flex items-center justify-center h-8 w-8 bg-accent border-none rounded-xl font-bold'><FiPhone /></span><a href="tel:+918976946230">+91 12 6405 7898</a></li>
              <li className='flex gap-2 mt-4 items-center'><span className='flex-shrink-0 flex items-center justify-center h-8 w-8 bg-accent border-none rounded-xl font-bold'><MdOutlineLocationOn /></span>Located at 178 Cst Road, Mumbai, India</li>
              <li className='flex gap-2 mt-4 items-center'><span className='flex-shrink-0 flex items-center justify-center h-8 w-8 bg-accent border-none rounded-xl font-bold'><MdOutlineEmail /></span> <a href="mailto:skfahim0504@gmail.com">info@Carlinx.com</a></li>
            </ul>
          </div>
          <div className="QuickLinks w-full sm:w-auto md:flex-1">
            <div className='font-semibold text-xl tracking-wide'>Quick Links
              <div className="divider-footer"><hr className='border-bodytextcolor border w-24 mt-1' /></div></div>
            <ul>
              <Link href={"/about"}><li className='flex items-center gap-2 text-lg lg:text-xl mt-6 mb-2 font-medium cursor-pointer hover:translate-x-3 hover:text-accent transition-all'><span className='text-accent text-2xl font-bold'><MdArrowRight /></span> About us</li></Link>
              <Link href={"/blog"}><li className='flex items-center gap-2 text-lg lg:text-xl mt-2 mb-2 font-medium cursor-pointer hover:translate-x-3 hover:text-accent transition-all'><span className='text-accent text-2xl font-bold'><MdArrowRight /></span>  Testimonials</li></Link>

              <Link href={"/dealers"}><li className='flex items-center gap-2 text-lg lg:text-xl mt-2 font-medium cursor-pointer hover:translate-x-3 hover:text-accent transition-all'><span className='text-accent text-2xl font-bold'><MdArrowRight /></span> Our Dealers</li></Link>
            </ul>
          </div>
          <div className="Support Center w-full sm:w-auto md:flex-1">
            <div className='font-semibold text-xl tracking-wide'>Support Center
              <div className="divider-footer"><hr className='border-bodytextcolor border w-28 mt-1' /></div></div>
            <ul>
              <Link href={"/sell"}><li className='flex items-center gap-2 text-lg lg:text-xl mt-6 mb-2 font-medium hover:translate-x-3 cursor-pointer hover:text-accent transition-all'><span className='text-accent text-2xl font-bold'><MdArrowRight /></span> Sell Vehicle</li></Link>
              <Link href={"/testdrive"}><li className='flex items-center gap-2 text-lg lg:text-xl mt-2 font-medium hover:translate-x-3 cursor-pointer hover:text-accent transition-all'><span className='text-accent text-2xl font-bold'><MdArrowRight /></span> Test Drive</li></Link>
              <Link href={"/contactus"}><li className='flex items-center gap-2 text-lg lg:text-xl mt-2 font-medium hover:translate-x-3 cursor-pointer hover:text-accent transition-all'><span className='text-accent text-2xl font-bold'><MdArrowRight /></span> Contact us</li></Link>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <div className="left">
            <h2 className='text-sm md:text-base'>&copy; Copyright 2025 <span className='text-accent'>Carlinx</span> All Rights Reserved.</h2></div>
          <div className="right flex gap-2">
              <li className='flex justify-center items-center text-accent bg-white font-semibold text-xl h-10 w-10 border-none rounded-xl hover:text-white hover:bg-black transition-all'><SlSocialFacebook /></li>
              <li className='flex justify-center items-center text-accent bg-white font-semibold text-xl h-10 w-10 border-none rounded-xl hover:text-white hover:bg-black transition-all'><FaInstagram /></li>
              <li className='flex justify-center items-center text-accent bg-white font-semibold text-xl h-10 w-10 border-none rounded-xl hover:text-white hover:bg-black transition-all'><FaLinkedinIn/></li>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
