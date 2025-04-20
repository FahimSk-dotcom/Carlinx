import React, { useState } from 'react';
import CountUp from 'react-countup';
import ScrollTrigger from 'react-scroll-trigger';
import Image from 'next/image';
import { GiAutoRepair } from "react-icons/gi";
import { IoCarSport } from "react-icons/io5";
import smile from '../../../Assets/pngs/happy-client.png';
import usercount from '../../../Assets/jpgs/user-counter.jpg';

const Counter = () => {
    const [counterOn, setCounterOn] = useState(false);

    const stats = [
        {
            icon: <IoCarSport />,
            count: 500,
            label: '+Available Car',
        },
        {
            icon: <Image src={smile} alt='happy' className="h-16 w-16 rounded-xl" />,
            count: 900,
            label: '+Happy Clients',
        },
        {
            icon: <GiAutoRepair />,
            count: 1200,
            label: '+Team Workers',
        },
        {
            icon: <Image src={usercount} alt='user count' className="h-16 w-16 rounded-xl" />,
            count: 30,
            label: '+Years of Experience',
        }
    ];

    return (
        <ScrollTrigger onEnter={() => setCounterOn(true)} onExit={() => setCounterOn(false)}>
           <div className="container-counter relative w-full bg-accent py-10 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-white text-center">
                    {stats.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="flex justify-center items-center h-28 w-28 border-4 border-white rounded-full bg-black text-[40px] md:text-[60px]">
                                {item.icon}
                            </div>
                            <p className="mt-4 text-4xl md:text-5xl font-bold">
                                {counterOn && <CountUp start={0} end={item.count} duration={2} />}
                            </p>
                            <p className="mt-2 text-lg md:text-xl font-semibold">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </ScrollTrigger>
    );
};

export default Counter;
