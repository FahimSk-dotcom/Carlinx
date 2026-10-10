import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import Cart from '../../../Assets/svgs/Cart.svg';
import mail from '../../../Assets/svgs/mail-icon.svg';
import phone from '../../../Assets/svgs/phone-icon.svg';
import clock from '../../../Assets/svgs/Alaramclock-icon.svg';
import loginicon from '../../../Assets/svgs/login-icon.svg';
import usericon from '../../../Assets/svgs/user-icon.svg';
import facebookicon from '../../../Assets/svgs/facebook-icon.svg';
import instaicon from '../../../Assets/svgs/insta-icon.svg';
import linkedicon from '../../../Assets/svgs/linkedin-icon.svg';
import logo from '../../../Assets/jpgs/logo-navbar.jpg';
import { LuLogOut } from 'react-icons/lu';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const totalCount = useSelector((state) => state.cart.totalCount);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 48);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = async () => {
        router.push("/login")
        setIsLoggedIn(false);
        Cookies.remove('user');
    };

    const handleLogIn = () => {
        router.push("/login")
    };

    const handleregister = () => {
        router.push("/register")
    };

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [])

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [router.asPath])

    return (
        <div>
            {/* Top Header Section - desktop only */}
            <div className="header-top poly hidden md:flex justify-between items-center h-12 bg-black relative top-0 bottom-0 z-50 mb-1">
                <div className="header-top-left flex items-center h-10 ml-[6vw]">
                    <Image height={24} src={mail} alt="Mail icon" className="h-6 ml-10 z-10" />
                    <a className="text-white cursor-pointer z-10" href="mailto:info@carlinx.com">info@carlinx.com</a>
                    <Image height={20} src={phone} alt="Phone icon" className="h-5 ml-2" />
                    <a className="text-white cursor-pointer" href="tel:+21236547898">+2 123 654 7898</a>
                    <Image height={24} src={clock} alt="Clock icon" className="h-6 ml-3 w-5 z-10" />
                    <a className="text-white cursor-pointer" href="">Mon-Fri(09AM-8PM)</a>
                </div>
                <div className="header-top-right flex items-center h-10">
                    {!isLoggedIn ? (
                        <>
                            <span className="transition-opacity duration-300 hover:opacity-40 flex justify-center">
                                <Image height={24} src={loginicon} alt="Login icon" className="h-6 ml-10 z-10" />
                                <button onClick={handleLogIn}>
                                    <span className="text-white cursor-pointer z-10 ml-1">Login</span>
                                </button>
                            </span>
                            <span className="transition-opacity duration-300 hover:opacity-40 flex justify-center">
                                <Image height={24} src={usericon} alt="Register icon" className="h-6 ml-6 z-10" />
                                <button onClick={handleregister}>
                                    <span className="text-white cursor-pointer z-10 ml-1">Register</span>
                                </button>
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="transition-opacity duration-300 hover:opacity-40 flex justify-center">
                                <LuLogOut className="text-white h-8 w-5 ml-10 z-10 mr-1" />
                                <button onClick={handleLogout}>
                                    <span className="text-white cursor-pointer z-10 ml-1">Logout</span>
                                </button>
                            </span>
                            <span className="transition-opacity duration-300 hover:opacity-40 flex justify-center">
                                <Image height={24} src={usericon} alt="Profile icon" className="h-6 ml-6 z-10" />
                                <Link className="text-white cursor-pointer z-10" href="/profile">Profile</Link>
                            </span>
                        </>
                    )}
                    <p className="text-white z-10 ml-4">Follow us:</p>
                    <span className="transition-opacity duration-300 hover:opacity-40 flex justify-center">
                        <Image height={24} src={facebookicon} alt="Facebook icon" className="h-6 z-10 ml-2 mr-2 cursor-pointer" />
                    </span>
                    <span className="transition-opacity duration-300 hover:opacity-40 flex justify-center">
                        <Image height={24} src={instaicon} alt="Instagram icon" className="h-6 z-10 ml-2 mr-2 cursor-pointer" />
                    </span>
                    <span className="transition-opacity duration-300 hover:opacity-40 flex justify-center">
                        <Image height={24} src={linkedicon} alt="LinkedIn icon" className="h-6 z-10 ml-2 mr-[6vw] cursor-pointer" />
                    </span>
                </div>
            </div>

            {/* Mobile Top Bar - fixed above the header on mobile */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-9 flex justify-between items-center px-4 bg-[#EF1D26] text-white">
                <div className="flex items-center">
                    <Image height={16} width={16} src={phone} alt="Phone icon" className="mr-1" />
                    <a href="tel:+21236547898" className="text-sm">+2 123 654 7898</a>
                </div>
                <div className="flex items-center space-x-2">
                    <Image height={16} width={16} src={facebookicon} alt="Facebook icon" className="cursor-pointer" />
                    <Image height={16} width={16} src={instaicon} alt="Instagram icon" className="cursor-pointer" />
                    <Image height={16} width={16} src={linkedicon} alt="LinkedIn icon" className="cursor-pointer" />
                </div>
            </div>

            {/* Bottom Header Section - Exactly as original for desktop */}
            <div className={`header-bottom fixed top-9 md:top-0 left-0 right-0 z-40 flex md:justify-between md:items-center transition-all duration-500 ${isScrolled ? 'h-16 md:h-20 pt-0' : 'h-16 md:h-32 md:pt-14'} bg-white`}>
                <div className="container flex justify-between items-center md:items-stretch md:flex-none">
                    {/* Logo - Same for both mobile and desktop but responsive */}
                    <Link href="/home" className="ml-2 md:ml-8 xl:ml-44">
                        <Image src={logo} height={70} alt="Carlinx Logo" className="w-32 md:w-44 xl:w-56" />
                    </Link>

                    {/* Desktop Navigation Links - Preserved exactly as original */}
                    <div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:gap-4 lg:gap-6 xl:gap-8 md:mx-6 xl:mx-10">
                        <Link href="/home" className="text-black text-sm lg:text-base font-semibold cursor-pointer hover:text-[#EF1D26]">Home</Link>
                        <Link href="/about" className="text-black text-sm lg:text-base font-semibold cursor-pointer hover:text-[#EF1D26]">About</Link>
                        <Link href="/inventory" className="text-black text-sm lg:text-base font-semibold cursor-pointer hover:text-[#EF1D26]">Inventory</Link>
                        <Link href="/shop" className="text-black text-sm lg:text-base font-semibold cursor-pointer hover:text-[#EF1D26]">Shop</Link>
                        <Link href="/blog" className="text-black text-sm lg:text-base font-semibold cursor-pointer hover:text-[#EF1D26]">Blog</Link>
                        <Link href="/contactus" className="text-black text-sm lg:text-base font-semibold cursor-pointer hover:text-[#EF1D26]">Contact us</Link>
                        <div className="flex items-center hover:text-[#EF1D26]">
                            <Link href="/cart" className="flex items-center text-black text-sm lg:text-base font-semibold cursor-pointer hover:text-[#EF1D26]">
                                Cart
                                <Image height={24} src={Cart} alt="cart icon" />
                            </Link>
                            <span className="inline-flex items-center justify-center bg-red-50 w-6 h-6 ml-2 rounded-full text-xs font-medium text-red-600 ring-1 shadow-[0_0_15px_1px_rgba(220,38,38)] ring-inset ring-red-600/10">
                                {totalCount}
                            </span>
                        </div>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center md:hidden">
                        <Link href="/cart" className="mr-2 flex items-center">
                            <Image height={20} width={20} src={Cart} alt="cart icon" />
                            <span className="inline-flex items-center justify-center bg-red-50 w-5 h-5 -ml-1 -mt-3 rounded-full text-xs font-medium text-red-600 ring-1 shadow-sm ring-inset ring-red-600/10">
                                {totalCount}
                            </span>
                        </Link>
                        <button
                            className="p-2"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? 
                                <IoMdClose className="h-6 w-6" /> : 
                                <GiHamburgerMenu className="h-6 w-6" />
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Only shows when toggled */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed top-[100px] left-0 right-0 bottom-0 bg-white z-30 overflow-y-auto" onClick={() => setMobileMenuOpen(false)}>
                    <div className="p-4">
                        <nav className="mb-6">
                            <Link href="/home" className="block py-3 border-b hover:text-[#EF1D26]">Home</Link>
                            <Link href="/about" className="block py-3 border-b hover:text-[#EF1D26]">About</Link>
                            <Link href="/inventory" className="block py-3 border-b hover:text-[#EF1D26]">Inventory</Link>
                            <Link href="/shop" className="block py-3 border-b hover:text-[#EF1D26]">Shop</Link>
                            <Link href="/blog" className="block py-3 border-b hover:text-[#EF1D26]">Blog</Link>
                            <Link href="/contactus" className="block py-3 border-b hover:text-[#EF1D26]">Contact us</Link>
                        </nav>
                        
                        {/* Login/Register options in mobile menu */}
                        <div className="mb-6">
                            {!isLoggedIn ? (
                                <>
                                    <button onClick={handleLogIn} className="flex items-center py-3 border-b w-full hover:text-[#EF1D26]">
                                        <Image height={20} width={20} src={loginicon} alt="Login icon" className="mr-2" />
                                        <span>Login</span>
                                    </button>
                                    <button onClick={handleregister} className="flex items-center py-3 border-b w-full hover:text-[#EF1D26]">
                                        <Image height={20} width={20} src={usericon} alt="Register icon" className="mr-2" />
                                        <span>Register</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleLogout} className="flex items-center py-3 border-b w-full hover:text-[#EF1D26]">
                                        <LuLogOut className="h-5 w-5 mr-2" />
                                        <span>Logout</span>
                                    </button>
                                    <Link href="/profile" className="flex items-center py-3 border-b w-full hover:text-[#EF1D26]">
                                        <Image height={20} width={20} src={usericon} alt="Profile icon" className="mr-2" />
                                        <span>Profile</span>
                                    </Link>
                                </>
                            )}
                        </div>
                        
                        {/* Contact info in mobile menu */}
                        <div className="mb-6">
                            <a href="mailto:info@carlinx.com" className="flex items-center py-2">
                                <Image height={20} width={20} src={mail} alt="Mail icon" className="mr-2" />
                                <span>info@carlinx.com</span>
                            </a>
                            <div className="flex items-center py-2">
                                <Image height={20} width={20} src={clock} alt="Clock icon" className="mr-2" />
                                <span>Mon-Fri(09AM-8PM)</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;