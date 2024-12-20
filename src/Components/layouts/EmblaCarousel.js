'use client'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import heroimg1 from '../../../public/pngs/heroimg-1.png'
import heroimg2 from '../../../public/pngs/heroimg-2.png'


const EmblaCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({delay:3000})])
  return (
    <div className="embla" ref={emblaRef}>
    
      <div className="embla__container h-screen">
        <div className="embla__slide hero-single bg-hero-pattern text-white h-full ">
          <div className="hero-single-left animate-fadeinleft2">
            <h4 className=' text-accent hero-single-left-txt1'>WELCOME TO Carlinx!</h4>
            <p className='hero-single-left-txt2'>Best Way To Find</p>
            <p className='hero-single-left-txt2'>Your <span className='text-accent'>Dream </span>Car</p>
            <h6 className='text-xl'>Discover unbeatable deals on quality <br />pre-owned cars.
               Your trusted partner in  <br />finding the perfect ride at the best price.</h6>
          </div>
          
          <p className='imagebgcolor'></p>
          <Image className='heroimg-1' src={heroimg1} alt="car_image"></Image>
        </div>
        <div className="embla__slide hero-single1 text-white h-full">
          <div className="hero-single-left1 animate-fadeinleft2 ">
            <h4 className=' text-accent hero-single-left1-txt1'>WELCOME TO Carlinx!</h4>
            <p className='hero-single-left1-txt2'>Best Way To Find</p>
            <p className='hero-single-left1-txt2'>Your <span className='text-accent'>Dream </span>Car</p>
            <h6 className='text-xl'>Quality cars with transparent pricing, <br />ensuring you get the best deal. 
             Enjoy a <br />seamless buying experience from start to finish.</h6>
          </div>
          <div className=''>
          <p className='imagebgcolor1'></p>
          <Image className='heroimg-2' src={heroimg2} alt="car_image"></Image></div>
        </div>
      </div>
    </div>
  )
}
export default EmblaCarousel;
// 