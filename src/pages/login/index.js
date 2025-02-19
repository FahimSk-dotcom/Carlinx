import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../Assets/jpgs/logo-navbar.jpg';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [feedback, setfeedback] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [isSubmited, setSubmited] = useState(false);
  
  // State to control password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setfeedback('Login successful');
      setCountdown(3);
      setSubmited(true);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 2) {
            router.push('/home');// Redirect to homepage after countdown
            clearInterval(timer);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setfeedback('Please check Email and Password again');
    }
  };

  return (
    <div className="login h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-[rgba(255,255,255,0.5)] shadow-md rounded-lg p-8 max-w-md w-full">
        <Image src={logo} height={50} alt="Carlinx Logo" className="w-4/5 ml-9 mb-2 rounded" />
        <h1 className="text-2xl font-bold mb-6 text-center">
          {`${isSubmited ? `Redirecting to Homepage in ${countdown}` : 'Log in to Carlinx'}`}
        </h1>
        {feedback && <p className="text-2xl mt-[-15px] text-accent font-black">{feedback}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                {passwordVisible ? (
                <span role="img" aria-label="hide">🙈</span>) : 
                ( <span role="img" aria-label="show">👁️</span>)}
              </button>
            </div>
          </div>
          <button type="submit" className="theme-btn w-full">
            Login
          </button>
          <button
            type="button"
            className="w-full mt-4 h-10 underline text-center hover:text-accent"
          >
            Forgot your password?
          </button>
          <p className="font-bold">
            Don&apos;t have an account?
            <Link href="/register" className="w-2/6 mt-2 h-10 underline ml-2 hover:text-red-500">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;