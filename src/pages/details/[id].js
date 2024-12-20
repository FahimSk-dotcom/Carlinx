import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react"; // Import useState

// Importing images
import part1 from '../../../public/jpgs/parts-1.jpg'
import part2 from '../../../public/jpgs/parts-2.jpg'
import part3 from '../../../public/jpgs/parts-3.jpg'
import part4 from '../../../public/jpgs/parts-4.jpg'
import part5 from '../../../public/jpgs/parts-5.jpg'
import part6 from '../../../public/jpgs/parts-6.jpg'
import part7 from '../../../public/jpgs/parts-7.jpg'
import part8 from '../../../public/jpgs/parts-8.jpg'
import part9 from '../../../public/jpgs/parts-9.jpg'
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaRupeeSign } from "react-icons/fa";
import Link from "next/link";

// Sample product data
const partsdata = [
  {
    id: 1,
    name: 'Engine Assembly',
    Description: 'The engine is the heart of the car, converting fuel into mechanical energy to propel the vehicle.',
    stock: "Available",
    price: 70000, // Convert to number
    img: part9,
  },
  {
    id: 2,
    name: 'Alternator',
    Description:'An alternator generates electrical power in a car, charging the battery and supplying power to the electrical system when the engine is running.',
    stock: "Available",
    price: 50000, // Convert to number
    img: part2,
  },
  {
    id: 3,
    name: 'Brake Rotor',
    Description:
      'The brake rotor (disc) is a critical part of the braking system. It provides a surface for the brake pads to clamp down on, generating friction that slows the vehicle.',
    stock: "Available",
      price: 7000, // Convert to number
    img: part1,
  },
  {
    id: 4,
    name: 'Shock Absorbers',
    Description: 'Shock absorbers reduce the impact of road irregularities, improving ride comfort and handling.',
    stock: "Available",
    price: 6000,
    img: part7,
  },
  {
    id: 5,
    name: 'Oil Filter',
    Description: 'The oil filter removes impurities and particles from engine oil.',
    stock: "Available",
    price: 700,
    img: part6,
  },
  {
    id: 6,
    name: 'Engine Oil',
    Description: 'Engine oil lubricates the internal components of the engine.',
    stock: "Available",
    price: 400,
    img: part5,
  },
  {
    id: 7,
    name: 'Car Tires (Set of 4)',
    Description: 'Tires provide traction, handling, and ride comfort.',
    stock: "Available",
    price: 10000,
    img: part3,
  },
  {
    id: 8,
    name: 'Spark Plugs',
    Description: 'Spark plugs ignite the air-fuel mixture in the engine.',
    stock: "Available",
    price: 800,
    img: part4,
  },
  {
    id: 9,
    name: 'Car Suspension Parts',
    Description: 'This suspension system is responsible for controlling wheel movement.',
    stock: "Available",
    price: 20000,
    img: part8,
  },
];

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;

  // Find product by ID
  const product = partsdata.find((item) => item.id === Number(id));
  const [quantity, setQuantity] = useState(1); // State for quantity

  if (!product) return <p className="text-center mt-10">Product not found</p>;

  // Handlers for increment and decrement
  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <>
    <div className="p-6 max-w-screen-lg mx-auto mt-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <Image
          src={product.img}
          alt={product.name}
          width={500}
          height={400}
          className="rounded mt-[-80px]"
        />

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.Description}</p>

          <div className="text-2xl font-bold flex items-center text-red-500 mb-4">
            <FaRupeeSign />
            {product.price}
          </div>

          <div>
            <span className="font-semibold">Stock: </span>
            {product.stock}
          </div>

          {/* Quantity Selector */}
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

          {/* Add to Cart Button */}
          <div className="button flex gap-2 mt-3">
          <Link href='/cart' className="theme-btn max-w-64 h-9 mt-2 flex items-center justify-center">
            <HiOutlineShoppingCart className="text-xl" /> Add to Cart
          </Link>
          <button className="theme-btn max-w-64 h-9 mt-2 flex items-center justify-center">
            <HiOutlineShoppingCart className="text-xl" /> Buy Now
          </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
