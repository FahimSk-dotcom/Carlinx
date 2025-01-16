import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Redux/counter/counterSlice";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaRupeeSign } from "react-icons/fa";

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
    if (quantity < Math.min(product.stock, 10)) {
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
      return <p className="text-green-600 font-semibold">Stock: Available</p>;
    } else if (product.Stock > 0) {
      return (
        <p className="text-red-600 font-bold">
          Stock: Only {product.Stock} left!
        </p>
      );
    } else {
      return <p className="text-red-600 font-bold">Out of Stock</p>;
    }
  };

  if (loading) return <p className="text-center mt-10">Loading product details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  console.log("Product stock:", product.Stock);

  return (
    <div className="p-6 max-w-screen-lg mx-auto mt-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.img ? (
          <Image
            src={product.img}
            alt={product.name}
            width={500}
            height={400}
            className="rounded"
          />
        ) : (
          <div className="bg-gray-100 w-full h-64 flex items-center justify-center">
            <p className="text-gray-500">Image not available</p>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name || "Product Name"}</h1>
          <p className="text-gray-600 mb-4">{product.Description || "No description available."}</p>
          <div className="text-2xl font-bold flex items-center text-red-500 mb-4">
            <FaRupeeSign />
            {product.price || "0.00"}
          </div>

          <div className="mt-4">
            {product.Stock !== undefined ? renderStockStatus() : <p>Loading stock status...</p>}
          </div>

          {product.stock > 0 && (
            <div className="flex items-center mt-4">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border rounded ml-4">
                <button
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                  onClick={handleDecrement}
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.Stock === 0}
            className={`theme-btn max-w-64 h-9 mt-4 flex items-center justify-center ${
              product.Stock === 0 ? "bg-gray-400 cursor-not-allowed" : ""
            }`}
          >
            <HiOutlineShoppingCart className="text-xl" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
