import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import logo from '../../../Assets/jpgs/logo-navbar.jpg';
import Link from 'next/link';

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState(1); // 1: Email & DOB, 2: New Password
  const [countdown, setCountdown] = useState(null);

  const handleVerifyUser = async (e) => {
    e.preventDefault();
    
    if (!email || !dob) {
      setFeedback('Please enter both email and date of birth');
      return;
    }

    try {
      const res = await fetch('/api/forgotpassword/verify-Email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, dob }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setStep(2);
        setFeedback('');
      } else {
        setFeedback(data.message || 'Verification failed. Please check your information.');
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedback('An error occurred. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setFeedback('Please enter both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback('Passwords do not match');
      return;
    }

    // Basic password validation
    if (newPassword.length < 8) {
      setFeedback('Password must be at least 8 characters long');
      return;
    }

    try {
      const res = await fetch('/api/forgotpassword/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, dob, password: newPassword }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setFeedback('Password reset successfully! Redirecting to login...');
        setCountdown(3);
        
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              router.push('/login');
              clearInterval(timer);
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setFeedback(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedback('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login forgot-password h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-[rgba(255,255,255,0.5)] shadow-md rounded-lg p-8 max-w-md w-full">
        <Image src={logo} height={50} alt="Carlinx Logo" className="w-4/5 ml-9 mb-2 rounded" />
        <h1 className="text-2xl font-bold mb-6 text-center">
          {countdown ? `Redirecting to login in ${countdown}` : 'Password Recovery'}
        </h1>
        {feedback && <p className="text-2xl mt-[-15px] text-accent font-black">{feedback}</p>}
        
        {step === 1 && (
          <form onSubmit={handleVerifyUser}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dob" className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                required
              />
            </div>
            <button type="submit" className="theme-btn w-full">
              Verify
            </button>
            <p className="font-bold mt-4">
              Remember your password?
              <Link href="/login" className="w-2/6 h-10 underline ml-2 hover:text-red-500">
                Login
              </Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  (<span role="img" aria-label="show">👁️</span>)}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                >
                  {confirmPasswordVisible ? (
                  <span role="img" aria-label="hide">🙈</span>) : 
                  (<span role="img" aria-label="show">👁️</span>)}
                </button>
              </div>
            </div>
            <button type="submit" className="theme-btn w-full">
              Reset Password
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-4 h-10 underline text-center hover:text-accent"
            >
              Back to Verification
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;