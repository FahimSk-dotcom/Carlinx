import { useState } from 'react';
import Image from 'next/image';
import Breadcrumb from '@/Components/layouts/BreadCrumb';
const Sell = () => {
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
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Sample options for select fields - replace with your actual data
  const options = {
    years: Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() - i).toString()),
    brands: ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Volkswagen'],
    kms: ['0-10,000', '10,000-30,000', '30,000-50,000', '50,000+'],
    fuelTypes: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
    owners: ['1st Owner', '2nd Owner', '3rd Owner', '4th Owner or more']
  };

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

  const handleSendOTP = () => {
    // Implement OTP sending logic here
    setIsOtpSent(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Implement your form submission logic here
  };
  return (
    <>
    <Breadcrumb/>
    <div className="max-w-4xl mx-auto p-6  bg-white shadow-xl rounded-lg mt-5 mb-5">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
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
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Mobile Number*</label>
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
            <button
              type="button"
              onClick={handleSendOTP}
              className="absolute right-0 top-5 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700"
            >
              Send OTP
            </button>
          </div>

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
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-32 theme-btn text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
    </>
  );
}

export default Sell;
