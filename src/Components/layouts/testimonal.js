import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { TbStarFilled } from "react-icons/tb";
import testimonal1 from '../../../Assets/jpgs/testimonal1.jpg';
import testimonal2 from '../../../Assets/jpgs/testimonal2.jpg';
import testimonal3 from '../../../Assets/jpgs/testimonal3.jpg';
import testimonal4 from '../../../Assets/jpgs/testimonal4.jpg';
import testimonal5 from '../../../Assets/jpgs/testimonal5.jpg';
import Image from 'next/image';
import { AiOutlineCar } from 'react-icons/ai';
const swiper = () => {
    const testimonals = [
        {
            id: 1,
            Name: 'Gordo Novak',
            img: testimonal1,
            desc: 'Superb customer service and quality vehicles. I couldnt be happier with my experience here!',
        },
        {
            id: 2,
            Name: 'Heruli Nez',
            img: testimonal2,
            desc: 'Top-notch service from start to finish. Im extremely happy with my purchase and will be back for my next car.',
        },
        {
            id: 3,
            Name: 'Reid E Butt',
            img: testimonal3,
            desc: 'Providing top-quality vehicles and services at competitive, reasonable prices.Excellent service and high-quality cars.',
        },
        {
            id: 4,
            Name: 'Sylvia H Green',
            img: testimonal4,
            desc: 'Fantastic experience! The team was helpful, and the car I bought is in excellent condition. Highly recommend!',
        },
        {
            id: 5,
            Name: 'Parker Jimenez',
            img: testimonal5,
            desc: 'Great selection of cars at reasonable prices. The staff made the process easy and stress-free.',
        }
    ];

    return (
        <>
            <div className="Testimonals h-[80vh] flex flex-col items-center bg-themebglight w-screen">
                <div className="heading1 flex mt-5 items-center font-semibold text-accent text-2xl tracking-widest">
                    <AiOutlineCar />Testimonals
                </div>
                <div className="heading2 mt-2 mb-3 text-5xl font-bold">What Our Client <span className='text-accent'>Say&apos;s</span>
                </div>
                <div className="divider mb-10"></div>
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                loop={true}
                pagination={{
                    clickable: true, // Enables clickable dots
                    el: '.swiper-pagination', // Ensure dots appear where you want them
                }}
                modules={[Pagination, Autoplay]}
                autoplay={{
                    delay: 1500,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false
                }}
                className="mySwiper"
            >
                {testimonals.map((data) => (
                    <SwiperSlide key={data.id}>
                        <ul className="flex flex-col  h-60 w-56 bg-white p-4 ">
                            <li>
                                <Image src={data.img} alt={data.Name} height={80} width={80} className='Imagetestimonal border-none rounded-full'></Image>
                            </li>
                            <li className="font-bold text-xl mt-4">{data.Name}</li>
                            <li className="text-accent">Customer</li>
                            <li className="text-bodytextcolor mt-4">
                                <p className='z-10'>{data.desc}</p>
                            </li>
                            <li className='text-accent flex gap-1 mt-2'><TbStarFilled /><TbStarFilled /><TbStarFilled /><TbStarFilled /><TbStarFilled /></li>
                        </ul>
                    </SwiperSlide>
                ))}
            </Swiper>
            
            </div>
        </>
    );
};

export default swiper;
