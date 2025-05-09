'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Axios from 'axios';
import Footer from './Footer';

export default function Topg() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Axios.get('https://eeva-api.vercel.app/api/v1/products');
        // Filter products for type: "TOP" and gender: "MALE"
        const filteredProducts = response.data.filter(
          (product) => product.type === 'BOTTOM' && product.gender === 'MALE'
        );
        setProducts(filteredProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
      <p className="text-white text-lg w-full max-w-[75rem] border-b border-[#AEAEAE] uppercase">
        BOTTOM - MEN
      </p>

      <div className="w-full max-w-[90%] mx-auto mt-[60px]">
        {/* Grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="group w-full max-w-[289px] mx-auto h-auto relative flex flex-col"
              >
                <Image
                  src={`/${product.models.images.static}.svg`} // Adjust image path as per your setup
                  alt={product.displayName}
                  width={289}
                  height={415}
                  className="object-cover w-full h-auto"
                />
                <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
                    SEE PRODUCT
                  </span>
                </div>
                <h3 className="text-[#FFFFFF] text-center mt-2">{product.displayName}</h3>
              </Link>
            ))
          ) : (
            <p className="text-white text-center col-span-4">No women's tops found</p>
          )}
        </div>
      </div>

      <div className="h-[315px] flex md:min-w-[1315px]">
        <Footer />
      </div>
    </div>
  );
}