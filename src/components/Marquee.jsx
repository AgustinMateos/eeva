'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Marquee = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Conjunto de imágenes predeterminadas con URLs y nombres
  const defaultImages = [
    { src: '/costado.svg', url: '/collections/initiation/product/67f935200f9bad0183343d27', name: 'Producto Test' },
    { src: '/costado.svg', url: '/products/2', name: 'Producto Pablo' },
    { src: '/costado.svg', url: '/products/3', name: 'Producto Ana' },
    { src: '/costado.svg', url: '/products/4', name: 'Camisa Oversize' },
    { src: '/costado.svg', url: '/products/5', name: 'Pantalón Cargo' },
    { src: '/costado.svg', url: '/products/6', name: 'Accesorio Minimal' },
  ];

  // Conjunto de imágenes al hacer hover con URLs y nombres
  const hoverImages = [
    { src: '/front.svg', url: '/collections/initiation/product/67f935200f9bad0183343d27', name: 'Producto Test' },
    { src: '/front.svg', url: '/products/2', name: 'Producto Pablo' },
    { src: '/front.svg', url: '/products/3', name: 'Producto Ana' },
    { src: '/front.svg', url: '/products/4', name: 'Camisa Oversize' },
    { src: '/front.svg', url: '/products/5', name: 'Pantalón Cargo' },
    { src: '/front.svg', url: '/products/6', name: 'Accesorio Minimal' },
  ];

  // Seleccionar el conjunto de imágenes según el estado de hover
  const images = isHovered ? hoverImages : defaultImages;

  return (
    <div className="w-full overflow-hidden py-8 flex justify-center">
      <div className="w-[80%]">
        <div className="text-[#FFFFFF] font-normal text-base leading-[64px] tracking-[-4%] align-middle">
          YOU ALSO MAY LIKE
        </div>
        <div
          className="marquee-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="marquee flex items-center">
            {[...images, ...images].map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className="flex-shrink-0 mx-4 flex flex-col items-center"
              >
                <Image
                  src={item.src}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="object-cover rounded-lg"
                />
                <p className="text-white text-[12px] uppercase mt-2 text-center">{item.name}</p>
              </Link>
            ))}
          </div>
        </div>

        <style jsx>{`
          .marquee-wrapper {
            width: 100%;
            overflow: hidden;
          }

          .marquee {
            display: flex;
            animation: marquee 20s linear infinite;
            white-space: nowrap;
          }

          .marquee:hover {
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
        `}</style>
      </div>
    </div>
  );
};

export default Marquee;