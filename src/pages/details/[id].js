import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Redux/counter/counterSlice";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaRupeeSign } from "react-icons/fa";
import Link from "next/link";

export default function ProductDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/parts`, { params: { id } })
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

  const handleIncrement = () => {
    if (quantity < Math.min(product.Stock, 10)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ item: product, quantity, type: "set" }));
    }
  };

  const renderStockStatus = () => {
    if (product.Stock > 3) {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span>In Stock</span>
        </div>
      );
    } else if (product.Stock > 0) {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700">
          <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
          <span>Low Stock - Only {product.Stock} left!</span>
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
          <span>Out of Stock</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <p className="ml-4 text-lg">Loading product details...</p>
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
          onClick={() => router.push('/parts')} 
          className="mt-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          Back to Parts Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 mt-24 ">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-screen-lg mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/parts" className="text-gray-500 hover:text-gray-700">Parts</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{product?.name || "Part Details"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div className="p-6 flex items-center justify-center bg-gray-50">
              <div className="relative w-full aspect-square max-h-96 rounded-lg overflow-hidden">
                {product.img ? (
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">Image not available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name || "Product Name"}</h1>
                <div className="flex items-center">
                  {product.Stock !== undefined && renderStockStatus()}
                  {product.item_id && (
                    <span className="ml-3 text-sm text-gray-500">Item #: {product.item_id}</span>
                  )}
                </div>
                {product.status && (
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Status: {product.status}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center text-3xl font-bold text-red-600 mb-2">
                  <FaRupeeSign className="text-2xl" />
                  <span>{product.price || "0.00"}</span>
                </div>
              </div>

              <div className="mb-6 prose prose-sm">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">
                  {product.Description || "No description available for this part."}
                </p>
              </div>

              {product.Stock > 0 && (
                <div className="flex flex-col space-y-6">
                  <div className="flex items-center">
                    <span className="font-medium mr-4">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-l"
                        onClick={handleDecrement}
                      >
                        <span className="text-xl font-medium">−</span>
                      </button>
                      <span className="w-12 text-center py-2">{quantity}</span>
                      <button
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-r"
                        onClick={handleIncrement}
                      >
                        <span className="text-xl font-medium">+</span>
                      </button>
                    </div>
                    {product.Stock < 5 && (
                      <span className="ml-4 text-sm text-red-600">
                        Only {product.Stock} available
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="theme-btn flex items-center justify-center py-3 px-6 rounded-lg w-full md:w-64"
                  >
                    <HiOutlineShoppingCart className="text-xl mr-2" /> 
                    <span>Add to Cart</span>
                  </button>
                </div>
              )}

              {product.Stock === 0 && (
                <div className="mt-6">
                  <button
                    disabled
                    className="bg-gray-300 text-gray-500 cursor-not-allowed py-3 px-6 rounded-lg w-full md:w-64 flex items-center justify-center"
                  >
                    <HiOutlineShoppingCart className="text-xl mr-2" /> 
                    <span>Out of Stock</span>
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    This item is currently out of stock. Please check back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Details */}
        {/* <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b">
            <div className="px-6 py-4">
              <h2 className="text-xl font-bold">Technical Details</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Item Number:</span>
                <span className="text-gray-900">{product.item_id}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Name:</span>
                <span className="text-gray-900">{product.name}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Status:</span>
                <span className="text-gray-900 capitalize">{product.status}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-32">Stock:</span>
                <span className="text-gray-900">{product.Stock} units</span>
              </div>
              <div className="flex col-span-2">
                <span className="font-medium text-gray-600 w-32">Description:</span>
                <span className="text-gray-900">{product.Description}</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}   