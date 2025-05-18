'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const options = [
  { id: 1, name: 'New Asia', bgImage: '/slide2.svg', estado: 'archive', link: '/new-asia' },
  { id: 2, name: 'New York', bgImage: '/slide3.svg', estado: 'proximamente', estadoAccion: '01:02:03:00', link: '/collections/newyork' },
  { id: 3, name: 'Initiation', bgImage: '/slide1.svg', estado: '07 | 03 | 25', estadoAccion: 'Shop', link: '/collections/initiation' },
  { id: 4, name: 'Tokio', bgImage: '/slide2.svg', estado: 'proximamente', estadoAccion: '01:02:03:00', link: '/tokio' },
  { id: 5, name: 'Opción 5', bgImage: '/slide1.svg', estado: '09|05|25', estadoAccion: 'Shop', link: '/option-5' },
];

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(4); // Start at index 4 (Opción 5)
  const [previousIndex, setPreviousIndex] = useState(4);
  const [transitionProgress, setTransitionProgress] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchOffset, setTouchOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const extendedOptions = [...options.slice(-2), ...options, ...options.slice(0, 2)];
  const totalItems = extendedOptions.length;
  const sliderRef = useRef(null);

  // Detect if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle desktop click interaction
  const handleInteraction = (index) => {
    if (index === currentIndex || isTransitioning) return;

    setPreviousIndex(currentIndex);
    setCurrentIndex(index);
    setIsTransitioning(true);
    setTransitionProgress(0);
  };

  // Handle touch start
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    if (!isDragging || touchStartX === null) return;

    const touchCurrentX = e.touches[0].clientX;
    const deltaX = touchCurrentX - touchStartX;
    const slideWidth = sliderRef.current.offsetWidth / 5; // Width of one slide
    const offsetPercentage = (deltaX / slideWidth) * (100 / 5); // Convert to percentage
    setTouchOffset(offsetPercentage);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    setTouchOffset(0);

    const slideWidth = sliderRef.current.offsetWidth / 5;
    const swipeDistance = (touchOffset / (100 / 5)) * slideWidth;
    const swipeThreshold = slideWidth * 0.3; // Swipe must be at least 30% of slide width to trigger change

    let newIndex = currentIndex;
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        newIndex = currentIndex - 1; // Swipe right
      } else {
        newIndex = currentIndex + 1; // Swipe left
      }
    }

    setPreviousIndex(currentIndex);
    setCurrentIndex(newIndex);
    setIsTransitioning(true);
    setTransitionProgress(0);
  };

  // Handle infinite loop
  useEffect(() => {
    if (currentIndex < 2 || currentIndex >= totalItems - 2) {
      setPreviousIndex(currentIndex);
      const newIndex = currentIndex < 2 ? currentIndex + options.length : currentIndex - options.length;
      setCurrentIndex(newIndex);
      setIsTransitioning(true);
      setTransitionProgress(0);
    }
  }, [currentIndex]);

  // Handle background transition animation
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
    <div className="relative w-full h-[100vh] md:h-screen overflow-hidden bg-black">
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
            ref={sliderRef}
            className={`flex transition-transform duration-300 ease-out touch-none select-none ${
              isDragging ? 'transition-none' : ''
            }`}
            style={{
              transform: `translateX(calc(50% - ${currentIndex * (100 / 5)}% - ${50 / 5}% + ${touchOffset}%))`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {extendedOptions.map((option, index) => (
              <div
                key={`${option.id}-${index}`}
                className={`w-[20%] flex-shrink-0 px-4 transition-all duration-300 cursor-pointer
                  ${index === currentIndex ? 'scale-110 z-10' : 'scale-90 opacity-70'}`}
                onClick={() => !isMobile && handleInteraction(index)} // Desktop click
              >
                <div className="block">
                  <div className="text-[#FFFFFF] rounded-lg p-4 text-center">
                    <h3 className="text-lg font-semibold uppercase">{option.name}</h3>
                    <p>{option.estado}</p>
                    {index === currentIndex && (
                      <Link href={option.link}>
                        <p>{option.estadoAccion}</p>
                      </Link>
                    )}
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