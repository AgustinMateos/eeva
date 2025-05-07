'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProductCareOpen, setIsProductCareOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isShopLookOpen, setIsShopLookOpen] = useState(false);

  // Magnifier states
  const [images, setImages] = useState([]); // Array of image paths
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // Fetch product data and set images
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://eeva-api.vercel.app/api/v1/products/${id}`);
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);
        setLoading(false);

        // Set images from static field with numbered suffixes
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
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Ciclar imágenes para el efecto de rotación
  useEffect(() => {
    if (isPaused || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 700); // Cambiar cada 700ms

    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  // Manejar clic en la lupa
  const handleMagnifyClick = () => {
    setIsPaused(true);
    setIsMagnifying(true);
  };

  // Manejar movimiento del ratón para la lupa
  const handleMouseMove = (e) => {
    if (!isMagnifying || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const imageWidth = 545; // Ancho original de la imagen
    const imageHeight = 800; // Alto original de la imagen
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensSize = 20; // Tamaño de la lupa
    const boundedX = Math.max(lensSize / 2, Math.min(x, rect.width - lensSize / 2));
    const boundedY = Math.max(lensSize / 2, Math.min(y, rect.height - lensSize / 2));

    setLensPosition({ x: boundedX, y: boundedY });
  };

  // Cerrar la lupa
  const handleCloseMagnifier = () => {
    setIsMagnifying(false);
    setIsPaused(false);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>No se encontró el producto</div>;

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
        {/* Modelo */}
        <div className="w-[519px] h-[600px] relative flex flex-col items-center">
          {/* Contenedor de la imagen */}
          {images.length > 0 && (
            <div
              className="relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleCloseMagnifier}
            >
              <Image
                ref={imageRef}
                src={images[currentImageIndex] || '/rotate1.svg'} // Fallback si images está vacío
                alt={`Product image ${currentImageIndex + 1}`}
                width={545}
                height={800}
                className="object-contain"
                priority
              />
              {/* Lupa */}
              {isMagnifying && (
                <div
                  className="absolute rounded-md shadow-lg bg-white bg-opacity-10"
                  style={{
                    width: '120px',
                    height: '120px',
                    top: `${lensPosition.y - 60 - 20}px`, // Desplazar 20px arriba
                    left: `${lensPosition.x - 60}px`,
                    backgroundImage: `url(${images[currentImageIndex] || '/rotate1.svg'})`,
                    backgroundSize: `${545 * 2}px ${800 * 2}px`, // Zoom x2 basado en 545x800
                    backgroundPosition: `-${lensPosition.x * 2 - 60}px -${
                      lensPosition.y * 2 - 60
                    }px`,
                    pointerEvents: 'none',
                    zIndex: 20,
                  }}
                />
              )}
            </div>
          )}

          {/* Botones de lupa */}
          <div className="flex flex-col items-center mt-4">
            <button
              onClick={handleMagnifyClick}
              className="flex items-center text-white  px-4 py-2 "
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
                className="mt-2 text-white  px-4 py-2  transition"
                aria-label="Close magnifying glass"
              >
                <Image src="/XMenuIcon.svg" width={24} height={24} alt="close lupa" />
              </button>
            )}
          </div>

          {/* Info modelo */}
          <div className="absolute top-[-10px] md:top-[20px] left-[90px] md:left-[-10px] w-[200px] text-white z-10 font-normal text-[12px] tracking-[-0.04em] align-middle pl-[1px]">
            <div className="w-[200px] h-[60px] flex flex-row items-end overflow-hidden mb-[20px]">
              {Array.from({ length: 40 }, (_, index) => {
                const maxHeightOptions = [5, 10, 15, 30];
                const maxHeight = maxHeightOptions[Math.floor(Math.random() * maxHeightOptions.length)];
                const animationClass = `animate-pulseHeight-${maxHeight}`;
                const delay = Math.random() * 2;

                return (
                  <div
                    key={index}
                    className={`bg-white w-[2px] mx-[2px] transition-all ${animationClass}`}
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

        {/* Detalles del producto */}
        <div className="text-[#FCFDFD] w-[519px] flex flex-col">
          <div className="flex items-center">
            <p className="h-[40px] w-[100%] px-4 border uppercase flex items-center">
              {product.displayName || 'Camisa Oversize'}
            </p>
          </div>
          <div className="h-[120px] flex justify-evenly flex-col">
            <div className="flex items-center">
              <div className="w-[60px] h-[25px] px-4 gap-[10px] border rounded-[2px] bg-[#FCFDFD] text-[#232323] mr-[10px]">
                <p className="font-normal text-[16px] tracking-[-0.04em] align-middle">
                  {product.discount || 30}%
                </p>
              </div>
              <div className="flex items-baseline">
                <p className="uppercase mr-1">Ars $</p>
                <span className="line-through text-gray-400">{product.price.toFixed(2)}</span>
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
          <div className="h-[213px] w-full">
            <div>
              <p className="uppercase">Color</p>
              <div className="flex w-[17%] justify-between mt-2">
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

          {/* Dropdown para Details */}
          <div className="mt-2">
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

          {/* Dropdown para Product Care */}
          <div className="mt-2">
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

      {/* Modal de Shop Look */}
      {isShopLookOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="w-[1062px] h-[655px] border-[#f2f2f2] border-[0.5px] bg-[#83838366] rounded-[6px] pt-[32px] pr-[40px] pb-[32px] pl-[40px] gap-[32px] backdrop-blur-[30px] relative">
            <div className="w-full h-[60px] flex justify-center items-center">
              <div className="w-[950px] h-[32px]">
                <h2 className="font-medium text-[14px] leading-[14px] tracking-[0.1em] uppercase text-[#f2f2f2]">
                  SHOP ALL THE LOOK
                </h2>
                <button
                  onClick={() => setIsShopLookOpen(false)}
                  className="absolute top-[32px] right-[40px] text-gray-500 hover:text-gray-700"
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

            <div className="flex w-full h-[523px] justify-center items-center">
              <div className="h-full w-full flex flex-col items-center justify-between">
                <div className="flex justify-between w-full h-[400px]">
                  {product.looks && product.looks.length > 0 ? (
                    product.looks.map((look, index) => {
                      const discountedPrice = look.discount
                        ? look.price - (look.price * (look.discount / 100))
                        : look.price;
                      const lookSizes = look.colors.flatMap((c) => c.sizes);

                      return (
                        <div
                          key={index}
                          className="w-[300px] h-full rounded-[6px] flex flex-col items-center justify-between p-4"
                        >
                          <Image
                            src={`/${look.image}.png`}
                            alt={look.displayName}
                            width={200}
                            height={250}
                            className="object-cover"
                          />
                          <p className="text-white text-[14px] uppercase mt-2">{look.displayName}</p>
                          <p className="text-white text-[14px]">
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
                          <div className="w-[207px] mt-[20px] h-[40px] px-[20px] py-[6px] gap-2 rounded-[2px] border border-white bg-[#A8A8A81A]">
                            <button className="w-full text-white uppercase">+ Add</button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-white">No hay looks disponibles</p>
                  )}
                </div>

                <div className="w-[889px] flex justify-end">
                  <button className="w-[208px] h-[40px] px-[20px] py-[6px] gap-2 rounded-[2px] bg-[#0D0D0DE5] backdrop-blur-[6px]">
                    <p className="font-medium text-[14px] leading-[14px] tracking-[0.1em] uppercase text-[#F2F2F2]">
                      Finish Adding
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Size Guide */}
      {isSizeGuideOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="w-[1062px] h-[524px] border-[#f2f2f2] border-[0.5px] bg-[#83838366] rounded-[6px] relative">
            <div className="w-full h-[60px] mt-[40px] flex justify-center items-center">
              <div className="w-[950px] h-[32px]">
                <h2 className="font-medium text-[14px] leading-[14px] tracking-[0.1em] uppercase text-[#f2f2f2]">
                  Size Guide
                </h2>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="absolute top-[55px] right-[40px] text-gray-500 hover:text-gray-700"
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

            <div className="flex w-full h-[400px] justify-center items-center">
              <div className="h-[356px] w-[1002px] flex">
                <div
                  className="w-[40%] h-[100%]"
                  style={{
                    backgroundImage: "url('/sizeguidepantalon.svg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                ></div>
                <div className="w-[60%] h-[100%] overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-white">
                        {tableHeaders.map((header, index) => (
                          <th
                            key={index}
                            className="px-4 py-2 font-medium text-[14px] leading-[14px] tracking-[0.1em] uppercase"
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
                              className="px-4 py-2 font-normal text-[14px] leading-[14px] tracking-[0.1em] uppercase"
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