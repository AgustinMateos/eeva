'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Axios from 'axios';

const Marquee = () => {
  const [products, setProducts] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Axios.get('https://eeva-api.vercel.app/api/v1/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="w-full overflow-hidden py-8 flex justify-center md:h-[400px]">
      <div className="w-[80%]">
        <div className="text-[#FFFFFF] font-normal text-base leading-[64px] tracking-[-4%] align-middle">
          YOU ALSO MAY LIKE
        </div>
        <div
          className="marquee-wrapper overflow-x-auto md:overflow-hidden scrollbar-hide snap-x snap-mandatory"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="marquee flex items-center md:animate-marquee md:[&:hover]:animation-play-state-paused">
            {products.length > 0 ? (
              [...products, ...products].map((product, index) => (
                <Link
                  key={`${product._id}-${index}`}
                  href={`/collections/initiation/product/${product._id}`}
                  className="flex-shrink-0 mx-4 flex flex-col items-center snap-center"
                >
                  <Image
                    src={
                      // On mobile, always use static image; on desktop, toggle based on hover
                      window.innerWidth < 768
                        ? `/360/${product.models.images.gif360}-1.webp`
                        : isHovered
                        ? `/360/${product.models.images.gif360}-7.webp`
                        : `/360/${product.models.images.gif360}-1.webp`
                    }
                    alt={product.displayName}
                    width={200}
                    height={200}
                    className="object-cover rounded-lg"
                    onError={() => `/images/placeholder.svg`} // Fallback image
                  />
                  <p className="text-white text-[12px] uppercase mt-2 text-center">{product.displayName}</p>
                </Link>
              ))
            ) : (
              <p className="text-white text-center w-full">No products available</p>
            )}
          </div>
        </div>

        <style jsx>{`
          .marquee-wrapper {
            width: 100%;
          }

          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .snap-x {
            scroll-snap-type: x mandatory;
          }

          .snap-center {
            scroll-snap-align: center;
          }

          @media (min-width: 768px) {
            .marquee {
              display: flex;
              animation: marquee 20s linear infinite;
              white-space: nowrap;
            }

            .animation-play-state-paused {
              animation-play-state: paused;
            }

            @keyframes marquee {
              0% {
                transform: translateX(-50%);
              }
              100% {
                transform: translateX(0);
              }
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Marquee;