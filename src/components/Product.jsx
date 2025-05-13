'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProductCareOpen, setIsProductCareOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isShopLookOpen, setIsShopLookOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const sliderRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://eeva-api.vercel.app/api/v1/products/${id}`);
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);

        if (fetchedProduct.models?.images?.gif360) {
          setImages([
            `/${fetchedProduct.models.images.gif360}.svg`,
            `/${fetchedProduct.models.images.gif360}2.svg`,
            `/${fetchedProduct.models.images.gif360}3.svg`,
            `/${fetchedProduct.models.images.gif360}4.svg`,
            `/${fetchedProduct.models.images.gif360}5.svg`,
            `/${fetchedProduct.models.images.gif360}6.svg`
          ]);
        } else {
          setImages([
            '/rotate1.svg',
            '/rotate2.svg',
            '/rotate3.svg',
            '/rotate4.svg',
            '/rotate5.svg'
          ]);
        }

        if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
          setSelectedColor(fetchedProduct.colors[0].color.name);
        }
      } catch (err) {
        setError('Error al cargar el producto');
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (isPaused || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 700);

    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  const handleMagnifyClick = () => {
    setIsPaused(true);
    setIsMagnifying(true);
  };

  const handleMouseMove = (e) => {
    if (!isMagnifying || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensSize = 20;
    const boundedX = Math.max(lensSize / 2, Math.min(x, rect.width - lensSize / 2));
    const boundedY = Math.max(lensSize / 2, Math.min(y, rect.height - lensSize / 2));

    setLensPosition({ x: boundedX, y: boundedY });
  };

  const handleCloseMagnifier = () => {
    setIsMagnifying(false);
    setIsPaused(false);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0 && currentSlide < (product?.looks?.length || 0) - 1) {
        setCurrentSlide(currentSlide + 1);
      } else if (deltaX < 0 && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
    }
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  if (error) return <div>{error}</div>;
  if (!product) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsSizeGuideOpen(false);
      setIsShopLookOpen(false);
    }
  };

  const allSizes = ['S', 'M', 'L'];

  const sizeStockMap = selectedColor
    ? product.colors
        .find((color) => color.color.name === selectedColor)
        ?.sizes.reduce((acc, size) => {
          acc[size.size.name] = size.stock;
          return acc;
        }, {}) || {}
    : {};

  const discountedPrice = product.discount
    ? product.price - (product.price * (product.discount / 100))
    : product.price;

  const tableHeaders = ['REF', 'MEDIDAS (CM)', 'S', 'M', 'L'];
  const tableData = [
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
  ];

  const getColorBackground = (colorName) => {
    switch (colorName.toUpperCase()) {
      case 'BLANCO':
        return '#FFFFFF';
      case 'NEGRO':
        return '#232323';
      default:
        return '#000000';
    }
  };

  return (
    <div className="h-[1022px] flex justify-center items-center">
      <div className="h-[800px] max-w-[1232px] flex justify-between flex-col md:flex-row">
        <div className="w-auto md:w-[519px] h-[600px] relative flex flex-col items-center">
          {images.length > 0 && (
            <div
              className="relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleCloseMagnifier}
            >
              <Image
                ref={imageRef}
                src={images[currentImageIndex] || '/rotate1.svg'}
                alt={`Product image ${currentImageIndex + 1}`}
                width={545}
                height={800}
                className="object-contain h-[535px] md-[800px]"
                priority
              />
              {isMagnifying && (
                <div
                  className="absolute rounded-md shadow-lg bg-white bg-opacity-10"
                  style={{
                    width: '120px',
                    height: '120px',
                    top: `${lensPosition.y - 60 - 20}px`,
                    left: `${lensPosition.x - 60}px`,
                    backgroundImage: `url(${images[currentImageIndex] || '/rotate1.svg'})`,
                    backgroundSize: `${545 * 2}px ${800 * 2}px`,
                    backgroundPosition: `-${lensPosition.x * 2 - 60}px -${lensPosition.y * 2 - 60}px`,
                    pointerEvents: 'none',
                    zIndex: 20,
                  }}
                />
              )}
            </div>
          )}
          <div className="md:block hidden flex-col items-center mt-4">
            <button
              onClick={handleMagnifyClick}
              className="flex items-center text-white px-4 py-2"
              aria-label="Activate magnifying glass to pause and zoom"
              disabled={isMagnifying}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            {isMagnifying && (
              <button
                onClick={handleCloseMagnifier}
                className="mt-2 text-white px-4 py-2 transition"
                aria-label="Close magnifying glass"
              >
                <Image src="/XMenuIcon.svg" width={24} height={24} alt="close lupa" />
              </button>
            )}
          </div>
          <div className="absolute top-[-10px] md:top-[20px] left-[40px] md:left-[-10px] w-[140px] md:w-[200px] text-white z-10 font-normal text-[12px] tracking-[-0.04em] align-middle pl-[1px]">
            <div className="w-[190px] md:w-[200px] h-[60px] flex flex-row items-end overflow-hidden mb-[20px]">
              {Array.from({ length: 40 }, (_, index) => {
                const maxHeightOptions = [5, 10, 15, 30];
                const maxHeight = maxHeightOptions[Math.floor(Math.random() * maxHeightOptions.length)];
                const animationClass = `animate-pulseHeight-${maxHeight}`;
                const delay = Math.random() * 2;

                return (
                  <div
                    key={index}
                    className={`bg-white w-[1px] md:w-[2px] mx-[1px] md:mx-[2px] transition-all ${animationClass}`}
                    style={{
                      height: `${Math.floor(Math.random() * maxHeight) + 10}px`,
                      animationDelay: `${delay}s`,
                    }}
                  ></div>
                );
              })}
            </div>
            <style jsx>{`
              @keyframes pulseHeight-5 {
                0% { height: 10px; }
                50% { height: 5px; }
                100% { height: 10px; }
              }
              .animate-pulseHeight-5 {
                animation: pulseHeight-5 2s ease-in-out infinite;
              }
              @keyframes pulseHeight-10 {
                0% { height: 10px; }
                50% { height: 10px; }
                100% { height: 10px; }
              }
              .animate-pulseHeight-10 {
                animation: pulseHeight-10 2s ease-in-out infinite;
              }
              @keyframes pulseHeight-15 {
                0% { height: 10px; }
                50% { height: 15px; }
                100% { height: 10px; }
              }
              .animate-pulseHeight-15 {
                animation: pulseHeight-15 2s ease-in-out infinite;
              }
              @keyframes pulseHeight-30 {
                0% { height: 10px; }
                50% { height: 30px; }
                100% { height: 10px; }
              }
              .animate-pulseHeight-30 {
                animation: pulseHeight-30 2s ease-in-out infinite;
              }
            `}</style>
            <div className="relative">
              <div
                className="absolute top-0 left-0 w-[1px] bg-gradient-to-r from-white to-[#BEBEBE] z-[-1]"
                style={{ height: '100%' }}
              ></div>
              {/*info modelo */}
              <div className="pl-[20px]">
                <div className="flex justify-between">
                  <p>Nombre</p> <p className="w-[48px] lowercase">{product.models.name}</p>
                </div>
                <div className="flex justify-between">
                  <p>Altura</p> <p className="w-[48px] lowercase">{product.models.height}</p>
                </div>
                <div className="flex justify-between">
                  <p>Peso</p> <p className="w-[48px] lowercase">{product.models.weight} kg.</p>
                </div>
                <div className="flex justify-between">
                  <p>Talle</p> <p className="w-[48px] lowercase">{product.models.size.name}</p>
                </div>
                <div className="flex justify-between">
                  <p>Piel</p> <p className="w-[48px] lowercase">{product.models.skin}</p>
                </div>
                <div className="flex justify-between">
                  <p>Género</p> <p className="w-[48px] lowercase">{product.models.gender}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-[#FCFDFD] w-auto md:w-[519px] flex flex-col">
          <div className="flex items-center justify-center md:justify-start">
            <p className="h-[40px] w-[90%] md:w-[100%] px-4 border uppercase flex items-center">
              {product.displayName || 'Camisa Oversize'}
            </p>
          </div>
          <div className='flex flex-row md:flex-col justify-center'>
            <div className="h-[120px] md:h-[174px] w-[45%] md:w-full flex justify-evenly flex-col">
              <div className="flex items-center">
                <div className="w-[43px] flex justify-center md:w-[60px] h-[25px] md:px-4 gap-[10px] border rounded-[2px] bg-[#FCFDFD] text-[#232323] mr-[10px]">
                  <p className="font-normal text-[16px] tracking-[-0.04em] align-middle">
                    {product.discount || 30}%
                  </p>
                </div>
                <div className="flex items-baseline w-full">
                  <span className="line-through text-gray-400 text-[14px] md:text-[16px] w-auto flex">
                    <p className="uppercase mr-1 w-auto">Ars $</p> {product.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-baseline">
                <p className="uppercase mr-1">Ars $</p>
                <span>{discountedPrice.toFixed(2)}</span>
              </div>
              <div>
                <p>3 cuotas sin interés en bancos seleccionados</p>
              </div>
            </div>
            <div className="h-[213px] flex flex-col justify-around w-[45%] md:w-full">
              <div>
                <p className="uppercase">Color</p>
                <div className="flex w-[50%] md:w-[17%] justify-between mt-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color.color.name)}
                      className="w-[40px] h-[40px] p-1 rounded-[20px] border"
                      style={{
                        backgroundColor: getColorBackground(color.color.name),
                        borderColor: selectedColor === color.color.name ? '#FFFFFF' : 'transparent',
                        borderWidth: selectedColor === color.color.name ? '2px' : '1px',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="uppercase">Size</p>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-white cursor-pointer flex w-full justify-between mt-2"
                >
                  Size guide
                  <Image
                    src="/flechamobilediagonal.svg"
                    width={24}
                    height={24}
                    alt="diagonal arrow"
                    className="ml-2"
                  />
                </button>
                <div>
                  <div className="flex gap-2 mt-2">
                    {allSizes.map((size, index) => {
                      const stock = sizeStockMap[size] || 0;
                      return (
                        <button
                          key={index}
                          className={`w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white ${
                            stock <= 0 ? 'line-through opacity-50' : ''
                          }`}
                          disabled={stock <= 0}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-[90px] md:h-auto flex-col items-center md:flex-row justify-between">
            <p className="w-[315px] pb-[10px] md:w-[344px] h-[40px] gap-2 px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] uppercase text-center">
              + Add to bag
            </p>
            <button
              onClick={() => setIsShopLookOpen(true)}
              className="w-[315px] md:w-[140px] h-[40px] gap-2 px-[20px] py-[6px] border border-white rounded-[2px] bg-[#A8A8A81A] backdrop-blur-[6px] uppercase"
            >
              Shop Look
            </button>
          </div>
          <div className='w-full flex flex-col items-center'>
            <div className="mt-2 w-[80%] md:w-full">
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="w-full text-left flex justify-between h-[30px] items-center uppercase"
              >
                <span>Details</span>
                <Image
                  src={isDetailsOpen ? '/flechamobileup.svg' : '/flechamobiledown.svg'}
                  width={24}
                  height={24}
                  alt={isDetailsOpen ? 'arrow up' : 'arrow down'}
                />
              </button>
              {isDetailsOpen && (
                <div className="font-normal text-[12px] leading-[100%] tracking-[-0.04em] text-justify align-middle">
                  <p>{product.details}</p>
                </div>
              )}
            </div>
            <div className="mt-2 w-[80%] md:w-full">
              <button
                onClick={() => setIsProductCareOpen(!isProductCareOpen)}
                className="w-full text-left flex justify-between items-center uppercase h-[30px]"
              >
                <span>Product Care</span>
                <Image
                  src={isProductCareOpen ? '/flechamobileup.svg' : '/flechamobiledown.svg'}
                  width={24}
                  height={24}
                  alt={isProductCareOpen ? 'arrow up' : 'arrow down'}
                />
              </button>
              {isProductCareOpen && (
                <div className="font-normal text-[12px] leading-[100%] tracking-[-0.04em] text-justify align-middle">
                  <p>{product.productCare}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isShopLookOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 overflow-y-auto"
          onClick={handleOverlayClick}
        >
          <div className="w-full max-w-[1062px] mx-4 my-8 sm:mx-6 md:mx-8 bg-[#83838366] border-[#f2f2f2] border-[0.5px] rounded-[6px] pt-8 pb-6 px-4 sm:px-6 md:px-10 gap-6 backdrop-blur-[30px] relative min-h-[300px] max-h-[90vh] overflow-y-auto">
            <div className="w-full h-[60px] flex justify-center items-center">
              <div className="w-full max-w-[950px] h-[32px] flex justify-between items-center px-4">
                <h2 className="font-medium text-sm sm:text-base md:text-[14px] leading-tight tracking-[0.1em] uppercase text-[#f2f2f2]">
                  SHOP ALL THE LOOK
                </h2>
                <button
                  onClick={() => setIsShopLookOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Image
                    src="/crossSize.svg"
                    width={16}
                    height={16}
                    alt="close modal"
                    className="ml-2"
                  />
                </button>
              </div>
            </div>
            <div className="flex w-full justify-center items-center">
              <div className="w-full flex flex-col items-center justify-between gap-6">
                {product.looks && product.looks.length > 0 ? (
                  <>
                    <div className="w-full sm:hidden relative overflow-hidden">
                      <div
                        ref={sliderRef}
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      >
                        {product.looks.map((look, index) => {
                          const discountedPrice = look.discount
                            ? look.price - (look.price * (look.discount / 100))
                            : look.price;
                          const lookSizes = look.colors.flatMap((c) => c.sizes);

                          return (
                            <div
                              key={index}
                              className="w-full flex-shrink-0 flex flex-col items-center justify-between p-4"
                            >
                              <Image
                                src={`/${look.image}.png`}
                                alt={look.displayName}
                                width={200}
                                height={250}
                                className="object-cover w-full max-w-[200px] h-auto"
                              />
                              <p className="text-white text-xs uppercase mt-2 text-center">
                                {look.displayName}
                              </p>
                              <p className="text-white text-xs text-center">
                                ARS ${discountedPrice.toFixed(2)}
                                {look.discount > 0 && (
                                  <span className="line-through text-gray-400 ml-2">
                                    ${look.price.toFixed(2)}
                                  </span>
                                )}
                              </p>
                              <div className="flex space-x-2 mt-2">
                                {['S', 'M', 'L'].map((size, sizeIndex) => {
                                  const sizeData = lookSizes.find((s) => s.size === size);
                                  const stock = sizeData ? sizeData.stock : 0;
                                  return (
                                    <button
                                      key={sizeIndex}
                                      className={`w-8 h-8 p-2 lowercase border-white border-[0.5px] rounded-[1px] text-white text-xs ${
                                        stock <= 0 ? 'line-through opacity-50' : ''
                                      }`}
                                      disabled={stock <= 0}
                                    >
                                      {size}
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="w-full max-w-[207px] mt-4 h-10 px-4 py-2 gap-2 rounded-[2px] border border-white bg-[#A8A8A81A]">
                                <button className="w-full text-white uppercase text-xs">
                                  + Add
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-center mt-4 space-x-2">
                        {product.looks.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`w-[20px] h-[3px] rounded-[2px] ${
                              currentSlide === index ? 'bg-white' : 'bg-gray-500'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-row flex-wrap justify-center gap-4 w-full">
                      {product.looks.map((look, index) => {
                        const discountedPrice = look.discount
                          ? look.price - (look.price * (look.discount / 100))
                          : look.price;
                        const lookSizes = look.colors.flatMap((c) => c.sizes);

                        return (
                          <div
                            key={index}
                            className="w-[300px] h-auto rounded-[6px] flex flex-col items-center justify-between p-4"
                          >
                            <Image
                              src={`/${look.image}.png`}
                              alt={look.displayName}
                              width={200}
                              height={250}
                              className="object-cover w-full max-w-[200px] h-auto"
                            />
                            <p className="text-white text-sm md:text-[14px] uppercase mt-2 text-center">
                              {look.displayName}
                            </p>
                            <p className="text-white text-sm md:text-[14px] text-center">
                              ARS ${discountedPrice.toFixed(2)}
                              {look.discount > 0 && (
                                <span className="line-through text-gray-400 ml-2">
                                  ${look.price.toFixed(2)}
                                </span>
                              )}
                            </p>
                            <div className="flex space-x-2 mt-2">
                              {['S', 'M', 'L'].map((size, sizeIndex) => {
                                const sizeData = lookSizes.find((s) => s.size === size);
                                const stock = sizeData ? sizeData.stock : 0;
                                return (
                                  <button
                                    key={sizeIndex}
                                    className={`w-10 h-10 p-2 lowercase border-white border-[0.5px] rounded-[1px] text-white text-sm ${
                                      stock <= 0 ? 'line-through opacity-50' : ''
                                    }`}
                                    disabled={stock <= 0}
                                  >
                                    {size}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="w-full max-w-[207px] mt-4 h-10 px-4 py-2 gap-2 rounded-[2px] border border-white bg-[#A8A8A81A]">
                              <button className="w-full text-white uppercase text-sm">
                                + Add
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-white text-center">No hay looks disponibles</p>
                )}
                <div className="w-full flex justify-end mt-4">
                  <button className="w-full sm:w-[208px] h-10 px-4 py-2 rounded-[2px] bg-[#0D0D0DE5] backdrop-blur-[6px]">
                    <p className="font-medium text-xs sm:text-sm md:text-[14px] leading-tight tracking-[0.1em] uppercase text-[#F2F2F2]">
                      Finish Adding
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isSizeGuideOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 overflow-y-auto"
    onClick={handleOverlayClick}
  >
    <div className="w-full max-w-[90%] md:max-w-[1062px] min-h-[300px] border-[#f2f2f2] border-[0.5px] bg-[#83838366] rounded-[6px] relative mx-4 sm:mx-6 md:mx-8 p-4 sm:p-6 md:p-10">
      <div className="w-full h-[60px] flex justify-center items-center">
        <div className="w-full max-w-[950px] h-[32px] flex justify-between items-center">
          <h2 className="font-medium text-sm sm:text-base md:text-[14px] leading-tight tracking-[0.1em] uppercase text-[#f2f2f2]">
            Size Guide
          </h2>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Image
              src="/crossSize.svg"
              width={16}
              height={16}
              alt="close modal"
              className="ml-2"
            />
          </button>
        </div>
      </div>
      <div className="w-full flex justify-center items-center mt-4">
        <div className="w-full max-w-[1002px] flex flex-col md:flex-row h-auto md:h-[356px]">
          <div
            className="w-full md:w-[40%] h-[400px] md:h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/sizeguidepantalon.svg')" }}
          ></div>
          <div className="w-full md:w-[60%] h-[300px] md:h-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-white">
                  {tableHeaders.map((header, index) => (
                    <th
                      key={index}
                      className="px-2 py-1 sm:px-4 sm:py-2 font-medium text-xs sm:text-[14px] leading-[14px] tracking-[0.1em] uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="text-white">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-2 py-1 sm:px-4 sm:py-2 font-normal text-xs sm:text-[14px] leading-[14px] tracking-[0.1em] uppercase"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Product;