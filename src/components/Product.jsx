"use client"; // Added to make the component a client component
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { useCart } from "./context/CartContext";
import Marquee from "./Marquee";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProductCareOpen, setIsProductCareOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isShopLookOpen, setIsShopLookOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLookColors, setSelectedLookColors] = useState({});
  const [selectedLookSizes, setSelectedLookSizes] = useState({});
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const sliderRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const { addToCart } = useCart();
  const [lookAddCounts, setLookAddCounts] = useState({});
  const [addCount, setAddCount] = useState(0);
  const lensWidth = 120;
  const lensHeight = 120;
  const zoomFactor = 2;

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://eeva-api.vercel.app/api/v1/products/${id}`
        );
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);

        // Configurar imágenes
        if (fetchedProduct.models?.images?.gif360) {
          setImages([
            `/360/${fetchedProduct.models.images.gif360}-1.webp`,
            `/360/${fetchedProduct.models.images.gif360}-2.webp`,
            `/360/${fetchedProduct.models.images.gif360}-3.webp`,
            `/360/${fetchedProduct.models.images.gif360}-4.webp`,
            `/360/${fetchedProduct.models.images.gif360}-5.webp`,
            `/360/${fetchedProduct.models.images.gif360}-6.webp`,
            `/360/${fetchedProduct.models.images.gif360}-7.webp`,
            `/360/${fetchedProduct.models.images.gif360}-8.webp`,
          ]);
        } else {
          setImages([
            "/rotate1.svg",
            "/rotate2.svg",
            "/rotate3.svg",
            "/rotate4.svg",
            "/rotate5.svg",
          ]);
        }

        // Inicializar color y talle con stock disponible para el producto principal
        if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
          const firstAvailableColor = fetchedProduct.colors.find(color =>
            color.sizes.some(size => size.stock > 0)
          );
          if (firstAvailableColor) {
            setSelectedColor(firstAvailableColor.color.name);
            const firstAvailableSize = firstAvailableColor.sizes.find(
              size => size.stock > 0
            );
            setSelectedSize(firstAvailableSize ? firstAvailableSize.size.name : null);
          } else {
            setSelectedColor(fetchedProduct.colors[0].color.name);
            setSelectedSize(null);
          }
        }

        // Inicializar colores y talles de los looks
        if (fetchedProduct.looks && fetchedProduct.looks.length > 0) {
          const initialLookColors = {};
          const initialLookSizes = {};
          fetchedProduct.looks.forEach((look, index) => {
            if (look.colors && look.colors.length > 0) {
              const lookId = look._id || index;
              const firstAvailableColor = look.colors.find(color =>
                color.sizes.some(size => size.stock > 0)
              );
              initialLookColors[lookId] = firstAvailableColor
                ? firstAvailableColor.color.name
                : look.colors[0].color.name;
              const selectedColor = firstAvailableColor || look.colors[0];
              const firstAvailableSize = selectedColor.sizes.find(
                size => size.stock > 0
              );
              initialLookSizes[lookId] = firstAvailableSize
                ? firstAvailableSize.size.name
                : null;
            }
          });
          setSelectedLookColors(initialLookColors);
          setSelectedLookSizes(initialLookSizes);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Error al cargar el producto. Por favor, intenta de nuevo.");
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product || !selectedColor) return;

    const selectedColorData = product.colors.find(
      color => color.color.name === selectedColor
    );
    if (selectedColorData) {
      const availableSize = selectedColorData.sizes.find(size => size.stock > 0);
      setSelectedSize(availableSize ? availableSize.size.name : null);
    } else {
      setSelectedSize(null);
    }
  }, [selectedColor, product]);

  useEffect(() => {
    if (!product || !product.looks) return;

    setSelectedLookSizes(prevSizes => {
      const updatedSizes = { ...prevSizes };
      product.looks.forEach((look, index) => {
        const lookId = look._id || index;
        const selectedColor = selectedLookColors[lookId];
        if (selectedColor) {
          const selectedColorData = look.colors.find(
            color => color.color.name === selectedColor
          );
          if (selectedColorData) {
            const availableSize = selectedColorData.sizes.find(size => size.stock > 0);
            updatedSizes[lookId] = availableSize ? availableSize.size.name : null;
          } else {
            updatedSizes[lookId] = null;
          }
        }
      });
      return updatedSizes;
    });
  }, [selectedLookColors, product]);

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
    const imageWidth = rect.width;
    const imageHeight = rect.height;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const halfLensWidth = lensWidth / 2;
    const halfLensHeight = lensHeight / 2;

    const boundedX = Math.max(halfLensWidth, Math.min(x, imageWidth - halfLensWidth));
    const boundedY = Math.max(halfLensHeight, Math.min(y, imageHeight - halfLensHeight));

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

  const handleLookColorChange = (lookId, colorName) => {
    setSelectedLookColors((prev) => ({
      ...prev,
      [lookId]: colorName,
    }));
  };

  const handleSizeSelect = (size) => {
    const stock = sizeStockMap[size] || 0;
    if (stock > 0) {
      setSelectedSize(size);
    }
  };

  const handleLookSizeSelect = (lookId, size, lookSizeStockMap) => {
    const stock = lookSizeStockMap[size] || 0;
    if (stock > 0) {
      setSelectedLookSizes((prev) => ({
        ...prev,
        [lookId]: size,
      }));
    }
  };

  const handleAddLookToCart = (look, lookId) => {
    const selectedColor = selectedLookColors[lookId];
    const selectedSize = selectedLookSizes[lookId];
    if (!selectedColor || !selectedSize) {
      alert("Por favor selecciona color y talla para el look");
      return;
    }
    const lookSizeStockMap = getLookSizeStockMap(look, selectedColor);
    const stock = lookSizeStockMap[selectedSize] || 0;
    if (stock <= 0) {
      alert("El talle seleccionado no tiene stock");
      return;
    }

    console.log("Producto seleccionado en Shop Look:", {
      lookId: look._id || lookId,
      displayName: look.displayName,
      selectedColor,
      selectedSize,
      stock,
      price: look.discount
        ? look.price - look.price * (look.discount / 100)
        : look.price,
      image: `/${look.image}.webp`,
    });

    const lookImages = [`/${look.image}.webp`];
    addToCart(look, selectedColor, selectedSize, lookImages);

    setLookAddCounts((prevCounts) => ({
      ...prevCounts,
      [lookId]: (prevCounts[lookId] || 0) + 1,
    }));
  };

  const handleFinishAdding = () => {
    console.log("Todos los looks seleccionados:", {
      selectedLookColors,
      selectedLookSizes,
      looks: product.looks.map((look, index) => {
        const lookId = look._id || index;
        const selectedColor = selectedLookColors[lookId];
        const selectedSize = selectedLookSizes[lookId];
        const lookSizeStockMap = getLookSizeStockMap(look, selectedColor);
        return {
          lookId: look._id || lookId,
          displayName: look.displayName,
          selectedColor,
          selectedSize,
          stock: selectedSize ? lookSizeStockMap[selectedSize] || 0 : "N/A",
        };
      }),
    });
    setIsShopLookOpen(false);
  };

  if (error) return <div>{error}</div>;
  if (!product) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsSizeGuideOpen(false);
      setIsShopLookOpen(false);
    }
  };

  const allSizes = ["S", "M", "L"];

  const sizeStockMap = selectedColor
    ? product.colors
      .find((color) => color.color.name === selectedColor)
      ?.sizes.reduce((acc, size) => {
        acc[size.size.name] = size.stock;
        return acc;
      }, {}) || {}
    : {};

  const discountedPrice = product.discount
    ? product.price - product.price * (product.discount / 100)
    : product.price;

  const getLookSizeStockMap = (look, selectedColor) => {
    return selectedColor
      ? look.colors
        .find((color) => color.color.name === selectedColor)
        ?.sizes.reduce((acc, size) => {
          acc[size.size.name] = size.stock;
          return acc;
        }, {}) || {}
      : {};
  };

  const tableHeaders = ["REF", "MEDIDAS (CM)", "S", "M", "L"];
  const tableData = [
    ["A", "TOTAL LENGTH", "108", "109", "114"],
    ["A", "TOTAL LENGTH", "108", "109", "114"],
    ["A", "TOTAL LENGTH", "108", "109", "114"],
    ["A", "TOTAL LENGTH", "108", "109", "114"],
    ["A", "TOTAL LENGTH", "108", "109", "114"],
    ["A", "TOTAL LENGTH", "108", "109", "114"],
    ["A", "TOTAL LENGTH", "108", "109", "114"],
    ["A", "TOTAL LENGTH", "108", "109", "114"],
    ["A", "TOTAL LENGTH", "108", "109", "114"],
    ["A", "TOTAL LENGTH", "108", "109", "114"],
  ];

  const getColorBackground = (colorName) => {
    switch (colorName.toUpperCase()) {
      case "BLANCO":
        return "#FFFFFF";
      case "NEGRO":
        return "#232323";
      default:
        return "#000000";
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedColor || !selectedSize) {
      alert("Por favor selecciona color y talla");
      return;
    }
    const stock = sizeStockMap[selectedSize] || 0;
    if (stock <= 0) {
      alert("El talle seleccionado no tiene stock");
      return;
    }
    addToCart(product, selectedColor, selectedSize, images);
    setAddCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="min-h-screen w-full flex flex-col pt-[90px]">
      <div className="max-w-[1252px] mx-auto flex flex-col md:flex-row py-8">
        <div className="w-auto md:w-[940px] md:items-end h-[600px] relative flex flex-col items-center">
          {images.length > 0 && (
            <div
              className="relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleCloseMagnifier}
            >
              <Image
                ref={imageRef}
                src={images[currentImageIndex] || "/rotate1.svg"}
                alt={`Product image ${currentImageIndex + 1}`}
                width={545}
                height={900}
                className="object-contain h-[535px] md:w-[550px] md:h-[650px]"
                priority
                onLoad={(e) => {
                  const img = e.target;
                  console.log("Image dimensions:", img.naturalWidth, img.naturalHeight);
                }}
              />
              {isMagnifying && (
                <div
                  className="absolute rounded-md shadow-lg bg-white bg-opacity-10"
                  style={{
                    width: `${lensWidth}px`,
                    height: `${lensHeight}px`,
                    top: `${lensPosition.y - lensHeight / 2}px`,
                    left: `${lensPosition.x - lensWidth / 2}px`,
                    backgroundImage: `url(${images[currentImageIndex] || "/rotate1.svg"})`,
                    backgroundSize: `${imageRef.current?.getBoundingClientRect().width * zoomFactor}px ${imageRef.current?.getBoundingClientRect().height * zoomFactor}px`,
                    backgroundPosition: `-${(lensPosition.x - lensWidth / 2) * zoomFactor}px -${(lensPosition.y - lensHeight / 2) * zoomFactor}px`,
                    backgroundRepeat: "no-repeat",
                    pointerEvents: "none",
                    zIndex: 20,
                  }}
                />
              )}
            </div>
          )}
          <div className="md:block hidden absolute bottom-[-35px] flex-col items-center mt-4">
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
          </div>
          <div className="absolute top-[-10px] md:top-[20px] left-[40px] md:left-[-10px] xl:left-[250px] w-[140px] md:w-[200px] text-white z-10 font-normal text-[12px] tracking-[-0.04em] align-middle pl-[1px]">
            <div className="w-[190px] md:w-[170px] h-[60px] flex flex-row items-end overflow-hidden mb-[20px]">
              {Array.from({ length: 40 }, (_, index) => {
                const maxHeightOptions = [5, 10, 15, 30];
                const maxHeight =
                  maxHeightOptions[
                    Math.floor(Math.random() * maxHeightOptions.length)
                  ];
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
                style={{ height: "100%" }}
              ></div>
              <div className="pl-[20px]">
                <div className="flex justify-between">
                  <p>Nombre</p>{" "}
                  <p className="w-[48px] lowercase">{product.models.name}</p>
                </div>
                <div className="flex justify-between">
                  <p>Altura</p>{" "}
                  <p className="w-[48px] lowercase">{product.models.height}</p>
                </div>
                <div className="flex justify-between">
                  <p>Peso</p>{" "}
                  <p className="w-[48px] lowercase">
                    {product.models.weight} kg.
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Talle</p>{" "}
                  <p className="w-[48px] lowercase">
                    {product.models.size.name}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Género</p>{" "}
                  <p className="w-[48px] lowercase">{product.models.gender}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-[#FCFDFD] w-auto md:w-[551px] h-auto flex flex-col">
          <div className="flex items-center justify-center md:justify-start">
            <p className="h-[40px] w-[90%] md:w-[100%] px-4 border uppercase flex items-center">
              {product.displayName || "Camisa Oversize"}
            </p>
          </div>
          <div className="flex flex-row md:flex-col justify-around md:justify-center">
            <div className="h-auto md:h-[140px] w-[35%] md:w-full flex justify-evenly flex-col">
              {product.discount > 0 && (
                <div className="flex items-center">
                  <div className="w-[43px] flex justify-center md:w-[60px] h-[25px] md:px-4 gap-[10px] border rounded-[2px] bg-[#FCFDFD] text-[#232323] mr-[10px]">
                    <p className="font-normal text-[16px] tracking-[-0.04em] align-middle">
                      {product.discount}%
                    </p>
                  </div>
                  <div className="flex items-baseline w-full">
                    <span className="line-through text-gray-400 text-[14px] md:text-[16px] w-auto flex">
                      <p className="uppercase mr-1 w-auto">Ars $</p>{" "}
                      {product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
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
                <div className="flex w-[50%] md:w-[19%] justify-between mt-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color.color.name)}
                      className="w-[40px] h-[40px] p-1 rounded-[20px] border"
                      style={{
                        borderColor:
                          selectedColor === color.color.name
                            ? "#FFFFFF"
                            : "transparent",
                        borderWidth:
                          selectedColor === color.color.name ? "0.5px" : "1px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: getColorBackground(color.color.name),
                          borderRadius: "18px",
                          padding:
                            selectedColor === color.color.name ? "2px" : "0",
                        }}
                      />
                    </button>
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
                          onClick={() => handleSizeSelect(size)}
                          className={`w-[40px] transition-all duration-200 hover:bg-[#A8A8A84D] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white ${
                            stock <= 0 ? "line-through opacity-50" : ""
                          } ${selectedSize === size ? "bg-[#E7E7E766]" : ""}`}
                          disabled={stock <= 0}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {Object.values(sizeStockMap).every((stock) => stock <= 0) && (
                    <p className="text-white text-sm mt-2">
                      No hay stock disponible
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex min-h-[90px] md:h-auto flex-col items-center md:flex-row justify-between gap-4">
            <button
              onClick={handleAddToCart}
              className="w-full max-w-[280px] md:w-[300px] h-[40px] gap-2 px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] transition-all duration-200 hover:bg-[#2C2C2CE5] uppercase text-center"
            >
              {addCount > 0 ? `(${addCount}) Added` : '+ Add to Bag'}
            </button>
            <button
              onClick={() => setIsShopLookOpen(true)}
              className="w-full max-w-[280px] md:w-[140px] h-[40px] gap-2 px-[20px] py-[6px] border border-white rounded-[2px] bg-[#A8A8A81A] backdrop-blur-[6px] uppercase transition-all duration-200 hover:bg-[#A8A8A84D]"
            >
              Shop Look
            </button>
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="mt-2 w-[80%] md:w-full z-10 relative">
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="w-full text-left flex justify-between h-[30px] items-center uppercase"
              >
                <span>Details</span>
                <Image
                  src={
                    isDetailsOpen
                      ? "/flechamobileup.svg"
                      : "/flechamobiledown.svg"
                  }
                  width={24}
                  height={24}
                  alt={isDetailsOpen ? "arrow up" : "arrow down"}
                />
              </button>
              {isDetailsOpen && (
                <div className="p-4 z-10 relative">
                  <p className="font-normal text-[12px] leading-[170%] tracking-[-4%] text-justify align-middle">
                    {product.details}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-2 w-[80%] md:w-full z-10 relative">
              <button
                onClick={() => setIsProductCareOpen(!isProductCareOpen)}
                className="w-full text-left flex justify-between items-center uppercase h-[30px]"
              >
                <span>Product Care</span>
                <Image
                  src={
                    isProductCareOpen
                      ? "/flechamobileup.svg"
                      : "/flechamobiledown.svg"
                  }
                  width={24}
                  height={24}
                  alt={isProductCareOpen ? "arrow up" : "arrow down"}
                />
              </button>
              {isProductCareOpen && (
                <div className="p-4 z-10 relative">
                  {product.productCare.split('\n').map((line, index) => (
                    <p key={index} className="text-white font-normal text-[12px] leading-[170%] tracking-[-4%] text-justify align-middle">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-8 z-0">
        <Marquee />
      </div>
      {isShopLookOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 overflow-y-auto"
          onClick={handleOverlayClick}
        >
          <div className="w-full max-w-[1062px] mx-4 my-8 sm:mx-6 md:mx-8 bg-[#83838366] border-[#f2f2f2] border-[0.5px] rounded-[6px] pt-8 pb-6 px-4 sm:px-6 md:px-10 gap-6 backdrop-blur-[30px] relative min-h-[300px] max-h-[90vh] overflow-y-auto">
            <div className="w-full h-[30px] md:h-[60px] flex justify-center items-center">
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
                        style={{
                          transform: `translateX(-${currentSlide * 100}%)`,
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      >
                        {product.looks.map((look, index) => {
                          const discountedPrice = look.discount
                            ? look.price - look.price * (look.discount / 100)
                            : look.price;
                          const lookId = look._id || index;
                          const selectedLookColor = selectedLookColors[lookId];
                          const selectedLookSize = selectedLookSizes[lookId];
                          const lookSizeStockMap = getLookSizeStockMap(
                            look,
                            selectedLookColor
                          );

                          return (
                            <div
                              key={index}
                              className="w-full flex-shrink-0 flex flex-col items-center justify-between p-4"
                            >
                              {/* <Image
                                src={`/products/${look.image}.webp`}
                                alt={look.displayName}
                                width={200}
                                height={250}
                                className="object-cover w-full max-w-[200px] h-[200px]"
                              /> */}
                              <div className="w-[284px] h-[200px] relative">
                                                    <Image
                                                       src={`/products/${look.image}.webp`}
                                                       alt={look.displayName}
                                                      fill
                                                      className="object-contain"
                                                    />
                                                  </div>
                              <p className="text-white text-xs uppercase mt-2 text-center">
                                {look.displayName}
                              </p>
                              {look.discount > 0 && (
                                <div className="flex items-center justify-center mt-1">
                                  <div className="w-[43px] flex justify-center h-[25px] px-2 gap-[10px] border rounded-[2px] bg-[#FCFDFD] text-[#232323]">
                                    <p className="font-normal text-[12px] tracking-[-0.04em] align-middle">
                                      {look.discount}%
                                    </p>
                                  </div>
                                  <span className="line-through text-gray-400 text-[12px] ml-2">
                                    <span className="uppercase">Ars $</span>{" "}
                                    {look.price.toFixed(2)}
                                  </span>
                                </div>
                              )}
                              <p className="text-white text-xs text-center mt-1">
                                <span className="uppercase">Ars $</span>{" "}
                                {discountedPrice.toFixed(2)}
                              </p>
                              <div>
                                <div className="flex w-full md:w-[50%] justify-center gap-2 mt-1">
                                  {look.colors.map((color, colorIndex) => (
                                    <button
                                      key={colorIndex}
                                      onClick={() =>
                                        handleLookColorChange(
                                          lookId,
                                          color.color.name
                                        )
                                      }
                                      className="w-[40px] h-[40px] p-1 rounded-[20px] border"
                                      style={{
                                        borderColor:
                                          selectedLookColor === color.color.name
                                            ? "#FFFFFF"
                                            : "transparent",
                                        borderWidth:
                                          selectedLookColor === color.color.name
                                            ? "0.5px"
                                            : "1px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          backgroundColor: getColorBackground(
                                            color.color.name
                                          ),
                                          borderRadius: "18px",
                                          padding:
                                            selectedLookColor ===
                                            color.color.name
                                              ? "2px"
                                              : "0",
                                        }}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-col items-center mt-2">
                                <div className="flex gap-2 mt-1">
                                  {allSizes.map((size, sizeIndex) => {
                                    const stock = lookSizeStockMap[size] || 0;
                                    return (
                                      <button
                                        key={sizeIndex}
                                        onClick={() =>
                                          handleLookSizeSelect(
                                            lookId,
                                            size,
                                            lookSizeStockMap
                                          )
                                        }
                                        className={`w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white text-xs transition-all duration-200 hover:bg-[#A8A8A84D] ${
                                          stock <= 0
                                            ? "line-through opacity-50"
                                            : ""
                                        } ${
                                          selectedLookSize === size
                                            ? "bg-[#E7E7E766]"
                                            : ""
                                        }`}
                                        disabled={stock <= 0}
                                      >
                                        {size}
                                      </button>
                                    );
                                  })}
                                </div>
                                {Object.values(lookSizeStockMap).every(
                                  (stock) => stock <= 0
                                ) && (
                                  <p className="text-white text-xs mt-2">
                                    No hay stock disponible
                                  </p>
                                )}
                              </div>
                              <div className="w-full max-w-[207px] mt-4 h-10 px-4 py-2 gap-2 rounded-[2px] border border-white bg-[#A8A8A81A] hover:bg-[#A8A8A84D]">
                                <button
                                  onClick={() => handleAddLookToCart(look, lookId)}
                                  className="w-full text-white uppercase text-xs"
                                >
                                  {lookAddCounts[lookId] > 0
                                    ? `(${lookAddCounts[lookId]}) Added`
                                    : '+ Add'}
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
                              currentSlide === index ? "bg-white" : "bg-gray-500"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-row flex-wrap justify-center gap-4 w-full">
                      {product.looks.map((look, index) => {
                        const discountedPrice = look.discount
                          ? look.price - look.price * (look.discount / 100)
                          : look.price;
                        const lookId = look._id || index;
                        const selectedLookColor = selectedLookColors[lookId];
                        const selectedLookSize = selectedLookSizes[lookId];
                        const lookSizeStockMap = getLookSizeStockMap(
                          look,
                          selectedLookColor
                        );

                        return (
                          <div
                            key={index}
                            className="w-[300px] h-auto rounded-[6px] flex flex-col items-center justify-between p-4"
                          >
                             <div className="w-[284px] h-[200px] relative">
                                                    <Image
                                                       src={`/products/${look.image}.webp`}
                                                       alt={look.displayName}
                                                      fill
                                                      className="object-contain"
                                                    />
                                                  </div>
                            <p className="text-white text-sm md:text-[14px] uppercase mt-2 text-center">
                              {look.displayName}
                            </p>
                            {look.discount > 0 && (
                              <div className="flex items-center justify-center mt-1">
                                <div className="w-[43px] flex justify-center h-[25px] px-2 gap-[10px] border rounded-[2px] bg-[#FCFDFD] text-[#232323]">
                                  <p className="font-normal text-[12px] tracking-[-0.04em] align-middle">
                                    {look.discount}%
                                  </p>
                                </div>
                                <span className="line-through text-gray-400 text-[12px] md:text-[14px] ml-2">
                                  <span className="uppercase">Ars $</span>{" "}
                                  {look.price.toFixed(2)}
                                </span>
                              </div>
                            )}
                            <p className="text-white text-sm md:text-[14px] text-center mt-1">
                              <span className="uppercase">Ars $</span>{" "}
                              {discountedPrice.toFixed(2)}
                            </p>
                            <div>
                              <div className="flex w-[100%] justify-center gap-2 mt-1">
                                {look.colors.map((color, colorIndex) => (
                                  <button
                                    key={colorIndex}
                                    onClick={() =>
                                      handleLookColorChange(
                                        lookId,
                                        color.color.name
                                      )
                                    }
                                    className="w-[40px] h-[40px] p-1 rounded-[20px] border"
                                    style={{
                                      borderColor:
                                        selectedLookColor === color.color.name
                                          ? "#FFFFFF"
                                          : "transparent",
                                      borderWidth:
                                        selectedLookColor === color.color.name
                                          ? "0.5px"
                                          : "1px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: getColorBackground(
                                          color.color.name
                                        ),
                                        borderRadius: "18px",
                                        padding:
                                          selectedLookColor === color.color.name
                                            ? "2px"
                                            : "0",
                                      }}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col items-center mt-2">
                              <div className="flex gap-2 mt-1">
                                {allSizes.map((size, sizeIndex) => {
                                  const stock = lookSizeStockMap[size] || 0;
                                  return (
                                    <button
                                      key={sizeIndex}
                                      onClick={() =>
                                        handleLookSizeSelect(
                                          lookId,
                                          size,
                                          lookSizeStockMap
                                        )
                                      }
                                      className={`w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white text-sm transition-all duration-200 hover:bg-[#A8A8A84D] ${
                                        stock <= 0
                                          ? "line-through opacity-50"
                                          : ""
                                      } ${
                                        selectedLookSize === size
                                          ? "bg-[#E7E7E766]"
                                          : ""
                                      }`}
                                      disabled={stock <= 0}
                                    >
                                      {size}
                                    </button>
                                  );
                                })}
                              </div>
                              {Object.values(lookSizeStockMap).every(
                                (stock) => stock <= 0
                              ) && (
                                <p className="text-white text-sm mt-2">
                                  No hay stock disponible
                                </p>
                              )}
                            </div>
                            <div className="w-full max-w-[207px] mt-4 h-10 px-4 py-2 gap-2 rounded-[2px] border border-white bg-[#A8A8A81A] hover:bg-[#A8A8A84D]">
                              <button
                                onClick={() => handleAddLookToCart(look, lookId)}
                                className="w-full text-white uppercase text-sm"
                              >
                                {lookAddCounts[lookId] > 0
                                  ? `(${lookAddCounts[lookId]}) Added`
                                  : '+ Add'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-white text-center">
                    No hay looks disponibles
                  </p>
                )}
                <div className="w-full flex justify-end mt-4">
                  <button
                    onClick={handleFinishAdding}
                    className="w-full sm:w-[208px] h-10 px-4 py-2 rounded-[2px] bg-[#0D0D0DE5] hover:bg-[#2C2C2CE5] backdrop-blur-[6px]"
                  >
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
          className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 overflow-y-auto"
          onClick={handleOverlayClick}
        >
          <div className="w-full max-w-[90%] md:max-w-[1062px] h-[585px] md:h-[500px] border-[#f2f2f2] border-[0.5px] bg-[#83838366] rounded-[6px] relative mx-4 sm:mx-6 md:mx-8 p-4 sm:p-6 md:p-10">
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
                  className="w-full md:w-[40%] h-[300px] md:h-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: "url('/sizeguantes.png')" }}
                ></div>
                <div
                  className="w-full md:w-auto h-auto md:h-full bg-cover bg-center bg-no-repeat"
                >
                  <Image
                    src={'/tablafinal.png'}
                    width={350}
                    height={150}
                    alt="img"
                    className="md:w-[950px] md:h-[340px]"
                  />
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