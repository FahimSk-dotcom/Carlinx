import React from 'react'
import { AiOutlineCar } from "react-icons/ai";
import { FaRegCircleUser } from "react-icons/fa6"
import { SlCalender } from "react-icons/sl";
import { FaArrowRightLong } from "react-icons/fa6";
import Image from 'next/image';
import poster3 from '../../../Assets/jpgs/blogposter2.jpg'
import poster1 from '../../../Assets/jpgs/blogposter1.jpg'
import poster2 from '../../../Assets/jpgs/blogposter3.jpg'

const blogComponent = () => {
    const authordata = [
        {
            id: 1,
            Name: 'By Alicia Davis',
            date:'January 29, 2023',
            img: poster1,
            desc: 'Discover the latest trends and expert tips on buying and maintaining quality vehicles. Stay informed with our regularly updated content.'
        },
        {
            id: 2,
            Name: 'By Veronica Bowen',
            date:'March 04, 2021',
            img: poster2,
            desc:'Get valuable insights on choosing the perfect car, with expert advice and detailed reviews. Our blog keeps you up-to-date on all things automotive.'
        },
        {
            id: 3,
            Name: 'By Edward West',
            date:'June 04, 2023',
            img: poster3,
            desc:'Explore comprehensive guides and tips for a smooth car buying experience. We bring you the latest updates to help make informed decisions with confidence.'
        }
    ]
    return (
        <>
            <div className="Blog h-[80%] flex flex-col items-center w-screen">
                <div className="heading1 flex gap-2 mt-24 items-center font-semibold text-accent text-2xl tracking-widest">
                    <AiOutlineCar />OUR BLOG
                </div>
                <div className="heading2 mt-2 mb-2 text-5xl font-bold">Latest News & <span className='text-accent'>Blog</span></div>
                <div className="divider"></div>
                <div className="Cards flex justify-evenly w-[80vw]">
                    {
                        authordata.map((data) => (
                            <ul key={data.id} className='Card h-[500px]  m-4 shadow-white shadow-xl w-80  flex flex-col border-none rounded'>
                                <li className='m-2 hover:scale-110 transition-all p-2 '><Image src={data.img} height={200} width={280} className='border-none rounded'></Image></li>
                                <li className='flex items-center gap-2 mt-2 ml-2'><span className='text-accent'><FaRegCircleUser /></span>{data.Name}<span className='text-accent'><SlCalender /></span>{data.date}</li>
                                <li className='mt-2  font-medium text-xl ml-2 hover:text-accent'>{data.desc}</li>
                                <hr className='mt-2 ' />
                                <li className=' ml-2 mt-3'><button className=' theme-btn max-w-48 h-15 flex items-center justify-center gap-1 '>Read More <FaArrowRightLong /></button></li>
                            </ul>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default blogComponent
