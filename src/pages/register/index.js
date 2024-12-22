import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/jpgs/logo-navbar.jpg";
import { useRouter } from "next/router";

const RegistrationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
  });
  const [isSubmited, setisSubmited] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState(1);
  const [passwordCriteria, setPasswordCriteria] = useState({
    hasUpperCase: false,
    hasNumberOrSpecialChar: false,
    hasMinLength: false,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

  const fieldRefs = {
    name: useRef(""),
    dob: useRef(""),
    email: useRef(""),
    password: useRef(""),
  };

  const handleChange = (field) => (e) => {
    fieldRefs[field].current = e.target.value;
    if (field === "password") {
      const pwd = e.target.value;
      setPasswordCriteria({
        hasUpperCase: /[A-Z]/.test(pwd),
        hasNumberOrSpecialChar: /[\d@$!%*?&]/.test(pwd),
        hasMinLength: pwd.length >= 10,
      });
    }
  };

  const handleBlur = (field) => () => {
    setFormData((prev) => ({ ...prev, [field]: fieldRefs[field].current }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) {
      setFeedback('Please fill in all the fields.');
      return;
    }
    setisSubmitting(true);
    setFeedback('');
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setFeedback('Registration successful! Welcome to Carlinx!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setisSubmited(true)
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            router.push("/login");
            clearInterval(timer);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setFeedback(data.message || 'An error occurred.');
      setisSubmitting(false);
    }
  };

  const renderInput = (label, type, field, placeholder = "") => (
    <div className="mb-4">
      <label htmlFor={field} className="block text-gray-700">{label}</label>
      <input
        type={type}
        id={field}
        placeholder={placeholder}
        onChange={handleChange(field)}
        onBlur={handleBlur(field)}
        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
        required
      />
    </div>
  );

  const goNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.dob) {
        setFeedback("Please fill in all the fields.");
        return;
      }
    } else if (step === 2) {
      if (!formData.email || !formData.password) {
        setFeedback("Please fill in all the fields.");
        return;
      }
      if (!passwordCriteria.hasUpperCase || !passwordCriteria.hasNumberOrSpecialChar || !passwordCriteria.hasMinLength) {
        setFeedback("Please meet all the password criteria.");
        return;
      }
    }
    setStep((prev) => prev + 1);
    setFeedback("");
  };

  const goPrevious = () => setStep((prev) => prev - 1);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="login h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-[rgba(255,255,255,0.5)] shadow-md rounded-lg p-8 max-w-md w-full">
        <Image
          src={logo}
          height={50}
          alt="Carlinx Logo"
          className="w-4/5 ml-9 mb-2 rounded"
        />
        <h1 className="text-2xl font-bold mb-6 text-center">{`${isSubmited ? `Redirecting to login page in ${countdown}` : 'Register to Carlinx'}`}</h1>
        {feedback && <p className=" text-2xl mt-[-15px] text-accent font-black">{feedback}</p>}
        <form onSubmit={handleSubmit}>
          {/* Step 1: Name and DOB */}
          {step === 1 && (
            <>
              {renderInput("Name", "text", "name", "Your Name")}
              {renderInput("Date of Birth", "date", "dob")}
              <button
                type="button"
                onClick={goNext}
                className="theme-btn w-full mt-4"
              >
                Next
              </button>
            </>
          )}

          {/* Step 2: Email and Password */}
          {step === 2 && (
            <>
              {renderInput("Email", "email", "email", "Your Email")}
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    placeholder="Your Password"
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-2"
                  >
                    {isPasswordVisible ? (
                      <span role="img" aria-label="hide">🙈</span>
                    ) : (
                      <span role="img" aria-label="show">👁️</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Password criteria */}
              <div className="mt-4">
                <p className="text-sm text-gray-700">Your password must contain at least:</p>
                <ul className="list-none">
                  {[ 
                    { text: "1 uppercase letter", valid: passwordCriteria.hasUpperCase },
                    { text: "1 number or special character", valid: passwordCriteria.hasNumberOrSpecialChar },
                    { text: "10 characters", valid: passwordCriteria.hasMinLength },
                  ].map((item, index) => (
                    <li
                      key={index}
                      className={`flex items-center gap-2 ${
                        item.valid ? "text-accent" : "text-gray-700"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 rounded-full border-2 ${
                          item.valid ? "bg-accent" : "border-gray-700"
                        }`}
                      ></span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={goPrevious}
                  className="theme-btn-secondary"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`theme-btn  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="font-bold mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-red-500">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
