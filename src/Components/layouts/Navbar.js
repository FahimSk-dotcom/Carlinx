import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; 
import Cart from'../../../public/svgs/Cart.svg'
import mail from '../../../public/svgs/mail-icon.svg';
import phone from '../../../public/svgs/phone-icon.svg';
import clock from '../../../public/svgs/Alaramclock-icon.svg';
import loginicon from '../../../public/svgs/login-icon.svg';
import usericon from '../../../public/svgs/user-icon.svg';
import facebookicon from '../../../public/svgs/facebook-icon.svg';
import instaicon from '../../../public/svgs/insta-icon.svg';
import linkedicon from '../../../public/svgs/linkedin-icon.svg';
import logo from '../../../public/jpgs/logo-navbar.jpg';
import { LuLogOut } from "react-icons/lu";
const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setisLoggedIn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 48) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const storedLoginStatus = localStorage.getItem('isLoggedIn');
        if (storedLoginStatus === 'true') {
            setisLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        setisLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = () => {
        setisLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
    };

    return (
        <div>
            <div className="header">
                {/* Top Header Section */}
                <div className="header-top poly flex justify-between items-center h-12 bg-black relative top-0 bottom-0 z-50 mb-1">
                    <div className="header-top-left flex items-center h-10 ml-28">
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
                                    <button onClick={handleLogin}>
                                        <Link className="text-white cursor-pointer z-10 ml-1" href="login">Login</Link>
                                    </button>
                                </span>
                                <span className="transition-opacity duration-300 hover:opacity-40 flex justify-center">
                                    <Image height={24} src={usericon} alt="Register icon" className="h-6 ml-6 z-10" />
                                    <Link className="text-white cursor-pointer z-10" href="register">Register</Link>
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="transition-opacity duration-300 hover:opacity-40 flex justify-center">
                                    <LuLogOut className="text-white h-8 w-5 ml-10 z-10 mr-1" />

                                    <button onClick={handleLogout}>
                                        <Link className="text-white cursor-pointer z-10 ml-1" href="login">Logout</Link>
                                    </button>
                                </span>
                                <span className="transition-opacity duration-300 hover:opacity-40 flex justify-center">
                                    <Image height={24} src={usericon} alt="Profile icon" className="h-6 ml-6 z-10" />
                                    <Link className="text-white cursor-pointer z-10" href="/shop">Profile</Link>
                                </span>
                            </>
                        )}
                        <p className="text-white z-10 ml-4">Follow us:</p>
                        <span className="transition-opacity duration-300 hover:opacity-40 flex justify-center">
                            <Image height={24} src={facebookicon} alt="Facebook icon" className="h-6 z-10 ml-2 mr-2 cursor-pointer" />
                        </span>
                        <span className="transition-opacity duration-300 hover:opacity-40 flex justify-center">
                            <Image height={24} src={instaicon} alt="Instagram icon" className="h-6 z-10 ml-2  mr-2 cursor-pointer" />
                        </span>
                        <span className="transition-opacity duration-300 hover:opacity-40 flex justify-center">
                            <Image height={24} src={linkedicon} alt="LinkedIn icon" className="h-6 z-10 ml-2 mr-40 cursor-pointer" />
                        </span>
                    </div>
                </div>

                {/* Bottom Header Section */}
                <div className={`header-bottom fixed top-0 left-0 right-0 z-40 flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-20 pt-0' : 'h-32 pt-14'} bg-white`}>
                    <Link href="/home">
                        <Image src={logo} height={70} alt="Carlinx Logo" className="w-56 ml-44" />
                    </Link>
                    <Link href="/home" className="text-black font-semibold cursor-pointer hover:text-accent">Home</Link>
                    <Link href="/about" className="text-black font-semibold cursor-pointer hover:text-accent">About</Link>
                    <Link href="/inventory" className="text-black font-semibold cursor-pointer hover:text-accent">Inventory</Link>
                    <Link href="/shop" className="text-black font-semibold cursor-pointer hover:text-accent">Shop</Link>
                    <Link href="/blog" className="text-black font-semibold cursor-pointer hover:text-accent">Blog</Link>
                    <Link href="/contactus" className="text-black font-semibold cursor-pointer hover:text-accent">Contact us</Link>
                    <div className="flex hover:text-[#EF1D26]">
                        <Link href="/cart" className="flex items-center text-black font-semibold cursor-pointer hover:text-[#EF1D26]">
                            Cart
                            <Image height={24} src={Cart} alt="cart icon"/>
                        </Link>
                        <span className="inline-flex mr-40 items-center justify-center bg-red-50 w-6 h-6 ml-2 rounded-full text-xs font-medium text-red-600 ring-1 shadow-[0_0_15px_1px_rgba(220,38,38)] ring-inset ring-red-600/10">
                            0
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
