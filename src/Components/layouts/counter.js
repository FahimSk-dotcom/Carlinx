import React, { useState } from 'react'
import CountUp from 'react-countup';
import ScrollTrigger from 'react-scroll-trigger';
import Image from 'next/image';
import { GiAutoRepair } from "react-icons/gi";
import { IoCarSport } from "react-icons/io5";
import smile from '../../../public/pngs/happy-client.png'
import usercount from '../../../public/jpgs/user-counter.jpg'
const counter = () => {
    const [counterOn, setCounterOn] = useState(false);
    return (
        <ScrollTrigger onEnter={() => setCounterOn(true)} onExit={() => setCounterOn(false)}>
            <div className="container-counter h-[300px] w-screen bg-accent flex items-center">
                {/* 1 icon */}
                <span className='flex justify-center item-center text-white h-28 w-28  border-4 border-white rounded-full text-[80px] absolute bg-black pt-2 z-10 left-56 mb-28'><IoCarSport /></span>
                <p className='absolute mt-16 z-10 left-[14.5rem] text-6xl text-white font-semibold'>{counterOn && <CountUp start={0} end={500} duration={2} />}</p>
                <p className='absolute mt-44 z-10 left-[12rem] text-2xl text-white font-semibold'>+Available Car</p>
                {/* 2 icon */}
                <span className='flex justify-center item-center text-white h-28 w-28  border-4 border-white rounded-full  absolute bg-black pt-2 z-10 left-[550px] mb-28'>
                    <Image src={smile} className=' mt-2 h-16 w-16 border-none rounded-xl'></Image>
                    <p className='absolute mt-24 z-10  text-6xl text-white font-semibold'>{counterOn && <CountUp start={0} end={900} duration={2} />}</p>
                </span>
                <p className='absolute mt-44 z-10 left-[530px] text-2xl text-white font-semibold'>+Happy Clients</p>
                {/* 3 icon */}
                <span className='flex justify-center item-center text-white h-28 w-28  border-4 border-white rounded-full text-[80px] absolute bg-black pt-2 z-10 right-[550px] mb-28'>< GiAutoRepair />
                    <p className='absolute mt-24 z-10  text-6xl text-white font-semibold'>{counterOn && <CountUp start={0} end={1200} duration={1} />}</p>
                </span>
                <p className='absolute mt-44 z-10 right-[520px] text-2xl text-white font-semibold'>+Team Workers</p>
                {/* 4 icon */}
                <span className='flex justify-center item-center text-white h-28 w-28  border-4 border-white rounded-full text-[80px] absolute bg-black pt-2 right-56 z-10  mb-28'>
                    <Image src={usercount} className=' mt-2 h-16 w-16 border-none rounded-xl'></Image>
                    <p className='absolute mt-24 z-10  text-6xl text-white font-semibold'>{counterOn && <CountUp start={0} end={30} duration={4} />}</p>
                </span>
                <p className='absolute mt-44 z-10 right-[150px] text-2xl text-white font-semibold'>+Years of Experience</p>
            </div>
        </ScrollTrigger>
    )
}

export default counter
