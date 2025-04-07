'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Importa Link de Next.js

const options = [
  { id: 1, name: 'Initiation', bgImage: '/slide1.svg', estado: '07 | 03 | 25', estadoAccion: 'Shop', link: '/collections/initiation' },
  { id: 2, name: 'New Asia', bgImage: '/slide2.svg', estado: 'archive', link: '/new-asia' },
  { id: 3, name: 'New York', bgImage: '/slide3.svg', estado: 'proximamente', estadoAccion: '01:02:03:00', link: '/new-york' },
  { id: 4, name: 'Tokio', bgImage: '/slide2.svg', estado: 'proximamente', estadoAccion: '01:02:03:00', link: '/tokio' },
  { id: 5, name: 'Opción 5', bgImage: '/slide1.svg', estado: '09|05|25', estadoAccion: 'Shop', link: '/option-5' },
];

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [previousIndex, setPreviousIndex] = useState(2);
  const [transitionProgress, setTransitionProgress] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const extendedOptions = [...options.slice(-2), ...options, ...options.slice(0, 2)];
  const totalItems = extendedOptions.length;

  const handleClick = (index) => {
    if (index === currentIndex || isTransitioning) return;

    setPreviousIndex(currentIndex);
    setCurrentIndex(index);
    setIsTransitioning(true);
    setTransitionProgress(0);
  };

  useEffect(() => {
    if (currentIndex < 2 || currentIndex >= totalItems - 2) {
      setPreviousIndex(currentIndex);
      const newIndex = currentIndex < 2 ? currentIndex + options.length : currentIndex - options.length;
      setCurrentIndex(newIndex);
      setIsTransitioning(true);
      setTransitionProgress(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    let animationFrame;
    if (isTransitioning) {
      const animate = () => {
        setTransitionProgress((prev) => {
          if (prev < 1) {
            return prev + 0.05;
          } else {
            setIsTransitioning(false);
            return 1;
          }
        });
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isTransitioning]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Fondo anterior */}
      <Image
        src={extendedOptions[previousIndex]?.bgImage}
        alt="Previous slide"
        fill
        className="absolute inset-0 object-cover transition-opacity duration-500 ease-in-out"
        style={{ opacity: 1 - transitionProgress }}
      />

      {/* Fondo actual */}
      <Image
        src={extendedOptions[currentIndex]?.bgImage}
        alt="Current slide"
        fill
        className="absolute inset-0 object-cover transition-opacity duration-500 ease-in-out"
        style={{ opacity: transitionProgress }}
      />

      {/* Slider */}
      <div className="absolute top-1/2 left-[-290px] right-[-290px] lg:left-[-140px] lg:right-[-140px] transform -translate-y-1/2">
        <div className="relative w-full overflow-hidden">
          <div
            className={`flex transition-transform duration-500 ease-in-out ${
              isTransitioning ? '' : 'transition-none'
            }`}
            style={{
              transform: `translateX(calc(50% - ${currentIndex * (100 / 5)}% - ${50 / 5}%))`,
            }}
          >
            {extendedOptions.map((option, index) => (
              <div
                key={`${option.id}-${index}`}
                className={`w-[20%] flex-shrink-0 px-4 transition-all duration-300 cursor-pointer
                  ${index === currentIndex ? 'scale-110 z-10' : 'scale-90 opacity-70'}`}
                onClick={() => handleClick(index)} // Mantienes el cambio de índice
              >
                <div  className="block">
                  <div className="text-[#FFFFFF] rounded-lg p-4 text-center">
                    <h3 className="text-lg font-semibold">{option.name}</h3>
                    <p>{option.estado}</p>
                    <Link href={option.link}>{index === currentIndex && <p>{option.estadoAccion}</p>}</Link>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Paginación con líneas animadas */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 w-[30%]">
        {options.map((_, index) => (
          <div
            key={index}
            className={`h-[4px] backdrop-blur-[10px] bg-[#F2F2F24D] transition-all duration-500 ease-in-out`}
            style={{
              flex: index === currentIndex - 2 ? 1.5 : 1,
              opacity: index === currentIndex - 2 ? 1 : 0.5,
              transform: index === currentIndex - 2 ? 'scaleX(0.1)' : 'scaleX(0.4)',
            }}
          />
        ))}

        <div
          className="absolute h-[4px] bg-[#F2F2F2] transition-transform duration-500 ease-in-out"
          style={{
            width: `${100 / options.length}%`,
            transform: `translateX(${(currentIndex - 2) * 100}%)`,
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}