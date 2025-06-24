'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Axios from 'axios';
import Footer from './Footer';

// Inline Loader Component
const Loader = ({ loading, imageLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let rafId;
    const maxLoadingTime = 5000; // 5 seconds max
    const increment = 0.3; // Smaller increment for smoother progress
    let startTime = performance.now();

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const duration = maxLoadingTime;

      setProgress((prev) => {
        // Simulate progress with an easing curve (ease-in-out)
        let baseProgress = (elapsed / duration) * 100;
        if (!loading) baseProgress = Math.max(baseProgress, 50); // Data loaded = at least 50%
        if (imageLoaded) baseProgress = Math.max(baseProgress, 80); // Image loaded = at least 80%
        
        // Apply ease-in-out curve
        const easedProgress = 100 * (1 - Math.cos((baseProgress / 100) * Math.PI)) / 2;
        const totalProgress = Math.min(easedProgress, 100);

        if (totalProgress >= 100 || elapsed >= duration) {
          setTimeout(() => setIsVisible(false), 500); // Delay hiding for smooth transition
          return 100;
        }

        return Math.min(prev + increment, totalProgress);
      });

      rafId = requestAnimationFrame(updateProgress);
    };

    if (loading || !imageLoaded) {
      rafId = requestAnimationFrame(updateProgress);
      const timeout = setTimeout(() => {
        setProgress(100);
        setIsVisible(false);
      }, maxLoadingTime);
      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timeout);
      };
    } else {
      setProgress(100);
      setTimeout(() => setIsVisible(false), 500);
    }

    return () => cancelAnimationFrame(rafId);
  }, [loading, imageLoaded]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-50 bg-gradient-to-r from-[#303F48] to-[#6D7276]">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-[100ms] ease-in-out"
        style={{
          backgroundImage: 'url(/lineasCodigo.svg)',
          clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`,
        }}
      ></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
        <span
          className="font-medium text-2xl leading-none tracking-[-0.02em] text-center uppercase text-[#F9F9F9]"
          style={{ fontFamily: 'IBM Plex Mono' }}
        >
          Initiating SYSTEM
        </span>
        <div className="w-[305px] md:w-[405px] h-7 rounded-[2px] border border-[#F2F2F2] p-2 bg-[#FFFFFF1A] overflow-hidden">
          <div
            className="h-full bg-[#D9D9D9] transition-all duration-[100ms] ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span
          className="font-light text-lg leading-none tracking-[-0.02em] text-center uppercase text-[#F9F9F9]"
          style={{ fontFamily: 'IBM Plex Mono' }}
        >
          {Math.floor(progress)}%
        </span>
      </div>
    </div>
  );
};

const Accesoriesg = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Preload the background image
    const img = new window.Image();
    img.src = '/lineasCodigo.svg';
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      console.error('Failed to load background image');
      setImageLoaded(true);
    };

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await Axios.get('https://eeva-api.vercel.app/api/v1/products');
        const filteredProducts = response.data.filter(
          (product) => product.type === 'ACCESSORIES' && product.gender === 'FEMALE'
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

  const productList = useMemo(() => {
    return products.map((product) => (
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
            priority
            className="object-contain"
          />
          <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
              SEE PRODUCT
            </span>
          </div>
        </div>
        <h3 className="text-[#FFFFFF] text-center mt-2">{product.displayName}</h3>
      </Link>
    ));
  }, [products]);


  if (loading || !imageLoaded) {
    return <Loader loading={loading} imageLoaded={imageLoaded} />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
      <p className="text-white text-lg w-full max-w-[20rem] sm:max-w-[75rem] 2xl:max-w-[95rem] border-b border-[#AEAEAE] uppercase">
      ACCESSORIES - WOMEN
      </p>
      <div className="w-full max-w-[90%] mx-auto mt-[40px]">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            productList
          ) : (
            <p className="text-white text-center col-span-4">No men's BOTTOM found</p>
          )}
        </div>
      </div>
      <div className="w-[90%] h-[315px] md:h-[415px] flex md:min-w-[1315px]">
        <Footer />
      </div>
    </div>
  );
};

export default React.memo(Accesoriesg);