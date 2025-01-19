import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { FaRupeeSign } from "react-icons/fa";

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

  if (loading) return <p className="text-center mt-10">Loading product details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  console.log(product)
  return (
    <div className="p-6 max-w-screen-lg mx-auto mt-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={400}
            className="rounded-2xl"
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
        </div>
      </div>
    </div>
  );
}
