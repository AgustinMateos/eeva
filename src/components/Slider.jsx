'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const options = [
  { id: 1, name: 'Initiation', bgImage: '/slide1.svg' },
  { id: 2, name: 'New Asia', bgImage: '/slide2.svg' },
  { id: 3, name: 'New York', bgImage: '/slide3.svg' },
  { id: 4, name: 'Opción 4', bgImage: '/slide2.svg' },
  { id: 5, name: 'Opción 5', bgImage: '/slide1.svg' },
];

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(2); // Opción 3 seleccionada inicialmente
  const [previousIndex, setPreviousIndex] = useState(2); // Índice de la imagen anterior (inicialmente igual)
  const [transitionProgress, setTransitionProgress] = useState(1); // Progreso de la transición (0 a 1)
  const [isTransitioning, setIsTransitioning] = useState(false);

  const extendedOptions = [...options.slice(-2), ...options, ...options.slice(0, 2)];
  const totalItems = extendedOptions.length;

  const handleClick = (index) => {
    if (index === currentIndex || isTransitioning) return;

    setPreviousIndex(currentIndex); // Guardar la imagen actual como anterior
    setCurrentIndex(index); // Cambiar a la nueva imagen inmediatamente
    setIsTransitioning(true);
    setTransitionProgress(0); // Iniciar la transición desde 0
  };

  // Manejar la transición infinita con efecto de esfumarse
  useEffect(() => {
    if (currentIndex < 2 || currentIndex >= totalItems - 2) {
      setPreviousIndex(currentIndex); // Guardar el índice actual como anterior
      const newIndex =
        currentIndex < 2 ? currentIndex + options.length : currentIndex - options.length;
      setCurrentIndex(newIndex); // Cambiar al nuevo índice
      setIsTransitioning(true);
      setTransitionProgress(0); // Iniciar la transición
    }
  }, [currentIndex]);

  // Controlar la animación de la transición del fondo
  useEffect(() => {
    let animationFrame;
    if (isTransitioning) {
      const animate = () => {
        setTransitionProgress((prev) => {
          if (prev < 1) {
            return prev + 0.02; // Ajusta la velocidad de la transición
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
    <div className="relative w-full h-screen overflow-hidden bg-transparent">
      {/* Fondo anterior (fade out) */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-in-out"
        style={{
          backgroundImage: `url(${extendedOptions[previousIndex]?.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 1 - transitionProgress, // Fade out progresivo
        }}
      />

      {/* Fondo actual (fade in) */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-in-out"
        style={{
          backgroundImage: `url(${extendedOptions[currentIndex]?.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: transitionProgress, // Fade in progresivo
        }}
      />

      {/* Slider centrado verticalmente */}
      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
        <div className="relative w-full overflow-hidden">
          <div
            className={`flex transition-transform duration-500 ease-in-out ${
              isTransitioning ? '' : 'transition-none'
            }`}
            style={{
              // Ajuste para centrar siempre la opción seleccionada
              transform: `translateX(calc(50% - ${currentIndex * (100 / 5)}% - ${50 / 5}%))`,
            }}
          >
            {extendedOptions.map((option, index) => (
              <div
                key={`${option.id}-${index}`}
                className={`w-[20%] flex-shrink-0 px-4 transition-all duration-300 cursor-pointer
                  ${index === currentIndex ? 'scale-110 z-10' : 'scale-90 opacity-70'}`}
                onClick={() => handleClick(index)}
              >
                <div
                  className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center
                    ${index === currentIndex ? 'border-2 border-blue-500' : ''}`}
                >
                  <h3 className="text-lg font-semibold">{option.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}