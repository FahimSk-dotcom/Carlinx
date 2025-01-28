import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function SuccessPage() {
  const [carDetails, setCarDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCarDetails() {
      try {
        const response = await axios.get('/api/sellsucess');
        if (response.data && response.data.success && response.data.data) {
          setCarDetails(response.data.data); // Set car details directly
        } else {
          setError('No car details found');
        }
      } catch (err) {
        setError('Failed to fetch car details');
        console.error('Error fetching car details:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCarDetails();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!carDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">No car details available</div>
      </div>
    );
  }

  const valueContainerStyle = "border border-gray-300 rounded-md p-2 mt-1 w-full bg-gray-50";

  return (
    <div className="flex justify-center items-center min-h-screen py-8 mt-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl mx-4 ">
        <h1 className="text-2xl font-bold mb-2 text-center">Success!</h1>
        <p className="text-gray-600 mb-6 text-center text-xl">Car details submitted.</p>

        <div className="space-y-6">
          {/* Name and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name*</label>
              <div className={valueContainerStyle}>{carDetails.name || '-'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone no*</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  +91
                </span>
                <div className="flex-1 border border-gray-300 rounded-r-md p-2 bg-gray-50">
                  {carDetails.mobile || '-'}
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Id*</label>
                <div className={valueContainerStyle}>{carDetails.email || '-'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password*</label>
                <div className={valueContainerStyle}>*********</div>
              </div>
              <div className='Rto'>
                <label className="block text-sm font-medium text-gray-700">RTO Location</label>
                <div className={valueContainerStyle}>{carDetails.rtoLocation || '-'}</div>
              </div>
            </div>
          {/* Vehicle Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mfg Year</label>
              <div className={valueContainerStyle}>{carDetails.mtgYear || '-'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <div className={valueContainerStyle}>{carDetails.brand || '-'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Model</label>
              <div className={valueContainerStyle}>{carDetails.model || '-'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Variant</label>
              <div className={valueContainerStyle}>{carDetails.variant || '-'}</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <div className={`${valueContainerStyle} min-h-[100px]`}>
              {carDetails.description || '-'}
            </div>
          </div>

          {/* Vehicle Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Image</label>
            <div className={valueContainerStyle}>
              {carDetails.imagePath ? (
                <Image
                  src={carDetails.imagePath}
                  alt="Vehicle preview"
                  width={80}
                  height={80}
                  objectFit="cover"
                  className="rounded-md"
                />
              ) : (
                'No image uploaded'
              )}
            </div>
          </div>
        </div>
        <h1 className='text-xl mb-2 mt-2'>We will Contact you within 2-3 working days</h1>
        <span className='flex items-center gap-2'>If any query or issue please visit here<Link href={"/contactus"}>
              <button className='theme-btn max-w-48  h-15 flex items-center justify-center gap-1'>
                Reach Us<FaArrowRightLong />
              </button>
            </Link>
        </span>
      </div>
    </div>
  );
}
