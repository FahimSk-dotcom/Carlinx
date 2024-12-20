import React, { useState } from 'react';
import Breadcrumb from '@/Components/layouts/BreadCrumb';
import { FaMapMarkedAlt } from "react-icons/fa";
import { LuPhoneCall } from "react-icons/lu";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { IoAlarmOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import Image from 'next/image';
import FormCover from '../../../public/jpgs/ContactFormCover.jpg';

const Contactus = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      setFeedback('Please fill in all the fields.');
      return;
    }

    setIsSubmitting(true);
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setFeedback('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFeedback(data.message || 'An error occurred.');
      }
    } catch (error) {
      setFeedback('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className='text-white absolute left-[42vw] top-60 z-20 text-5xl font-bold'>Contact us</h1>
      <Breadcrumb />
      <div className="cards h-80 flex justify-evenly mt-20">
        {/* Cards for Contact Information */}
        {[
          { icon: FaMapMarkedAlt, title: 'Office Address', text: 'Located at 178 Cst Road, Mumbai, India' },
          { icon: LuPhoneCall, title: 'Call Us', text: '+91 12 6405 7898' },
          { icon: MdOutlineMarkEmailRead, title: 'Email Us', text: 'info@carlinx.com' },
          { icon: IoAlarmOutline, title: 'Open Time', text: 'Mon-Fri(09AM-8PM)' },
        ].map((card, index) => (
          <div key={index} className="Card h-52 w-64 flex flex-col gap-2 items-center border-none rounded-xl hover:animate-fadeup2">
            <li className='flex justify-center items-center bg-accent text-white h-20 w-20 mt-3 border-none rounded-full text-5xl list-none'>
              <card.icon />
            </li>
            <li className='list-none text-center text-xl font-bold'>{card.title}</li>
            <li className='list-none text-center text-lg text-balance'>{card.text}</li>
          </div>
        ))}
      </div>
      <div className="Form h-[700px] Card w-[80vw] ml-[10%] mb-32 flex border-none rounded-lg">
        <Image src={FormCover} height={600} width={600} className='ContactForm p-8' alt="Contact Us" />
        <div className='flex flex-col'>
          <h1 className='text-4xl font-bold mt-6 ml-5'>Get In Touch</h1>
          <p className='text text-balance mt-5 ml-5'>
            Have any questions or need assistance? We're here to help! Feel free to reach out, and our team will get back to you as soon as possible.
          </p>
          <form onSubmit={handleSubmit}>
            {['name', 'email', 'subject', 'message'].map((field, index) => (
              <label key={index} htmlFor={field}>
                {field !== 'message' ? (
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className={`ml-5 mt-10 border-[2px] rounded-xl h-12 ${field === 'subject' ? 'w-[35rem]' : 'w-64'} focus:ring-none`}
                    style={{ borderColor: '#ced4da', outline: 'none' }}
                    onFocus={(e) => (e.target.style.borderColor = '#EF1D26')}
                    onBlur={(e) => (e.target.style.borderColor = '#ced4da')}
                  />
                ) : (
                  <textarea
                    name={field}
                    rows={5}
                    placeholder="Write Your Message"
                    value={formData[field]}
                    onChange={handleChange}
                    className="ml-5 pt-2 mt-8 border-[2px] rounded-xl h-60 w-[35rem] focus:ring-none"
                    style={{ borderColor: '#ced4da', outline: 'none' }}
                    onFocus={(e) => (e.target.style.borderColor = '#EF1D26')}
                    onBlur={(e) => (e.target.style.borderColor = '#ced4da')}
                  ></textarea>
                )}
              </label>
            ))}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`theme-btn max-w-48 ml-5 mt-8 h-15 flex items-center justify-center gap-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
              <IoIosSend className='text-white' />
            </button>
          {feedback && <p className=" text-xl mt-[-40px] ml-60 text-red-500">{feedback}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default Contactus;
