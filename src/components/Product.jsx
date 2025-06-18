'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Axios from 'axios';
import dynamic from 'next/dynamic';

// Dynamically import Footer to reduce initial bundle size
const Footer = dynamic(() => import('./Footer'), { ssr: false });
const Loader = dynamic(() => import('./Loader'), { ssr: false });

const Initiation = ({ initialData }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [products, setProducts] = useState(initialData?.products || []);
  const [description, setDescription] = useState(initialData?.description || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [middleImages, setMiddleImages] = useState(initialData?.middleImages || []);
  const [footerImage, setFooterImage] = useState(initialData?.footerImage || '');
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if no initial data is provided (client-side fallback)
    if (!initialData) {
      const fetchInitiationCollection = async () => {
        try {
          const response = await Axios.get('https://eeva-api.vercel.app/api/v1/collections', {
            headers: { 'Cache-Control': 'public, max-age=3600' }, // Cache for 1 hour
          });
          const initiationCollection = response.data.find(
            (collection) => collection.title.toUpperCase() === 'INITIATION'
          );
          if (initiationCollection) {
            const formattedProducts = initiationCollection.products.map((product) => ({
              id: product._id,
              title: product.displayName || product.name || 'Producto sin título',
              subtitle: product.subtitle,
              image: `/static/${product.models.images.static}.webp`,
              gender: product.gender || 'unknown',
            }));

            const sortedProducts = [];
            const maleProducts = formattedProducts.filter((p) => p.gender.toLowerCase() === 'male');
            const femaleProducts = formattedProducts.filter((p) => p.gender.toLowerCase() === 'female');
            const maxLength = Math.max(maleProducts.length, femaleProducts.length);

            for (let i = 0; i < maxLength; i++) {
              if (i < maleProducts.length) sortedProducts.push(maleProducts[i]);
              if (i < femaleProducts.length) sortedProducts.push(femaleProducts[i]);
            }

            const otherProducts = formattedProducts.filter(
              (p) => p.gender.toLowerCase() !== 'male' && p.gender.toLowerCase() !== 'female'
            );
            sortedProducts.push(...otherProducts);

            setProducts(sortedProducts);
            setDescription(initiationCollection.description || 'Descripción no disponible');
            setTitle(initiationCollection.title || 'Sin título');
            setSubtitle(initiationCollection.subtitle || 'Subtítulo no disponible');
            const formattedMiddleImages = initiationCollection.images.middle.map((image, index) => ({
              id: index + 1,
              image: `/${image}.webp`,
            }));
            setMiddleImages(formattedMiddleImages);
            setFooterImage(
              initiationCollection.images.footer ? `/${initiationCollection.images.footer}.webp` : '/evvaprevfooter.svg'
            );
          } else {
            setError('Colección INITIATION no encontrada');
          }
          setLoading(false);
        } catch (err) {
          setError('Error al obtener la colección');
          setLoading(false);
        }
      };

      fetchInitiationCollection();
    }
  }, [initialData]);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Memoize product cards to prevent unnecessary re-renders
  const productCards = useMemo(() => {
    return products.map((card) => (
      <Link
        key={card.id}
        href={`/collections/initiation/product/${card.id}`}
        className="group w-full h-auto relative flex flex-col"
      >
        <div className="h-[315px] md:h-[589px] xl:h-[549px] 2xl:h-[650px] w-[139px] md:w-[289px]">
          <Image
            src={card.image}
            alt={card.title}
            fill
            priority
            className="object-contain w-full h-auto"
          />
        </div>
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
            SEE PRODUCT
          </span>
        </div>
        <h3 className="text-[#FFFFFF] text-[10px] md:text-[12px] text-center mt-2">{card.title}</h3>
      </Link>
    ));
  }, [products]);

  return (
    <>
      {loading ? (
        <Loader loading={loading} />
      ) : error ? (
        <div className="text-white text-center pt-[150px]">{error}</div>
      ) : (
        <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
          <h1 className="text-white text-4xl font-bold pb-[20px] md:pb-[30px] uppercase">{title}</h1>
          <p className="text-white pl-[15px] pr-[15px] text-[10px] md:text-lg text-center max-w-2xl uppercase">
            {subtitle}
          </p>
          <p className="text-white pl-[15px] pr-[15px] text-[10px] md:text-lg text-center max-w-[1250px] mb-8 uppercase">
            {description}
          </p>

          <div className="relative h-[610px] w-full">
            <video
              ref={videoRef}
              src="/initiation.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster="/initiation-poster.jpg"
              className="w-full h-full object-cover"
            />
            <button
              onClick={toggleSound}
              className="absolute bottom-4 flex justify-center items-center left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded-md text-sm"
            >
              {isMuted ? 'ALLOW SOUND' : 'DENY SOUND'}
              <Image src="/sound.svg" alt="Control de Sonido" width={32} height={32} />
            </button>
          </div>

          <div className="w-full max-w-[90%] mx-auto mt-[60px]">
            {/* Primer grid de tarjetas de productos (primeros 8) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productCards.slice(0, 8)}
            </div>

            {/* Segundo grid con imágenes centradas (slider en móvil) */}
            <div className="mt-[60px] mb-[60px]">
              {/* Mobile slider */}
              <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                {middleImages.map((card) => (
                  <div key={card.id} className="snap-center flex-shrink-0 w-[80%] max-w-[500px] mx-2">
                    <Image
                      src={card.image}
                      alt={`Imagen central ${card.id}`}
                      width={500}
                      height={900}
                      loading="lazy"
                      sizes="(max-width: 768px) 80vw, 500px"
                      className="object-cover w-full h-[400px] md:h-auto"
                    />
                  </div>
                ))}
              </div>
              {/* Mobile text */}
              <div className="md:hidden max-w-[500px] w-full md:max-w-[550px] xl:max-w-[560px] pl-[16px] flex justify-start">
                <p className="text-[#FFFFFF] pt-[20px] text-center text-[12px]">
                  INTENSO | FUERTE | AUDAZ W25
                </p>
              </div>
              {/* Desktop grid */}
              <div className="hidden md:grid md:grid-cols-2 md:gap-6">
                {middleImages.map((card, index) => (
                  <div key={card.id} className="flex flex-col items-center h-auto">
                    <Image
                      src={card.image}
                      alt={`Imagen central ${card.id}`}
                      width={500}
                      height={625}
                      priority
                      className="object-contain w-full max-w-[500px] md:max-w-[550px] xl:max-w-[560px] aspect-[4/5]"
                    />
                    {index === 0 && (
                      <div className="flex max-w-[500px] w-full md:max-w-[550px] xl:max-w-[560px] pl-[16px] justify-start">
                        <p className="text-[#FFFFFF] pt-[20px] text-center">
                          INTENSO | FUERTE | AUDAZ W25
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Segundo grid de tarjetas (resto de productos) */}
            {products.length > 8 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productCards.slice(8)}
              </div>
            )}
          </div>

          {/* Footer image section */}
          {footerImage && (
            <div className="relative h-[410px] md:h-[667px] w-full mt-[40px]">
              <Image
                src={footerImage}
                alt="Fondo Initiation"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute top-[15px] flex flex-col justify-end md:top-[95px] right-0 p-4 text-white mr-[0px] md:mr-[40px]">
                <h5 className="text-sm md:text-lg font-semibold flex justify-end">{title}</h5>
                <div className="text-[8px] text-end md:text-[12px] w-[100%] flex justify-end md:w-[480px]">
                  <p className="w-[221px] md:w-[480px]">
                    Se buscó construir un universo que transmitiera una vision futurista y dramática.
                    Se crea una sensacion de precisión, movimiento y poder generando una atmósfera única.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="w-[90%] h-[315px] md:h-[415px] flex md:min-w-[1315px]">
            <Footer />
          </div>
        </div>
      )}
    </>
  );
};

// Suggested CSS for Loader to cover full screen
// .loader {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   background: rgba(0, 0, 0, 0.5);
//   z-index: 9999;
// }

// Server-side data fetching
export async function getServerSideProps() {
  try {
    const response = await Axios.get('https://eeva-api.vercel.app/api/v1/collections', {
      timeout: 5000, // Timeout de 5 segundos
    });
    const initiationCollection = response.data.find(
      (collection) => collection.title.toUpperCase() === 'INITIATION'
    );

    if (!initiationCollection) {
      return { props: { initialData: null } };
    }

    const formattedProducts = initiationCollection.products.map((product) => ({
      id: product._id,
      title: product.displayName || product.name || 'Producto sin título',
      subtitle: product.subtitle,
      image: `/static/${product.models.images.static}.webp`,
      gender: product.gender || 'unknown',
    }));

    const sortedProducts = [];
    const maleProducts = formattedProducts.filter((p) => p.gender.toLowerCase() === 'male');
    const femaleProducts = formattedProducts.filter((p) => p.gender.toLowerCase() === 'female');
    const maxLength = Math.max(maleProducts.length, femaleProducts.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < maleProducts.length) sortedProducts.push(maleProducts[i]);
      if (i < femaleProducts.length) sortedProducts.push(femaleProducts[i]);
    }

    const otherProducts = formattedProducts.filter(
      (p) => p.gender.toLowerCase() !== 'male' && p.gender.toLowerCase() !== 'female'
    );
    sortedProducts.push(...otherProducts);

    const formattedMiddleImages = initiationCollection.images.middle.map((image, index) => ({
      id: index + 1,
      image: `/${image}.webp`,
    }));

    return {
      props: {
        initialData: {
          products: sortedProducts,
          description: initiationCollection.description || 'Descripción no disponible',
          title: initiationCollection.title || 'Sin título',
          subtitle: initiationCollection.subtitle || 'Subtítulo no disponible',
          middleImages: formattedMiddleImages,
          footerImage: initiationCollection.images.footer
            ? `/${initiationCollection.images.footer}.webp`
            : '/evvaprevfooter.svg',
        },
      },
    };
  } catch (err) {
    console.error('Error in getServerSideProps:', err);
    return { props: { initialData: null } };
  }
}

export default Initiation;

// "use client";

// import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import Image from "next/image";
// import { useCart } from "./context/CartContext";
// import Marquee from "./Marquee";

// // Inline Loader Component
// const Loader = ({ loading }) => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     if (loading) {
//       const interval = setInterval(() => {
//         setProgress((prev) => {
//           if (prev >= 100) return 100;
//           return prev + 1;
//         });
//       }, 20);
//       return () => clearInterval(interval);
//     } else {
//       setProgress(100);
//     }
//   }, [loading]);

//   if (progress >= 100) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 w-full h-full overflow-hidden z-50 bg-gradient-to-r from-[#303F48] to-[#6D7276]">
//       <div
//         className="absolute inset-0 bg-cover bg-center transition-all duration-[20ms] ease-linear"
//         style={{
//           backgroundImage: "url(/lineasCodigo.svg)",
//           clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`,
//         }}
//       ></div>
//       <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
//         <span
//           className="font-medium text-2xl leading-none tracking-[-0.02em] text-center uppercase text-[#F9F9F9]"
//           style={{ fontFamily: "IBM Plex Mono" }}
//         >
//           Initiating SYSTEM
//         </span>
//         <div className="w-[305px] md:w-[405px] h-7 rounded-[2px] border border-[#F2F2F2] p-2 bg-[#FFFFFF1A] overflow-hidden">
//           <div
//             className="h-full bg-[#D9D9D9] transition-all duration-[20ms] ease-linear"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//         <span
//           className="font-light text-lg leading-none tracking-[-0.02em] text-center uppercase text-[#F9F9F9]"
//           style={{ fontFamily: "IBM Plex Mono" }}
//         >
//           {progress}%
//         </span>
//       </div>
//     </div>
//   );
// };

// const Product = () => {
//   const [loading, setLoading] = useState(true);
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [error, setError] = useState(null);
//   const [cachedImages, setCachedImages] = useState([]);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [isProductCareOpen, setIsProductCareOpen] = useState(false);
//   const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [isShopLookOpen, setIsShopLookOpen] = useState(false);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [selectedLookColors, setSelectedLookColors] = useState({});
//   const [selectedLookSizes, setSelectedLookSizes] = useState({});
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const [isMagnifying, setIsMagnifying] = useState(false);
//   const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
//   const imageRef = useRef(null);
//   const sliderRef = useRef(null);
//   const touchStartX = useRef(0);
//   const touchEndX = useRef(0);
//   const { addToCart } = useCart();
//   const [lookAddCounts, setLookAddCounts] = useState({});
//   const [addCount, setAddCount] = useState(0);
//   const lensWidth = 160;
//   const lensHeight = 160;
//   const zoomFactor = 2;

//   // Function to format price with Argentine conventions
//   const formatPrice = (price) => {
//     const num = Number(price);
//     if (isNaN(num)) return "0";
//     const [integerPart, decimalPart] = num.toFixed(2).split(".");
//     const formattedInteger = integerPart
//       .split("")
//       .reverse()
//       .reduce((acc, digit, index) => {
//         const separator = index > 0 && index % 3 === 0 ? "." : "";
//         return digit + separator + acc;
//       }, "");
//     return parseInt(decimalPart) === 0 ? formattedInteger : `${formattedInteger},${decimalPart}`;
//   };

//   const fetchProduct = async () => {
//     try {
//       const response = await axios.get(`https://eeva-api.vercel.app/api/v1/products/${id}`);
//       const fetchedProduct = response.data;
//       console.log("GIF360 value:", fetchedProduct.models?.images?.gif360);
//       setProduct(fetchedProduct);

//       const newImages = fetchedProduct.models?.images?.gif360
//         ? Array.from({ length: 8 }, (_, i) => `/360/${fetchedProduct.models.images.gif360}-${i + 1}.webp`)
//         : ["/rotate1.svg", "/rotate2.svg", "/rotate3.svg", "/rotate4.svg", "/rotate5.svg"];
//       console.log("Cached Images:", newImages);
//       setCachedImages(newImages);

//       if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
//         const firstAvailableColor = fetchedProduct.colors.find((color) =>
//           color.sizes.some((size) => size.stock > 0)
//         );
//         if (firstAvailableColor) {
//           setSelectedColor(firstAvailableColor.color.name);
//           const firstAvailableSize = firstAvailableColor.sizes.find((size) => size.stock > 0);
//           setSelectedSize(firstAvailableSize ? firstAvailableSize.size.name : null);
//         } else {
//           setSelectedColor(fetchedProduct.colors[0].color.name);
//           setSelectedSize(null);
//         }
//       }

//       if (fetchedProduct.looks && fetchedProduct.looks.length > 0) {
//         const initialLookColors = {};
//         const initialLookSizes = {};
//         fetchedProduct.looks.forEach((look, index) => {
//           if (look.colors && look.colors.length > 0) {
//             const lookId = look._id || index;
//             const firstAvailableColor = look.colors.find((color) =>
//               color.sizes.some((size) => size.stock > 0)
//             );
//             initialLookColors[lookId] = firstAvailableColor
//               ? firstAvailableColor.color.name
//               : look.colors[0].color.name;
//             const selectedColor = firstAvailableColor || look.colors[0];
//             const firstAvailableSize = selectedColor.sizes.find((size) => size.stock > 0);
//             initialLookSizes[lookId] = firstAvailableSize ? firstAvailableSize.size.name : null;
//           }
//         });
//         setSelectedLookColors(initialLookColors);
//         setSelectedLookSizes(initialLookSizes);
//       }

//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching product:", err);
//       setError("Error al cargar el producto. Por favor, intenta de nuevo.");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!id) return;
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         await fetchProduct();
//       } catch (error) {
//         setError("Error al cargar el producto");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   useEffect(() => {
//     if (!product || !selectedColor) return;
//     const selectedColorData = product.colors.find((color) => color.color.name === selectedColor);
//     if (selectedColorData) {
//       const availableSize = selectedColorData.sizes.find((size) => size.stock > 0);
//       setSelectedSize(availableSize ? availableSize.size.name : null);
//     } else {
//       setSelectedSize(null);
//     }
//   }, [selectedColor, product]);

//   const updateLookSizes = useCallback(() => {
//     if (!product?.looks) return;
//     setSelectedLookSizes((prevSizes) => {
//       const updatedSizes = { ...prevSizes };
//       product.looks.forEach((look, index) => {
//         const lookId = look._id || index;
//         const selectedColor = selectedLookColors[lookId];
//         if (selectedColor) {
//           const selectedColorData = look.colors.find((color) => color.color.name === selectedColor);
//           if (selectedColorData) {
//             const availableSize = selectedColorData.sizes.find((size) => size.stock > 0);
//             updatedSizes[lookId] = availableSize ? availableSize.size.name : null;
//           } else {
//             updatedSizes[lookId] = null;
//           }
//         }
//       });
//       return updatedSizes;
//     });
//   }, [product, selectedLookColors]);

//   useEffect(() => {
//     updateLookSizes();
//   }, [updateLookSizes]);

//   const handleMagnifyClick = () => {
//     setIsPaused(true);
//     setIsMagnifying(true);
//   };

//   const handleMouseMove = (e) => {
//     if (!isMagnifying || !imageRef.current) return;
//     const rect = imageRef.current.getBoundingClientRect();
//     const imageWidth = rect.width;
//     const imageHeight = rect.height;
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const halfLensWidth = lensWidth / 2;
//     const halfLensHeight = lensHeight / 2;
//     const boundedX = Math.max(halfLensWidth, Math.min(x, imageWidth - halfLensWidth));
//     const boundedY = Math.max(halfLensHeight, Math.min(y, imageHeight - halfLensHeight));
//     setLensPosition({ x: boundedX, y: boundedY });
//   };

//   const handleCloseMagnifier = () => {
//     setIsMagnifying(false);
//     setIsPaused(false);
//   };

//   const handleTouchStart = (e) => {
//     touchStartX.current = e.touches[0].clientX;
//   };

//   const handleTouchMove = (e) => {
//     touchEndX.current = e.touches[0].clientX;
//   };

//   const handleTouchEnd = () => {
//     const deltaX = touchStartX.current - touchEndX.current;
//     const minSwipeDistance = 50;
//     if (Math.abs(deltaX) > minSwipeDistance) {
//       if (deltaX > 0 && currentSlide < (product?.looks?.length || 0) - 1) {
//         setCurrentSlide(currentSlide + 1);
//       } else if (deltaX < 0 && currentSlide > 0) {
//         setCurrentSlide(currentSlide - 1);
//       }
//     }
//   };

//   const handleDotClick = (index) => {
//     setCurrentSlide(index);
//   };

//   const handleLookColorChange = (lookId, colorName) => {
//     setSelectedLookColors((prev) => ({
//       ...prev,
//       [lookId]: colorName,
//     }));
//   };

//   const handleSizeSelect = (size) => {
//     const stock = sizeStockMap[size] || 0;
//     if (stock > 0) {
//       setSelectedSize(size);
//     }
//   };

//   const handleLookSizeSelect = (lookId, size, lookSizeStockMap) => {
//     const stock = lookSizeStockMap[size] || 0;
//     if (stock > 0) {
//       setSelectedLookSizes((prev) => ({
//         ...prev,
//         [lookId]: size,
//       }));
//     }
//   };

//   const handleAddLookToCart = (look, lookId) => {
//     const selectedColor = selectedLookColors[lookId];
//     const selectedSize = selectedLookSizes[lookId];
//     if (!selectedColor || !selectedSize) {
//       alert("Por favor selecciona color y talla para el look");
//       return;
//     }
//     const lookSizeStockMap = getLookSizeStockMap(look, selectedColor);
//     const stock = lookSizeStockMap[selectedSize] || 0;
//     const currentCount = lookAddCounts[lookId] || 0;

//     if (stock <= 0) {
//       alert("El talle seleccionado no tiene stock");
//       return;
//     }
//     if (currentCount >= stock) {
//       alert(`No puedes agregar más de ${stock} unidades de este producto`);
//       return;
//     }

//     console.log("Producto seleccionado en Shop Look:", {
//       lookId: look._id || lookId,
//       displayName: look.displayName,
//       selectedColor,
//       selectedSize,
//       stock,
//       price: look.discount ? look.price - look.price * (look.discount / 100) : look.price,
//       image: `/${look.image}.webp`,
//     });

//     const lookImages = [`/${look.image}.webp`];
//     addToCart(look, selectedColor, selectedSize, lookImages);

//     setLookAddCounts((prevCounts) => ({
//       ...prevCounts,
//       [lookId]: currentCount + 1,
//     }));
//   };

//   const handleFinishAdding = () => {
//     console.log("Todos los looks seleccionados:", {
//       selectedLookColors,
//       selectedLookSizes,
//       looks: product.looks.map((look, index) => {
//         const lookId = look._id || index;
//         const selectedColor = selectedLookColors[lookId];
//         const selectedSize = selectedLookSizes[lookId];
//         const lookSizeStockMap = getLookSizeStockMap(look, selectedColor);
//         return {
//           lookId: look._id || lookId,
//           displayName: look.displayName,
//           selectedColor,
//           selectedSize,
//           stock: selectedSize ? lookSizeStockMap[selectedSize] || 0 : "N/A",
//         };
//       }),
//     });
//     setIsShopLookOpen(false);
//   };

//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       setIsSizeGuideOpen(false);
//       setIsShopLookOpen(false);
//     }
//   };

//   const allSizes = ["S", "M", "L"];

//   const sizeStockMap = useMemo(() => {
//     if (!selectedColor || !product) return {};
//     const colorData = product.colors.find((c) => c.color.name === selectedColor);
//     return colorData?.sizes.reduce((acc, size) => {
//       acc[size.size.name] = size.stock;
//       return acc;
//     }, {}) || {};
//   }, [selectedColor, product]);

//   const discountedPrice = product?.discount
//     ? product.price - product.price * (product.discount / 100)
//     : product?.price;

//   const getLookSizeStockMap = useCallback((look, colorName) => {
//     const selectedColorData = look.colors.find((c) => c.color.name === colorName);
//     return selectedColorData?.sizes.reduce((acc, size) => {
//       acc[size.size.name] = size.stock;
//       return acc;
//     }, {}) || {};
//   }, []);

//   const getColorBackground = (colorName) => {
//     switch (colorName.toUpperCase()) {
//       case "BLANCO":
//         return "#FFFFFF";
//       case "NEGRO":
//         return "#232323";
//       case "MOON":
//         return "#74808f";
//       default:
//         return "#000000";
//     }
//   };

//   const handleAddToCart = () => {
//     if (!product || !selectedColor || !selectedSize) {
//       alert("Por favor selecciona color y talla");
//       return;
//     }
//     const stock = sizeStockMap[selectedSize] || 0;
//     if (stock <= 0) {
//       alert("El talle seleccionado no tiene stock");
//       return;
//     }
//     if (addCount >= stock) {
//       alert(`No puedes agregar más de ${stock} unidades de este producto`);
//       return;
//     }
//     addToCart(product, selectedColor, selectedSize, cachedImages);
//     setAddCount((prevCount) => prevCount + 1);
//   };

//   useEffect(() => {
//     if (!product || !selectedColor) {
//       setSelectedSize(null);
//       return;
//     }
//     const selectedColorData = product.colors.find((c) => c.color.name === selectedColor);
//     const availableSize = selectedColorData?.sizes.find((s) => s.stock > 0);
//     setSelectedSize(availableSize ? availableSize.size.name : null);
//   }, [selectedColor, product]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!isPaused && cachedImages.length > 0) {
//         setCurrentImageIndex((prev) => (prev + 1) % cachedImages.length);
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [isPaused, cachedImages.length]);

//   const renderLook = useCallback(
//     (look, index) => {
//       const lookId = look._id || index;
//       const discountedPrice = look.discount
//         ? look.price - look.price * (look.discount / 100)
//         : look.price;
//       const selectedLookColor = selectedLookColors[lookId];
//       const selectedLookSize = selectedLookSizes[lookId];
//       const lookSizeStockMap = getLookSizeStockMap(look, selectedLookColor);

//       return (
//         <div
//           key={index}
//           className="w-full sm:w-[284px] flex-shrink-0 flex flex-col items-center justify-between p-4"
//         >
//           <div className="w-[284px] h-[200px] relative">
//             <Image
//               src={`/products/${look.image}.webp`}
//               alt={look.displayName}
//               fill
//               className="object-contain"
//             />
//           </div>
//           <p className="text-white text-xs uppercase mt-2 text-center">
//             {look.displayName}
//           </p>
//           {look.discount > 0 && (
//             <div className="flex items-center justify-center mt-1">
//               <div className="w-[43px] flex justify-center h-[25px] px-2 gap-[10px] border rounded-[2px] bg-[#FCFDFD] text-[#232323]">
//                 <p className="font-normal text-[12px] tracking-[-0.04em] align-middle">
//                   {look.discount}%
//                 </p>
//               </div>
//               <span className="line-through text-gray-400 text-[12px] ml-2">
//                 <span className="uppercase">Ars $</span> {formatPrice(look.price)}
//               </span>
//             </div>
//           )}
//           <p className="text-white text-xs text-center mt-1">
//             <span className="uppercase">Ars $</span> {formatPrice(discountedPrice)}
//           </p>
//           <div>
//             <div className="flex w-full justify-center gap-2 mt-1">
//               {look.colors.map((color, colorIndex) => (
//                 <button
//                   key={colorIndex}
//                   onClick={() => handleLookColorChange(lookId, color.color.name)}
//                   className="w-[40px] h-[40px] p-1 rounded-[20px] border"
//                   style={{
//                     borderColor: selectedLookColor === color.color.name ? "#FFFFFF" : "transparent",
//                     borderWidth: selectedLookColor === color.color.name ? "0.5px" : "1px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       backgroundColor: getColorBackground(color.color.name),
//                       borderRadius: "18px",
//                       padding: selectedLookColor === color.color.name ? "2px" : "0",
//                     }}
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="flex flex-col items-center mt-2">
//             <div className="flex gap-2 mt-1">
//               {allSizes.map((size, sizeIndex) => {
//                 const stock = lookSizeStockMap[size] || 0;
//                 return (
//                   <button
//                     key={sizeIndex}
//                     onClick={() => handleLookSizeSelect(lookId, size, lookSizeStockMap)}
//                     className={`w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white text-xs transition-all duration-200 hover:bg-[#A8A8A84D] ${
//                       stock <= 0 ? "line-through opacity-50" : ""
//                     } ${selectedLookSize === size ? "bg-[#E7E7E766]" : ""}`}
//                     disabled={stock <= 0}
//                   >
//                     {size}
//                   </button>
//                 );
//               })}
//             </div>
//             {Object.values(lookSizeStockMap).every((stock) => stock <= 0) && (
//               <p className="text-white text-xs mt-2">No hay stock disponible</p>
//             )}
//           </div>
//           <div className="w-full max-w-[207px] mt-4 h-10 px-4 py-2 gap-2 rounded-[2px] border border-white bg-[#A8A8A81A] hover:bg-[#A8A8A84D]">
//             <button
//               onClick={() => handleAddLookToCart(look, lookId)}
//               className="w-full text-white uppercase text-xs"
//             >
//               {lookAddCounts[lookId] > 0 ? `+ Add (${lookAddCounts[lookId]})` : "+ Add"}
//             </button>
//           </div>
//         </div>
//       );
//     },
//     [selectedLookColors, selectedLookSizes, getLookSizeStockMap, lookAddCounts]
//   );

//   return (
//     <div className="min-h-screen w-full flex flex-col pt-[90px]">
//       {loading ? (
//         <Loader loading={loading} />
//       ) : error ? (
//         <div>{error}</div>
//       ) : !product ? null : (
//         <>
//           <div className="max-w-[1252px] mx-auto flex flex-col md:flex-row py-8">
//             <div className="w-auto md:w-[940px] md:items-end h-[600px] relative flex flex-col items-center">
//               {cachedImages.length > 0 && (
//                 <div className="relative" onMouseMove={handleMouseMove} onMouseLeave={handleCloseMagnifier}>
//                   <Image
//                     ref={imageRef}
//                     src={cachedImages[currentImageIndex] || "/rotate1.svg"}
//                     alt={`Product image ${currentImageIndex + 1}`}
//                     width={545}
//                     height={900}
//                     className="object-contain h-[535px] md:w-[550px] md:h-[650px]"
//                     priority
//                     onLoad={() => console.log("Image loaded:", cachedImages[currentImageIndex])}
//                     onError={() => console.error("Image failed to load:", cachedImages[currentImageIndex])}
//                   />
//                   {isMagnifying && (
//                     <div
//                       className="absolute rounded-md shadow-lg bg-white bg-opacity-10"
//                       style={{
//                         width: `${lensWidth}px`,
//                         height: `${lensHeight}px`,
//                         top: `${lensPosition.y - lensHeight / 2}px`,
//                         left: `${lensPosition.x - lensWidth / 1.5}px`,
//                         backgroundImage: `url(${cachedImages[currentImageIndex] || "/rotate1.svg"})`,
//                         backgroundSize: `${imageRef.current?.getBoundingClientRect().width * zoomFactor}px ${
//                           imageRef.current?.getBoundingClientRect().height * zoomFactor
//                         }px`,
//                         backgroundPosition: `-${(lensPosition.x - lensWidth / 2) * zoomFactor}px -${
//                           (lensPosition.y - lensHeight / 3.5) * zoomFactor
//                         }px`,
//                         backgroundRepeat: "no-repeat",
//                         pointerEvents: "none",
//                         zIndex: 20,
//                       }}
//                     />
//                   )}
//                 </div>
//               )}
//               <div className="md:block hidden absolute bottom-[-35px] flex-col items-center mt-4">
//                 <button
//                   onClick={handleMagnifyClick}
//                   className="flex items-center text-white px-4 py-2"
//                   aria-label="Activate magnifying glass to pause and zoom"
//                   disabled={isMagnifying}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 mr-2"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </button>
//               </div>
//               <div className="absolute top-[-10px] md:top-[20px] left-[40px] md:left-[-10px] xl:left-[250px] w-[140px] md:w-[200px] text-white z-10 font-normal text-[12px] tracking-[-0.04em] align-middle pl-[1px]">
//                 <div className="w-[190px] md:w-[170px] h-[60px] flex flex-row items-end overflow-hidden mb-[20px]">
//                   {Array.from({ length: 40 }, (_, index) => {
//                     const maxHeightOptions = [5, 10, 15, 30];
//                     const maxHeight = maxHeightOptions[Math.floor(Math.random() * maxHeightOptions.length)];
//                     const animationClass = `animate-pulseHeight-${maxHeight}`;
//                     const delay = Math.random() * 2;
//                     return (
//                       <div
//                         key={index}
//                         className={`bg-white w-[1px] md:w-[2px] mx-[1px] md:mx-[2px] transition-all ${animationClass}`}
//                         style={{ height: `${Math.floor(Math.random() * maxHeight) + 10}px`, animationDelay: `${delay}s` }}
//                       ></div>
//                     );
//                   })}
//                 </div>
//                 <style jsx>{`
//                   @keyframes pulseHeight-5 {
//                     0% { height: 10px; }
//                     50% { height: 5px; }
//                     100% { height: 10px; }
//                   }
//                   .animate-pulseHeight-5 { animation: pulseHeight-5 2s ease-in-out infinite; }
//                   @keyframes pulseHeight-10 {
//                     0% { height: 10px; }
//                     50% { height: 10px; }
//                     100% { height: 10px; }
//                   }
//                   .animate-pulseHeight-10 { animation: pulseHeight-10 2s ease-in-out infinite; }
//                   @keyframes pulseHeight-15 {
//                     0% { height: 10px; }
//                     50% { height: 15px; }
//                     100% { height: 10px; }
//                   }
//                   .animate-pulseHeight-15 { animation: pulseHeight-15 2s ease-in-out infinite; }
//                   @keyframes pulseHeight-30 {
//                     0% { height: 10px; }
//                     50% { height: 30px; }
//                     100% { height: 10px; }
//                   }
//                   .animate-pulseHeight-30 { animation: pulseHeight-30 2s ease-in-out infinite; }
//                 `}</style>
//                 <div className="relative">
//                   <div className="absolute top-0 left-0 w-[1px] bg-gradient-to-r from-white to-[#BEBEBE] z-[-1]" style={{ height: "100%" }}></div>
//                   <div className="pl-[20px]">
//                     <div className="flex justify-between">
//                       <p>Nombre</p> <p className="w-[60px] lowercase">{product.models.modelName}</p>
//                     </div>
//                     <div className="flex justify-between">
//                       <p>Altura</p> <p className="w-[60px] lowercase">{product.models.height}</p>
//                     </div>
//                     <div className="flex justify-between">
//                       <p>Peso</p> <p className="w-[60px] lowercase">{product.models.weight} kg.</p>
//                     </div>
//                     <div className="flex justify-between">
//                       <p>Talle</p> <p className="w-[60px] lowercase">{product.models.size.name}</p>
//                     </div>
//                     <div className="flex justify-between">
//                       <p>Género</p> <p className="w-[60px] lowercase">{product.models.gender}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="text-[#FCFDFD] w-auto md:w-[551px] h-auto flex flex-col">
//               <div className="flex items-center justify-center md:justify-start">
//                 <p className="h-[40px] w-[90%] md:w-[100%] px-4 border uppercase flex items-center">
//                   {product.displayName || "Camisa Oversize"}
//                 </p>
//               </div>
//               <div className="flex flex-row md:flex-col justify-around md:justify-center">
//                 <div className="h-auto md:h-[140px] w-[42%] md:w-full flex justify-evenly flex-col">
//                   {product.discount > 0 && (
//                     <div className="flex items-center">
//                       <div className="w-[43px] flex justify-center md:w-[60px] h-[25px] md:px-4 gap-[10px] border rounded-[2px] bg-[#FCFDFD] text-[#232323] mr-[10px]">
//                         <p className="font-normal text-[16px] tracking-[-0.04em] align-middle">{product.discount}%</p>
//                       </div>
//                       <div className="flex items-baseline w-full">
//                         <span className="line-through text-gray-400 text-[14px] md:text-[16px] w-auto flex">
//                           <p className="uppercase mr-1 w-auto">Ars $</p> {formatPrice(product.price)}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex items-baseline">
//                     <p className="uppercase mr-1">Ars $</p>
//                     <span>{formatPrice(discountedPrice)}</span>
//                   </div>
//                   <div>
//                     <p className="h-[152px] md:h-auto font-['IBM_Plex_Mono'] font-normal text-[12px] leading-[16px] tracking-[-0.04em] align-middle">
//                       3 cuotas sin interés en bancos seleccionados
//                     </p>
//                   </div>
//                 </div>
//                 <div className="h-[213px] flex flex-col justify-around w-[35%] md:w-full">
//                   <div>
//                     <p className="uppercase">Color</p>
//                     <div className="flex w-[50%] md:w-[19%] justify-between mt-2">
//                       {product.colors.map((color, index) => (
//                         <button
//                           key={index}
//                           onClick={() => setSelectedColor(color.color.name)}
//                           className="w-[40px] h-[40px] p-1 rounded-[20px] border"
//                           style={{
//                             borderColor: selectedColor === color.color.name ? "#FFFFFF" : "transparent",
//                             borderWidth: selectedColor === color.color.name ? "0.5px" : "1px",
//                           }}
//                         >
//                           <div
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               backgroundColor: getColorBackground(color.color.name),
//                               borderRadius: "18px",
//                               padding: selectedColor === color.color.name ? "2px" : "0",
//                             }}
//                           />
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                   <div>
//                     <p className="uppercase">Size</p>
//                     <button
//                       onClick={() => setIsSizeGuideOpen(true)}
//                       className="text-white cursor-pointer flex w-full justify-between mt-2"
//                     >
//                       Size guide
//                       <Image src="/flechamobilediagonal.svg" width={24} height={24} alt="diagonal arrow" className="ml-2" />
//                     </button>
//                     <div>
//                       <div className="flex gap-2 mt-2">
//                         {allSizes.map((size, index) => {
//                           const stock = sizeStockMap[size] || 0;
//                           return (
//                             <button
//                               key={index}
//                               onClick={() => handleSizeSelect(size)}
//                               className={`w-[40px] transition-all duration-200 hover:bg-[#A8A8A84D] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white ${
//                                 stock <= 0 ? "line-through opacity-50" : ""
//                               } ${selectedSize === size ? "bg-[#E7E7E766]" : ""}`}
//                               disabled={stock <= 0}
//                             >
//                               {size}
//                             </button>
//                           );
//                         })}
//                       </div>
//                       {Object.values(sizeStockMap).every((stock) => stock <= 0) && (
//                         <p className="text-white text-sm mt-2">No hay stock disponible</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="relative flex min-h-[90px] md:h-auto flex-col items-center md:flex-row justify-between gap-4">
//                 <button
//                   onClick={handleAddToCart}
//                   className="w-full max-w-[280px] md:w-[300px] h-[40px] gap-2 px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] transition-all duration-200 hover:bg-[#2C2C2CE5] uppercase text-center"
//                 >
//                   {addCount > 0 ? `(${addCount}) Added` : "+ Add to Bag"}
//                 </button>
//                 <button
//                   onClick={() => setIsShopLookOpen(true)}
//                   className="w-full max-w-[280px] md:w-[140px] h-[40px] gap-2 px-[20px] py-[6px] border border-white rounded-[2px] bg-[#A8A8A81A] backdrop-blur-[6px] uppercase transition-all duration-200 hover:bg-[#A8A8A84D]"
//                 >
//                   Shop Look
//                 </button>
//               </div>
//               <div className="w-full flex flex-col items-center">
//                 <div className="mt-2 w-[80%] md:w-full z-10 relative">
//                   <button
//                     onClick={() => setIsDetailsOpen(!isDetailsOpen)}
//                     className="w-full text-left flex justify-between h-[30px] items-center uppercase"
//                   >
//                     <span>Details</span>
//                     <Image
//                       src={isDetailsOpen ? "/flechamobileup.svg" : "/flechamobiledown.svg"}
//                       width={24}
//                       height={24}
//                       alt={isDetailsOpen ? "arrow up" : "arrow down"}
//                     />
//                   </button>
//                   {isDetailsOpen && (
//                     <div className="p-4 z-10 relative">
//                       <p className="font-normal text-[12px] leading-[170%] tracking-[-4%] text-justify align-middle">
//                         {product.details}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//                 <div className="mt-2 w-[80%] md:w-full z-10 relative">
//                   <button
//                     onClick={() => setIsProductCareOpen(!isProductCareOpen)}
//                     className="w-full text-left flex justify-between items-center uppercase h-[30px]"
//                   >
//                     <span>Product Care</span>
//                     <Image
//                       src={isProductCareOpen ? "/flechamobileup.svg" : "/flechamobiledown.svg"}
//                       width={24}
//                       height={24}
//                       alt={isProductCareOpen ? "arrow up" : "arrow down"}
//                     />
//                   </button>
//                   {isProductCareOpen && (
//                     <div className="p-4 z-10 relative">
//                       {product.productCare.split("\n").map((line, index) => (
//                         <p
//                           key={index}
//                           className="text-white font-normal text-[12px] leading-[170%] tracking-[-4%] text-justify align-middle"
//                         >
//                           {line}
//                         </p>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="w-full mt-8 z-0">
//             <Marquee />
//           </div>
//           {isShopLookOpen && (
//             <div
//               className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 overflow-y-auto"
//               onClick={handleOverlayClick}
//             >
//               <div className="w-full max-w-[1062px] mx-4 my-8 sm:mx-6 md:mx-8 bg-[#83838366] border-[#f2f2f2] border-[0.5px] rounded-[6px] pt-8 pb-6 px-4 sm:px-6 md:px-10 gap-6 backdrop-blur-[30px] relative min-h-[300px] max-h-[90vh] overflow-y-auto">
//                 <div className="w-full h-[30px] md:h-[60px] flex justify-center items-center">
//                   <div className="w-full max-w-[950px] h-[32px] flex justify-between items-center px-4">
//                     <h2 className="font-medium text-sm sm:text-base md:text-[14px] leading-tight tracking-[0.1em] uppercase text-[#f2f2f2]">
//                       SHOP ALL THE LOOK
//                     </h2>
//                     <button onClick={() => setIsShopLookOpen(false)} className="text-gray-500 hover:text-gray-700">
//                       <Image src="/crossSize.svg" width={16} height={16} alt="close modal" className="ml-2" />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="flex w-full justify-center items-center">
//                   <div className="w-full flex flex-col items-center justify-between gap-6">
//                     {product.looks && product.looks.length > 0 ? (
//                       <>
//                         <div className="w-full sm:hidden relative overflow-hidden">
//                           <div
//                             ref={sliderRef}
//                             className="flex transition-transform duration-300 ease-in-out"
//                             style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//                             onTouchStart={handleTouchStart}
//                             onTouchMove={handleTouchMove}
//                             onTouchEnd={handleTouchEnd}
//                           >
//                             {product.looks.map(renderLook)}
//                           </div>
//                           <div className="flex justify-center mt-4 space-x-2">
//                             {product.looks.map((_, index) => (
//                               <button
//                                 key={index}
//                                 onClick={() => handleDotClick(index)}
//                                 className={`w-[20px] h-[3px] rounded-[2px] ${currentSlide === index ? "bg-white" : "bg-gray-500"}`}
//                               />
//                             ))}
//                           </div>
//                         </div>
//                         <div
//                           className={`hidden sm:grid sm:grid-cols-3 gap-4 mx-auto ${
//                             product.looks.length === 1
//                               ? "max-w-[284px]"
//                               : product.looks.length === 2
//                               ? "max-w-[568px]"
//                               : "max-w-[852px]"
//                           }`}
//                         >
//                           {product.looks.map(renderLook)}
//                         </div>
//                       </>
//                     ) : (
//                       <p className="text-white text-center">No hay looks disponibles</p>
//                     )}
//                     <div className="w-full flex justify-end mt-4">
//                       <button
//                         onClick={handleFinishAdding}
//                         className="w-full sm:w-[208px] h-10 px-4 py-2 rounded-[2px] bg-[#0D0D0DE5] hover:bg-[#2C2C2CE5] backdrop-blur-[6px]"
//                       >
//                         <p className="font-medium text-xs sm:text-sm md:text-[14px] leading-tight tracking-[0.1em] uppercase text-[#F2F2F2]">
//                           Finish Adding
//                         </p>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           {isSizeGuideOpen && (
//             <div
//               className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 overflow-y-auto"
//               onClick={handleOverlayClick}
//             >
//               <div className="w-full max-w-[90%] md:max-w-[1062px] min-h-[485px] items-center md:h-[500px] border-[#f2f2f2] border-[0.5px] bg-[#83838366] rounded-[6px] relative mx-4 sm:mx-6 md:mx-8 p-4 sm:p-6 md:p-10">
//                 <div className="w-full h-[60px] flex justify-center items-center">
//                   <div className="w-full max-w-[950px] h-[32px] flex justify-between items-center">
//                     <h2 className="font-medium text-sm sm:text-base md:text-[14px] leading-tight tracking-[0.1em] uppercase text-[#f2f2f2]">
//                       Size Guide
//                     </h2>
//                     <button onClick={() => setIsSizeGuideOpen(false)} className="text-gray-500 hover:text-gray-700">
//                       <Image src="/crossSize.svg" width={16} height={16} alt="close modal" className="ml-2" />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="w-full flex justify-center items-center">
//                   <div className="w-full max-w-[1002px] items-center flex flex-col md:flex-row h-auto md:h-[356px]">
//                     {product.sizeGuide && product.sizeGuide.length >= 2 ? (
//                       <>
//                         <div className="w-[300px] h-[196px] md:w-[402px] md:h-[296px] relative">
//                           <Image src={`/sizeGuide/${product.sizeGuide[0]}.webp`} fill className="object-contain" alt="Size guide table" />
//                         </div>
//                         <div className="w-[300px] h-[196px] md:w-[600px] md:h-[296px] relative">
//                           <Image src={`/sizeGuide/${product.sizeGuide[1]}.webp`} fill className="object-contain" alt="Size guide table" />
//                         </div>
//                       </>
//                     ) : (
//                       <p className="text-white text-center">No hay imágenes de guía de talles disponibles</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Product;