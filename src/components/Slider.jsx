'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const options = [
  { id: 1, name: 'New Asia', bgImage: '/slide2.svg', mobileBgImage: '/mobile-slide2.svg', estado: 'archive', link: '/new-asia' },
  { id: 2, name: 'New York', bgImage: '/slide3.svg', mobileBgImage: '/mobile-slide3.svg', estado: 'proximamente', estadoAccion: '01:02:03:00', link: '/collections/newyork' },
  { id: 3, name: 'Initiation', bgImage: '/initiationslider.jpg', mobileBgImage: '/initiationmobile.webp', estado: '07 | 03 | 25', estadoAccion: 'Shop', link: '/collections/initiation' },
  { id: 4, name: 'Tokio', bgImage: '/slide2.svg', mobileBgImage: '/mobile-slide2.svg', estado: 'proximamente', estadoAccion: '01:02:03:00', link: '/tokio' },
  { id: 5, name: 'Opción 5', bgImage: '/slide1.svg', mobileBgImage: '/mobile-slide1.svg', estado: '09|05|25', estadoAccion: 'Shop', link: '/option-5' },
];

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(4);
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInteraction = (index) => {
    if (index === currentIndex || isTransitioning) return;
    setPreviousIndex(currentIndex);
    setCurrentIndex(index);
    setIsTransitioning(true);
    setTransitionProgress(0);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || touchStartX === null) return;
    const touchCurrentX = e.touches[0].clientX;
    const deltaX = touchCurrentX - touchStartX;
    const slideWidth = sliderRef.current.offsetWidth / 5;
    const offsetPercentage = (deltaX / slideWidth) * (100 / 5);
    setTouchOffset(offsetPercentage);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setTouchOffset(0);
    const slideWidth = sliderRef.current.offsetWidth / 5;
    const swipeDistance = (touchOffset / (100 / 5)) * slideWidth;
    const swipeThreshold = slideWidth * 0.3;
    let newIndex = currentIndex;
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        newIndex = currentIndex - 1;
      } else {
        newIndex = currentIndex + 1;
      }
    }
    setPreviousIndex(currentIndex);
    setCurrentIndex(newIndex);
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
    <div className="relative w-full h-[100vh] overflow-hidden bg-black overscroll-y-none" style={{ touchAction: 'pan-x' }}>
      {/* Fondo anterior */}
      <Image
        src={isMobile ? extendedOptions[previousIndex]?.mobileBgImage : extendedOptions[previousIndex]?.bgImage}
        alt="Previous slide"
        fill
        className="absolute inset-0 object-cover transition-opacity duration-500 ease-in-out"
        style={{ opacity: 1 - transitionProgress }}
      />

      {/* Fondo actual */}
      <Image
        src={isMobile ? extendedOptions[currentIndex]?.mobileBgImage : extendedOptions[currentIndex]?.bgImage}
        alt="Current slide"
        fill
        className="absolute inset-0 object-cover transition-opacity duration-500 ease-in-out"
        style={{ opacity: transitionProgress }}
      />

      {/* Slider */}
      <div className="absolute top-[350px] md:top-[400px] left-[-290px] right-[-290px] lg:left-[-140px] lg:right-[-140px] transform -translate-y-1/2 h-full flex items-center">
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
                onClick={() => !isMobile && handleInteraction(index)}
              >
                <div className="block h-full flex items-center justify-center">
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 w-[30%] pb-4">
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