import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    if (id) {
      axios
        .get(`/api/inventory`, { params: { id } })
        .then((response) => {
          if (response.data && response.data.length > 0) {
            setProduct(response.data[0]);
          } else {
            setError("Product not found.");
          }
        })
        .catch(() => setError("Failed to fetch product details."))
        .finally(() => setLoading(false));
    }
  }, [id]);
  
  const handleBookTestDrive = () => {
    router.push("/testdrive");
  };
  
  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        <p className="ml-4 text-lg font-medium">Loading vehicle details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-lg">
          <p className="text-lg font-medium">{error}</p>
        </div>
        <button 
          onClick={handleBack} 
          className="mt-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 mt-24">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-accent">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/inventory" className="text-gray-500 hover:text-accent ">Inventory</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product?.name || "Car Details"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            <div className="p-6 flex items-center justify-center bg-gray-100">
              {product?.image ? (
                <div className="relative w-full h-96 rounded-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-200 rounded-lg">
                  <p className="text-gray-500">Image not available</p>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name || "Vehicle"}</h1>
              
              {/* Price Tag */}
              <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg text-xl font-bold mb-6">
                {product?.price || "Price unavailable"}
              </div>
              
              {/* Specs Overview */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {product?.year && (
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600">✓</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium">{product.year}</p>
                    </div>
                  </div>
                )}
                
                {product?.mileage && (
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600">✓</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mileage</p>
                      <p className="font-medium">{product.mileage} mi</p>
                    </div>
                  </div>
                )}
                
                {product?.transmission && (
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600">✓</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="font-medium">{product.transmission}</p>
                    </div>
                  </div>
                )}
                
                {product?.fuelType && (
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-yellow-600">✓</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fuel Type</p>
                      <p className="font-medium">{product.fuelType}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product?.description || "No description available for this vehicle."}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={handleBookTestDrive}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  Book a Test Drive
                </button>
                
                <button className="border border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  Contact Dealer
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        {product?.features && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Vehicle Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.isArray(product.features) ? (
                product.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    <span>{feature}</span>
                  </div>
                ))
              ) : (
                <p>Features information not available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}