import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  reload
} from 'firebase/auth';
import { auth } from '../../../firebase/config';
import Breadcrumb from '@/Components/layouts/BreadCrumb';

// Custom Alert Component
const CustomAlert = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <p className="text-gray-700 mb-4">{message}</p>
          <button
            onClick={onClose}
            className="bg-[#EF1D26] text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const Sell = () => {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    rtoLocation: '',
    mtgYear: '',
    brand: '',
    model: '',
    variant: '',
    kmDriven: '',
    fuelType: '',
    owner: '',
    description: '',
    image: null,
    password: '' // Added password to formData
  });

  const options = {
    years: Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() - i).toString()),
    brands: ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Volkswagen'],
    kms: ['0-10,000', '10,000-30,000', '30,000-50,000', '50,000+'],
    fuelTypes: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
    owners: ['1st Owner', '2nd Owner', '3rd Owner', '4th Owner or more']
  };

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // New state to track registration

  // Modified useEffect to only check verification after registration
  useEffect(() => {
    if (!isRegistered) return; // Only run after registration

    const checkVerification = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          await reload(user);
          const verified = user.emailVerified;
          setIsEmailVerified(verified);
        }
      });
      return () => unsubscribe();
    };

    checkVerification();

    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await reload(user);
        setIsEmailVerified(user.emailVerified);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [isRegistered, isEmailVerified]); // Added dependencies

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleEmailVerification = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showCustomAlert('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await sendEmailVerification(userCredential.user);
      setVerificationSent(true);
      setIsRegistered(true);
      window.sessionStorage.setItem('sellFormData', JSON.stringify(formData));
      showCustomAlert('Verification email sent! Please check your inbox and verify your email before proceeding.');

    } catch (error) {
      console.error('Error during email verification:', error);
      let errorMessage = 'An error occurred during verification.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters long.';
      }
      showCustomAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user?.emailVerified) {
      showCustomAlert('Please verify your email before submitting the form.');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'image') {
          if (formData[key]) {
            formDataToSend.append('image', formData[key]);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('/api/sell', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }

      const result = await response.json();
      showCustomAlert('Vehicle details submitted successfully!');
      router.push('/successpage');

    } catch (error) {
      console.error('Error during submission:', error);
      showCustomAlert(error.message || 'Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  const handleAlertClose = () => {
    setShowAlert(false);
    setAlertMessage('');
  };
  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };
    return (
      <>
        <Breadcrumb />
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-5 mb-5">
          <form onSubmit={handleEmailVerification} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name*</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone no*</label>
                <div className="flex ">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="flex-1 block w-full border border-gray-300 rounded-r-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>


            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Id*</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password*</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  minLength="6"
                />
              </div>
              <div className='Rto'>
                <label className="block text-sm font-medium text-gray-700">RTO Location</label>
                <input
                  type="text"
                  name="rtoLocation"
                  value={formData.rtoLocation}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Vehicle Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mfg Year</label>
                <select
                  name="mtgYear"
                  value={formData.mtgYear}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Year</option>
                  {options.years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Brand</option>
                  {options.brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Variant</label>
                <input
                  type="text"
                  name="variant"
                  value={formData.variant}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Km Driven</label>
                <select
                  name="kmDriven"
                  value={formData.kmDriven}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Kms</option>
                  {options.kms.map(km => (
                    <option key={km} value={km}>{km}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Fuel Type</option>
                  {options.fuelTypes.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Owner</label>
                <select
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Owner</option>
                  {options.owners.map(owner => (
                    <option key={owner} value={owner}>{owner}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Vehicle Image</label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
                {imagePreview && (
                  <div className="relative h-20 w-20">
                    <Image
                      src={imagePreview}
                      alt="Vehicle preview"
                      width={80}
                      height={80}
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            {!verificationSent && (
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-auto px-6 py-2 bg-[#EF1D26] text-white rounded hover:bg-opacity-90 disabled:bg-gray-400"
                >
                  {loading ? 'Sending...' : 'Send Verification Email'}
                </button>
              </div>
            )}
          </form>

          {verificationSent && (
            <div>
              {!isEmailVerified ? (
                <div className="text-green-600 my-4">
                  Verification email sent! Please check your inbox and verify your email before proceeding.
                  <button
                    onClick={async () => {
                      const user = auth.currentUser;
                      if (user) {
                        await reload(user);
                        setIsEmailVerified(user.emailVerified);
                      }
                    }}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Check Verification Status
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-32 theme-btn text-white px-6 py-2 rounded hover:bg-red-600 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Submitting...' : 'Submit Form'}
                  </button>
                </form>
              )}
            </div>
          )}
  
          <CustomAlert
            message={alertMessage}
            isVisible={showAlert}
            onClose={handleAlertClose}
          />
        </div>
      </>
    );
  };

  export default Sell;