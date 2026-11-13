'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Axios from 'axios';
import { PRODUCTS_URL, filterCategory } from '@/lib/products';
import Footer from './Footer';
import Loader from './Loader';

const Accesoriesg = ({ initialProducts }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Los productos ya vienen del servidor; solo se piden acá si ese pedido falló
    if (initialProducts) return;

    const fetchProducts = async () => {
      try {
        const response = await Axios.get(PRODUCTS_URL);
        const filteredProducts = filterCategory(response.data, 'ACCESSORIES', 'FEMALE');
        setProducts(filteredProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialProducts]);

  const productList = useMemo(() => {
    return products.map((product, index) => (
      <Link
        key={product._id}
        href={`/collections/initiation/product/${product._id}`}
        className="group w-full max-w-[289px] mx-auto h-auto relative flex flex-col"
      >
        <div className="relative w-full h-[240px] sm:h-[315px] md:h-[589px] xl:h-[440px] 2xl:h-[450px]">
          <Image
            src={`/static/${product.models.images.static}.webp`}
            alt={product.displayName}
            fill
            priority={index < 4}
            className="object-contain"
          />
          <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
              VER PRODUCTO
            </span>
          </div>
        </div>
        <h3 className="text-[#FFFFFF] text-center mt-2">{product.displayName}</h3>
      </Link>
    ));
  }, [products]);


  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <>
    <Loader loading={loading} />
    <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
      <p className="text-white text-lg w-full max-w-[20rem] sm:max-w-[75rem] 2xl:max-w-[95rem] border-b border-[#AEAEAE] uppercase">
      ACCESSORIES - WOMEN
      </p>
      <div className="w-full max-w-[90%] mx-auto mt-[40px]">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            productList
          ) : (
            <p className="text-white text-center col-span-4">No hay productos en esta categoría por ahora.</p>
          )}
        </div>
      </div>
      <div className="w-[90%] h-[315px] md:h-[415px] flex md:min-w-[1315px]">
        <Footer />
      </div>
    </div>
    </>
  );
};

export default React.memo(Accesoriesg);