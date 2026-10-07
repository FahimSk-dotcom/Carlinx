'use client'
import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import heroimg1 from '../../../Assets/pngs/heroimg-1.png'
import heroimg2 from '../../../Assets/pngs/heroimg-2.png'

const EmblaCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true }, 
    [Autoplay({delay: 5000, stopOnInteraction: false})]
  )
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])
  
  return (
    <div className="embla w-full" ref={emblaRef}>
      <div className="embla__container h-screen">
        {/* First Slide */}
        <div className="embla__slide hero-single bg-hero-pattern text-white h-full relative">
          <div className="carousel-navigation">
            <button className="nav-button prev-button mr-52" onClick={scrollPrev}>
              <span className="sr-only">Previous</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="nav-button next-button" onClick={scrollNext}>
              <span className="sr-only">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          
          <div className="hero-content-wrapper w-full h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col md:flex-row items-center">
              <div className="hero-single-left animate-fadeinleft2 w-full md:w-1/2 text-center  z-10">
                <h4 className="text-accent font-bold tracking-wider text-sm sm:text-base md:text-lg uppercase">WELCOME TO Carlinx!</h4>
                <div className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                  <p className="leading-tight">Best Way To Find</p>
                  <p className="leading-tight">Your <span className="text-accent">Dream</span> Car</p>
                </div>
                <h6 className="mt-6 text-base sm:text-lg md:text-xl md:ml-16 max-w-xl opacity-80">
                Discover unbeatable deals on quality pre-owned cars.
                Your trusted partner in finding the perfect ride at the best price.
                </h6>
              </div>
              
              <div className="hero-image-container relative w-full md:w-1/2 mt-8 md:mt-0">
                <div className="car-image-wrapper relative">
                  <Image 
                    className="w-full object-contain"
                    src={heroimg1} 
                    alt="Sports car"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Second Slide */}
        <div className="embla__slide hero-single1 text-white h-full relative">
          <div className="carousel-navigation">
            <button className="nav-button prev-button mr-52" onClick={scrollPrev}>
              <span className="sr-only">Previous</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="nav-button next-button" onClick={scrollNext}>
              <span className="sr-only">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          
          <div className="hero-content-wrapper w-full h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col md:flex-row items-center">
              <div className="hero-single-left1 animate-fadeinleft2 w-full md:w-1/2 text-center  z-10">
                <h4 className="text-accent font-bold tracking-wider text-sm sm:text-base md:text-lg uppercase">WELCOME TO CARLINX!</h4>
                <div className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                  <p className="leading-tight">Best Way To Find</p>
                  <p className="leading-tight">Your <span className="text-accent">Dream</span> Car</p>
                </div>
                <h6 className="mt-6 text-base sm:text-lg md:text-xl md:ml-16 max-w-xl opacity-80">
                Quality cars with transparent pricing, ensuring you get the best deal. 
                Enjoy a seamless buying experience from start to finish.
                </h6>
              </div>
              
              <div className="hero-image-container relative w-full md:w-1/2 mt-8 md:mt-0">
                <div className="car-image-wrapper relative">
                  <Image 
                    className="w-full object-contain"
                    src={heroimg2} 
                    alt="Sports car"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel;