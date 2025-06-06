"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Axios from "axios";
import style from "@/app/ui/navbar.module.css";
import { usePathname } from "next/navigation";
import { useCart } from "./context/CartContext";

const colecciones = [
  { name: "Initiation", link: "/collections/initiation", age: "new" },
  { name: "Amsterdam", link: "/collections/amsterdam", age: "'24" },
  { name: "New York", link: "/collections/newyork", age: "'27" },
  { name: "Groenlandia", link: "/collections/groenlandia", age: "'20" },
  { name: "Buenos Aires", link: "/collections/buenos-aires", age: "'22" },
  { name: "Los Angeles", link: "/collections/los-angeles", age: "'23" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHombreOpen, setIsHombreOpen] = useState(false);
  const [isMujerOpen, setIsMujerOpen] = useState(false);
  const [isColeccionesOpen, setIsColeccionesOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pathname = usePathname();
  const currentCollection = colecciones.find((coleccion) =>
    pathname.startsWith(coleccion.link)
  );
  const menuRef = useRef(null);
  const hombreRef = useRef(null);
  const mujerRef = useRef(null);
  const coleccionesRef = useRef(null);
  const modalRef = useRef(null);
  const { totalItems } = useCart();

  // Fetch products from API and format them
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await Axios.get('https://eeva-api.vercel.app/api/v1/products');
        const formattedProducts = response.data.map((product) => ({
          id: product._id,
          title: product.displayName || product.name || 'Producto sin título',
          subtitle: product.details || '',
          image: product.models?.images?.static
            ? `/static/${product.models.images.static}.webp`
            : '/static/placeholder.webp',
          gender: product.gender || 'unknown',
          tags: product.tags || [], // Include tags for filtering
          searchCount: product.searchCount || 0, // Include searchCount for topSearchedProducts
        }));
        setProducts(formattedProducts);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("No se pudieron cargar los productos. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Get top searched products (based on searchCount or first 3 products)
  const topSearchedProducts = products
    .sort((a, b) => (b.searchCount || 0) - (a.searchCount || 0))
    .slice(0, 3);

  // Filter products based on search term (title or tags)
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Toggle functions
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsHombreOpen(false);
    setIsMujerOpen(false);
    setIsColeccionesOpen(false);
  };

  const toggleHombreDropdown = () => {
    setIsHombreOpen(!isHombreOpen);
    setIsMujerOpen(false);
    setIsColeccionesOpen(false);
  };

  const toggleMujerDropdown = () => {
    setIsMujerOpen(!isMujerOpen);
    setIsHombreOpen(false);
    setIsColeccionesOpen(false);
  };

  const toggleColeccionesDropdown = () => {
    setIsColeccionesOpen(!isColeccionesOpen);
    setIsHombreOpen(false);
    setIsMujerOpen(false);
  };

  const toggleSearchModal = () => {
    setIsSearchModalOpen(!isSearchModalOpen);
    setSearchTerm("");
  };

  // Handle click outside to close dropdowns
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
      setIsOpen(false);
    }
    if (
      hombreRef.current &&
      !hombreRef.current.contains(event.target) && isHombreOpen
    ) {
      setIsHombreOpen(false);
    }
    if (
      mujerRef.current &&
      !mujerRef.current.contains(event.target) && isMujerOpen
    ) {
      setIsMujerOpen(false);
    }
    if (
      coleccionesRef.current &&
      !coleccionesRef.current.contains(event.target) && isColeccionesOpen
    ) {
      setIsColeccionesOpen(false);
    }
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target) && isSearchModalOpen
    ) {
      setIsSearchModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isHombreOpen, isMujerOpen, isColeccionesOpen, isSearchModalOpen]);

  return (
    <div className="absolute w-full">
      <style jsx>{`
        .dropdown-active {
          background-color: #FFFFFF4D !important;
          transition: background-color 0.3s ease;
        }
      `}</style>
      <div className="flex justify-between md:justify-around h-[90px] items-center">
        <div className="min-w-[90px] h-[36px] flex justify-around items-center text-[#FFFFFF]">
          {/* Botón hamburguesa */}
          <div ref={menuRef}>
            <button
              onClick={toggleDropdown}
              className={`${style.menuIcon} focus:outline-none`}
            >
              <Image
                src={isOpen ? "/XMenuIcon.svg" : "/IconoHamburguesa.svg"}
                width={50}
                height={50}
                alt={isOpen ? "close menu" : "menu"}
              />
            </button>
            {/* Overlay for mobile when menu is open */}
            {isOpen && (
              <div
                className="fixed inset-0 bg-[#1820251A] backdrop-blur-[30px] z-40 md:hidden"
                onClick={toggleDropdown}
              ></div>
            )}
            {/* Dropdown del menú hamburguesa */}
            {isOpen && (
              <div className="absolute top-0 md:top-[78px] w-[323px] md:left-[140px] left-0 md:w-[200px] h-screen md:h-auto bg-[#182025B2] backdrop-blur-[30px] text-white z-50 overflow-y-auto md:backdrop-blur-[6px] rounded-[2px] border-[0.5px] md:bg-[#A8A8A81A]">
                <div className="flex flex-col p-4 space-y-2">
                  {/* Colecciones en desktop */}
                  <div className="hidden md:block">
                    {colecciones.map((coleccion, index) => (
                      <div key={index} className="relative group">
                        <Link
                          href={coleccion.link}
                          className="flex justify-start items-start h-[20px] text-left"
                          onClick={() => setIsOpen(false)}
                        >
                          {coleccion.name}
                          <span className="absolute left-[80%] top-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white">
                            {coleccion.age}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Botones en mobile */}
                  <div className="block md:hidden">
                    <div className="flex">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="focus:outline-none"
                      >
                        <Image
                          src="/XMenuIcon.svg"
                          width={24}
                          height={24}
                          alt="close menu"
                        />
                      </button>
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={toggleSearchModal}
                        className="text-center w-[100%] h-[36px] flex items-center justify-between"
                      >
                        <p>BUSCAR</p>
                        <Image
                          src={"/lupa.svg"}
                          width={24}
                          height={24}
                          alt="lupa"
                        />
                      </button>
                    </div>
                    <div className="mt-2" ref={coleccionesRef}>
                      <button
                        onClick={toggleColeccionesDropdown}
                        className="w-full uppercase flex h-[36px] text-center justify-between focus:outline-none"
                      >
                        Colecciones
                        <Image
                          src={
                            isColeccionesOpen
                              ? "/flechamobileup.svg"
                              : "/flechamobiledown.svg"
                          }
                          width={24}
                          height={24}
                          alt={isColeccionesOpen ? "arrow up" : "arrow down"}
                        />
                      </button>
                      {isColeccionesOpen && (
                        <div className="mt-2 w-full text-white z-50">
                          <div className="flex flex-col py-2 space-y-1 px-2">
                            {colecciones.map((coleccion, index) => (
                              <Link
                                key={index}
                                href={coleccion.link}
                                className="flex justify-start items-start h-[20px] text-left"
                                onClick={() => {
                                  setIsColeccionesOpen(false);
                                  setIsOpen(false);
                                }}
                              >
                                {coleccion.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div ref={hombreRef} className="relative mt-2">
                      <button
                        onClick={toggleHombreDropdown}
                        className="w-full flex h-[36px] text-center justify-between focus:outline-none"
                      >
                        HOMBRE
                        <Image
                          src={
                            isHombreOpen
                              ? "/flechamobileup.svg"
                              : "/flechamobiledown.svg"
                          }
                          width={24}
                          height={24}
                          alt={isHombreOpen ? "arrow up" : "arrow down"}
                        />
                      </button>
                      {isHombreOpen && (
                        <div className="mt-2 w-full text-white z-50">
                          <div className="flex flex-col py-2 space-y-1 px-2">
                            <a
                              href="/collections/topsm"
                              className="flex h-[30px] text-center"
                              onClick={() => setIsHombreOpen(false)}
                            >
                              Top
                            </a>
                            <a
                              href="/collections/bottomm"
                              className="flex h-[30px] text-center"
                              onClick={() => setIsHombreOpen(false)}
                            >
                              Bottom
                            </a>
                            <a
                              href="/collections/accesoriesm"
                              className="flex h-[30px] text-center"
                              onClick={() => setIsHombreOpen(false)}
                            >
                              Accesories
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      ref={mujerRef}
                      className="relative mt-2 border-b border-b-[#47545C]"
                    >
                      <button
                        onClick={toggleMujerDropdown}
                        className="w-full flex h-[36px] text-center justify-between"
                      >
                        MUJER
                        <Image
                          src={
                            isMujerOpen
                              ? "/flechamobileup.svg"
                              : "/flechamobiledown.svg"
                          }
                          width={24}
                          height={24}
                          alt={isMujerOpen ? "arrow up" : "arrow down"}
                        />
                      </button>
                      {isMujerOpen && (
                        <div className="mt-2 w-full text-white z-50">
                          <div className="flex flex-col py-2 space-y-1 px-2">
                            <a
                              href="/collections/topw"
                              className="flex h-[30px] text-center"
                              onClick={() => setIsMujerOpen(false)}
                            >
                              Top
                            </a>
                            <a
                              href="/collections/bottomw"
                              className="flex h-[30px] text-center"
                              onClick={() => setIsMujerOpen(false)}
                            >
                              Bottom
                            </a>
                            <a
                              href="/collections/accesoriesg"
                              className="flex h-[30px] text-center"
                              onClick={() => setIsMujerOpen(false)}
                            >
                              Accesories
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <Image
                        src="/e2.svg"
                        width={143}
                        height={89}
                        alt="eevaLogo"
                        className="w-auto h-12"
                      />
                      <div className="flex items-center w-[137px] justify-between">
                        <Link href="/collections/aboutus">
                          <p className="flex text-center text-[16px] w-full font-medium text-base leading-[14px] tracking-[0.1em]">
                            ABOUT US
                          </p>
                        </Link>
                        <Image
                          src="/flechamobilediagonal.svg"
                          width={24}
                          height={24}
                          alt="diagonal arrow"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Renderizar el nombre de la colección en desktop si existe */}
          {currentCollection && (
            <div className="hidden md:flex text-[12px] h-[34px] items-center text-white w-[190px] md:justify-evenly">
              <div className="h-full flex flex-col justify-between">
                <p className="font-normal text-[12px] leading-[100%] tracking-[-0.02em] uppercase border-white border-r-[1px] pr-[15px]">
                  Collection
                </p>
                <span className="font-normal text-[12px] leading-[100%] tracking-[-0.02em]">
                  07-07-2025
                </span>
              </div>
              <div className="flex h-full">
                <span className="font-normal text-[12px] leading-[100%] tracking-[-0.02em] uppercase">
                  {currentCollection.name}
                </span>
              </div>
            </div>
          )}
          {/* Botones Hombre y Mujer fuera del menú hamburguesa (solo en desktop) */}
          <div className="hidden md:flex">
            <div className="flex w-[140px] justify-around">
              <div ref={hombreRef} className="relative">
                <button
                  onClick={toggleHombreDropdown}
                  className={`w-[50px] transition-all duration-200 ${isHombreOpen ? "dropdown-active" : "hover:bg-[#A8A8A84D]"
                    } backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none`}
                >
                  H
                </button>
                {isHombreOpen && (
                  <div className="absolute top-[40px] mt-[10px] left-0 w-[190px] text-white z-50 backdrop-blur-[6px] rounded-[2px] border-[0.5px] bg-[#A8A8A81A]">
                    <div className="flex flex-col py-2 space-y-1 px-2">
                      <a
                        href="/collections/topsm"
                        className="group flex items-center h-[30px] text-center rounded-[2px]"
                        onClick={() => setIsHombreOpen(false)}
                      >
                        Top
                        <Image
                          src="/flechaDiagonal.svg"
                          width={14}
                          height={14}
                          alt="arrow"
                          className="hidden group-hover:block mr-2 ml-[120px]"
                        />
                      </a>
                      <a
                        href="/collections/bottomm"
                        className="group flex items-center h-[30px] text-center rounded-[2px]"
                        onClick={() => setIsHombreOpen(false)}
                      >
                        Bottom
                        <Image
                          src="/flechaDiagonal.svg"
                          width={14}
                          height={14}
                          alt="arrow"
                          className="hidden group-hover:block mr-2 ml-[90px]"
                        />
                      </a>
                      <a
                        href="/collections/accesoriesm"
                        className="group flex items-center h-[30px] text-center rounded-[2px]"
                        onClick={() => setIsHombreOpen(false)}
                      >
                        Accesories
                        <Image
                          src="/flechaDiagonal.svg"
                          width={14}
                          height={14}
                          alt="arrow"
                          className="hidden group-hover:block mr-2 ml-[50px]"
                        />
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div ref={mujerRef} className="relative">
                <button
                  onClick={toggleMujerDropdown}
                  className={`w-[50px] transition-all duration-200 ${isMujerOpen ? "dropdown-active" : "hover:bg-[#A8A8A84D]"
                    } backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none`}
                >
                  M
                </button>
                {isMujerOpen && (
                  <div className="absolute top-[40px] mt-[10px] left-0 w-[190px] text-white z-50 backdrop-blur-[6px] rounded-[2px] border-[0.5px] bg-[#A8A8A81A]">
                    <div className="flex flex-col py-2 space-y-1 px-2">
                      <a
                        href="/collections/topw"
                        className="group flex items-center h-[30px] text-center rounded-[2px]"
                        onClick={() => setIsMujerOpen(false)}
                      >
                        Top
                        <Image
                          src="/flechaDiagonal.svg"
                          width={14}
                          height={14}
                          alt="arrow"
                          className="hidden group-hover:block mr-2 ml-[120px]"
                        />
                      </a>
                      <a
                        href="/collections/bottomw"
                        className="group flex items-center h-[30px] text-center rounded-[2px]"
                        onClick={() => setIsMujerOpen(false)}
                      >
                        Bottom
                        <Image
                          src="/flechaDiagonal.svg"
                          width={14}
                          height={14}
                          alt="arrow"
                          className="hidden group-hover:block mr-2 ml-[90px]"
                        />
                      </a>
                      <a
                        href="/collections/accesoriesg"
                        className="group flex items-center h-[30px] text-center rounded-[2px]"
                        onClick={() => setIsMujerOpen(false)}
                      >
                        Accesories
                        <Image
                          src="/flechaDiagonal.svg"
                          width={14}
                          height={14}
                          alt="arrow"
                          className="hidden group-hover:block mr-2 ml-[50px]"
                        />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div>
          <Link href="/collections/slider" className="hidden md:block">
            <Image
              src={"/LogoFullEEVA.svg"}
              width={262}
              height={31}
              alt="logo"
              className="absolute top-[30px] left-[80px] md:left-[600px] xl:left-[590px] 2xl:left-[740px]"
            />
          </Link>
          <Link href="/collections/slider" className="md:hidden">
            <Image
              src={"/LogoFullEEVA.svg"}
              width={262}
              height={31}
              alt="logo"
              className=""
            />
          </Link>
        </div>

        {/* Sección derecha */}
        <div className="w-[90px] md:w-[324px] text-[#FFFFFF] flex justify-end">
          <div className="flex w-[188px] md:w-[288px] justify-around items-center">
            <button
              onClick={toggleSearchModal}
              className="hidden md:flex backdrop-blur-[6px] bg-[#A8A8A81A] transition-all duration-200 hover:bg-[#A8A8A84D] text-center w-[60px] h-[36px] items-center justify-center rounded-[2px] border-[0.5px] focus:outline-none"
            >
              <Image src={"/lupa.svg"} width={24} height={24} alt="lupa" />
            </button>
            <Link href="/collections/aboutus">
              <p className="hidden md:flex backdrop-blur-[6px] rounded-[2px] border-[0.5px] border-white h-[36px] w-[120px] justify-center items-center text-center bg-[#A8A8A81A] transition-all duration-200 hover:bg-[#A8A8A84D]">
                ABOUT US
              </p>
            </Link>
            <Link
              href="/cart"
              className="backdrop-blur-[6px] text-center w-[60px] h-[36px] flex items-center justify-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] transition-all duration-200 hover:bg-[#A8A8A84D]"
            >
              {totalItems}
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de búsqueda */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black backdrop-blur-[6px] bg-opacity-50 flex z-50">
          <div
            ref={modalRef}
            className="h-[50%] rounded-lg p-6 w-full max-w-[65rem] mt-[10px] text-white"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pr-20 rounded-md bg-[#FFFFFF1A] border-[0.5px] border-white text-white focus:outline-none"
                style={{ paddingLeft: "40px" }}
              />
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                <Image
                  src="/lupa.svg"
                  width={24}
                  height={24}
                  alt="search icon"
                />
              </div>
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-white text-sm px-2 py-1 focus:outline-none"
              >
                LIMPIAR
              </button>
              <button
                onClick={toggleSearchModal}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
              >
                <Image
                  src="/XMenuIcon.svg"
                  width={24}
                  height={24}
                  alt="close modal"
                />
              </button>
            </div>
            <div className="mt-4 w-full bg-[#FFFFFF1A] border-[0.5px] border-white rounded-md p-2 text-white overflow-y-auto max-h-[80vh]">
              {loading && <p>Cargando productos...</p>}
              {error && <p>{error}</p>}
              {!loading && !error && searchTerm !== "" && (
                <div className="m-4">
                  <h4 className="uppercase">Resultados</h4>
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {filteredProducts.map((product) =>
                        product.id ? (
                          <Link
                            key={product.id}
                            href={`/collections/initiation/product/${product.id}`}
                            className="flex flex-col items-center"
                            onClick={() => setIsSearchModalOpen(false)}
                          >
                            <Image
                              src={product.image}
                              width={150}
                              height={150}
                              alt={product.title}
                              className="rounded-md"
                            />
                            <p className="mt-2 text-center">{product.title}</p>
                          </Link>
                        ) : null
                      )}
                    </div>
                  ) : (
                    <p>No se encontraron productos</p>
                  )}
                </div>
              )}
              {!loading && !error && (
                <div className="md:m-4">
                  <p className="mb-2 font-semibold uppercase">Más buscado</p>
                  <ul className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-[55%] sm:items-center sm:justify-evenly">
                    {topSearchedProducts.map((product) => (
                      <li
                        key={product.id}
                        className="cursor-pointer text-[12px] min-w-[120px] items-center text-center justify-center flex h-[30px] rounded border-[0.5px] p-2 px-4"
                        onClick={() => setSearchTerm(product.title)}
                      >
                        {product.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;