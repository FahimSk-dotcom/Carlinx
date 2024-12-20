import { React, useState } from 'react'
import Image from 'next/image'
import ScrollTrigger from 'react-scroll-trigger'
import { FiPhone } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosCar } from "react-icons/io"
import dealer1 from '../../../public/pngs/01-dealer.png'
import dealer2 from '../../../public/pngs/02-dealer.png'
import dealer3 from '../../../public/pngs/03-dealer.png'
import dealer4 from '../../../public/pngs/04-dealer.png'
import dealer5 from '../../../public/pngs/05-dealer.png'
import dealer6 from '../../../public/pngs/06-dealer.png'
import dealer7 from '../../../public/pngs/07-dealer.png'
import dealer8 from '../../../public/pngs/08-dealer.png'
const dealers = () => {
  const [isHovered, setIsHovered] = useState(null)
  const [isEntered, setIsEntered] = useState(false);
  const handleMouseEnter = (DealerID) => {
    setIsHovered(DealerID);
  };
  const handleMouseLeave = () => {
    setIsHovered(null);
  };
  const dealerData = [
    {
      id: 1,
      name: 'Automotive Gear',
      image: dealer1,
      addr: ' 25/B Milford Road, Mumbai',
      con: '  +91 36 547 898'
    },
    {
      id: 2,
      name: 'Keithson Car',
      image: dealer2,
      addr: ' 28/B B.h.complex,, Delhi',
      con: ' +91 24 662 981'
    },
    {
      id: 3,
      name: 'Superious Automotive',
      image: dealer3,
      addr: ' 29/C, D Gupta Road, Delhi',
      con: ' +91 12 352 776'
    },
    {
      id: 4,
      name: 'Racing Gear Car',
      image: dealer4,
      addr: ' 932, ngrtptblr-2,  Bangalore',
      con: ' +91 22 212 123'
    },
    {
      id: 5,
      name: 'Car Showromio',
      image: dealer5,
      addr: '405,Server Park, Mumbai',
      con: ' +91 26 151 132'
    },
    {
      id: 6,
      name: 'Fastspeedio Car',
      image: dealer6,
      addr: '02, Sarojini Road, Mumbai',
      con: ' +91 26 151 132'
    },
    {
      id: 7,
      name: 'Star AutoMall',
      image: dealer7,
      addr: ' 521, Maker Chamber, Mumbai',
      con: ' +91 26 134 112'
    },
    {
      id: 8,
      name: 'Superspeed Auto',
      image: dealer8,
      addr: '07, Bubana Centre, Mumbai',
      con: ' +91 34 254 056'
    },
  ]
  return (
    <ScrollTrigger onEnter={() => setIsEntered(true)} onExit={() => setIsEntered(false)}>
      <div className="new-arrival h-[120px] w-screen flex flex-col items-center mt-20 ">
        <span className='text-accent text-xl flex items-center gap-2 font-bold tracking-widest'> <IoIosCar />Car Dealers</span>
        <span className='text-5xl font-bold tracking-wide'>Best Dealers In  <span className='text-accent'>Your City</span></span>
        <div className="divider"></div>
      </div>
      <div className={`container flex mb-20 flex-wrap justify-center ${isEntered ? 'animate-fadeup' : ''}`}>
        {dealerData.map((data) => (
          <div key={data.id} className="Card h-[300px] m-4 shadow-white shadow-xl w-72 bg-white flex justify-center border-none rounded">
            <div className='card ml-4'>
              <div onMouseEnter={() => { handleMouseEnter(data.id) }} onMouseLeave={handleMouseLeave}>
                <Image src={data.image} width={250} height={100} className='border-none rounded hover:scale-105 transition-all' />
              </div>
              <div className="content flex flex-col">
                <p className='text-xl font-bold mt-2 ml-2 hover:text-accent'>{data.name}</p>
                <p className='text-base flex items-center gap-2 font-semibold mt-4 ml-2 text-bodytextcolor'><span className='text-accent'><IoLocationOutline /></span> {data.addr}</p>
                <p className='text-base flex items-center gap-2 text-center  font-semibold mt-4 ml-2 hover:text-accent'><span className='text-accent'><FiPhone /></span>{data.con}</p></div>
            </div>
          </div>
        ))}
      </div>
    </ScrollTrigger>
  )
}
export default dealers
