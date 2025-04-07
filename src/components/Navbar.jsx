'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import style from '@/app/ui/navbar.module.css';

const colecciones = [
  { name: "New Asia", link: "/collections/initiation", age: "new" },
  { name: "Amsterdam", link: "/collections/amsterdam", age: "'24" },
  { name: "New York", link: "/collections/new-york", age: "'27" },
  { name: "Groenlandia", link: "/collections/groenlandia", age: "'20" },
  { name: "Buenos Aires", link: "/collections/buenos-aires", age: "'22" },
  { name: "Los Angeles", link: "/collections/los-angeles", age: "'23" },
];

const products = [
  { id: 1, title: 'Native Iron Tunk', image: '/NativeIronTunk.svg' },
  { id: 2, title: 'Century Dashe', image: '/CenturyDashe.svg' },
  { id: 3, title: 'Native Dark Jean', image: '/NativeDarkJean.svg' },
  { id: 4, title: 'Paola Wood Shirt', image: '/PaolaWoodShirt.svg' },
  { id: 5, title: 'Native Iron Tunk', image: '/NativeIronTunk2.svg' },
  { id: 6, title: 'Century Dashe', image: '/CenturyDashe2.svg' },
  { id: 7, title: 'Native Dark Jean', image: '/NativeDarkJean2.svg' },
  { id: 8, title: 'Paola Wood Shirt', image: '/PaolaWoodShirt2.svg' },
];

const topSearchedProducts = [
  products[0], // Native Iron Tunk
  products[1], // Century Dashe
  products[2], // Native Dark Jean
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHombreOpen, setIsHombreOpen] = useState(false);
  const [isMujerOpen, setIsMujerOpen] = useState(false);
  const [isColeccionesOpen, setIsColeccionesOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const menuRef = useRef(null);
  const hombreRef = useRef(null);
  const mujerRef = useRef(null);
  const coleccionesRef = useRef(null);
  const modalRef = useRef(null);

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
    setSearchTerm(''); // Limpia el término de búsqueda al abrir/cerrar
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
      setIsOpen(false);
    }
    if (hombreRef.current && !hombreRef.current.contains(event.target) && isHombreOpen) {
      setIsHombreOpen(false);
    }
    if (mujerRef.current && !mujerRef.current.contains(event.target) && isMujerOpen) {
      setIsMujerOpen(false);
    }
    if (coleccionesRef.current && !coleccionesRef.current.contains(event.target) && isColeccionesOpen) {
      setIsColeccionesOpen(false);
    }
    if (modalRef.current && !modalRef.current.contains(event.target) && isSearchModalOpen) {
      setIsSearchModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isHombreOpen, isMujerOpen, isColeccionesOpen, isSearchModalOpen]);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute w-full">
      <div className="flex justify-around h-[90px] items-center">
        <div className="w-[324px] h-[36px] flex justify-around items-center text-[#FFFFFF]">
          {/* Botón hamburguesa */}
          <div ref={menuRef}>
            <button onClick={toggleDropdown} className={`${style.menuIcon} focus:outline-none`}>
              <Image
                src={isOpen ? '/XMenuIcon.svg' : '/IconoHamburguesa.svg'}
                width={50}
                height={50}
                alt={isOpen ? 'close menu' : 'menu'}
              />
            </button>
            {/* Dropdown del menú hamburguesa */}
            {isOpen && (
              <div className="absolute top-0 md:top-[70px] md:left-[140px] left-0 w-1/2 md:w-[200px] h-screen md:h-auto backdrop-blur-[6px] rounded-[2px] border-[0.5px] bg-[#A8A8A81A] text-white z-50 overflow-y-auto">
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

                  {/* Botones en móvil */}
                  <div className="block md:hidden">
                    <div className="flex justify-end">
                      <button onClick={() => setIsOpen(false)} className="focus:outline-none">
                        <Image src="/XMenuIcon.svg" width={24} height={24} alt="close menu" />
                      </button>
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={toggleSearchModal}
                        className="backdrop-blur-[6px] text-center w-[60px] h-[36px] flex items-center justify-center bg-[#A8A8A81A] rounded-[2px] border-[0.5px] focus:outline-none"
                      >
                        <Image src={'/lupa.svg'} width={24} height={24} alt="lupa" />
                      </button>
                    </div>
                    <div className="mt-2" ref={coleccionesRef}>
                      <button
                        onClick={toggleColeccionesDropdown}
                        className="w-full backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none"
                      >
                        Colecciones
                      </button>
                      {isColeccionesOpen && (
                        <div className="mt-2 w-full backdrop-blur-[6px] bg-[#A8A8A81A] text-white shadow-lg z-50">
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
                        className="w-full backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none"
                      >
                        H
                      </button>
                      {isHombreOpen && (
                        <div className="mt-2 w-full backdrop-blur-[6px] bg-[#A8A8A81A] text-white shadow-lg z-50">
                          <div className="flex flex-col py-2 space-y-1 px-2">
                            <a
                              href="/topsM"
                              className="backdrop-blur-[6px] flex justify-center items-center h-[30px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                              onClick={() => setIsHombreOpen(false)}
                            >
                              Top
                            </a>
                            <a
                              href="#"
                              className="backdrop-blur-[6px] flex justify-center items-center h-[30px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                              onClick={() => setIsHombreOpen(false)}
                            >
                              Bottom
                            </a>
                            <a
                              href="#"
                              className="backdrop-blur-[6px] flex justify-center items-center h-[30px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                              onClick={() => setIsHombreOpen(false)}
                            >
                              Accesories
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    <div ref={mujerRef} className="relative mt-2">
                      <button
                        onClick={toggleMujerDropdown}
                        className="w-full backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none"
                      >
                        M
                      </button>
                      {isMujerOpen && (
                        <div className="mt-2 w-full backdrop-blur-[6px] bg-[#A8A8A81A] text-white shadow-lg z-50">
                          <div className="flex flex-col py-2 space-y-1 px-2">
                            <a
                              href="#"
                              className="backdrop-blur-[6px] flex justify-center items-center h-[30px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                              onClick={() => setIsMujerOpen(false)}
                            >
                              Top
                            </a>
                            <a
                              href="#"
                              className="backdrop-blur-[6px] flex justify-center items-center h-[30px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                              onClick={() => setIsMujerOpen(false)}
                            >
                              Bottom
                            </a>
                            <a
                              href="#"
                              className="backdrop-blur-[6px] flex justify-center items-center h-[30px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                              onClick={() => setIsMujerOpen(false)}
                            >
                              Accesories
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="backdrop-blur-[6px] rounded-[2px] border-[0.5px] border-white h-[36px] flex justify-center items-center text-center bg-[#A8A8A81A] w-full">
                        ABOUT US
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones Hombre y Mujer fuera del menú hamburguesa (solo en desktop) */}
          <div className="hidden md:flex">
            <div className="flex w-[180px] justify-around">
              <div ref={hombreRef} className="relative">
                <button
                  onClick={toggleHombreDropdown}
                  className="w-[50px] backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none"
                >
                  H
                </button>
                {isHombreOpen && (
                  <div className="absolute top-[40px] left-0 w-[120px] backdrop-blur-[6px] bg-[#A8A8A81A] text-white shadow-lg z-50">
                    <div className="flex flex-col py-2 space-y-1 px-2">
                      <a
                        href="/collections/topsm"
                        className="backdrop-blur-[6px] flex justify-center items-center h-[30px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                        onClick={() => setIsHombreOpen(false)}
                      >
                        Top
                      </a>
                      <a
                        href="/collections/bottomm"
                        className="backdrop-blur-[6px] flex justify-center items-center h-[30px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                        onClick={() => setIsHombreOpen(false)}
                      >
                        Bottom
                      </a>
                      <a
                        href="/collections/accesoriesm"
                        className="backdrop-blur-[6px] flex justify-center items-center h-[30px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                        onClick={() => setIsHombreOpen(false)}
                      >
                        Accesories
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div ref={mujerRef} className="relative">
                <button
                  onClick={toggleMujerDropdown}
                  className="w-[50px] backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none"
                >
                  M
                </button>
                {isMujerOpen && (
                  <div className="absolute top-[40px] left-0 w-[120px] backdrop-blur-[6px] bg-[#A8A8A81A] text-white shadow-lg z-50">
                    <div className="flex flex-col py-2 space-y-1 px-2">
                      <a
                        href="/collections/accesoriesg"
                        className="backdrop-blur-[6px] flex justify-center items-center h-[30px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                        onClick={() => setIsMujerOpen(false)}
                      >
                        Top
                      </a>
                      <a
                        href="#"
                        className="backdrop-blur-[6px] flex justify-center items-center h-[30px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                        onClick={() => setIsMujerOpen(false)}
                      >
                        Bottom
                      </a>
                      <a
                        href="#"
                        className="backdrop-blur-[6px] flex justify-center items-center h-[30px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                        onClick={() => setIsMujerOpen(false)}
                      >
                        Accesories
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Logo  */}
        <div>
          <Link href="/collections/slider">
            <Image src={'/LogoFullEEVA.svg'} width={262} height={31} alt="logo" />
          </Link>
        </div>

        {/* Sección derecha */}
        <div className="w-[324px] text-[#FFFFFF] flex justify-end">
          <div className="flex w-[188px] md:w-[288px] justify-around items-center">
            <button
              onClick={toggleSearchModal}
              className="hidden md:flex backdrop-blur-[6px] text-center w-[60px] h-[36px] items-center justify-center bg-[#A8A8A81A] rounded-[2px] border-[0.5px] focus:outline-none"
            >
              <Image src={'/lupa.svg'} width={24} height={24} alt="lupa" />
            </button>
            <p className="hidden md:flex backdrop-blur-[6px] rounded-[2px] border-[0.5px] border-white h-[36px] justify-center items-center text-center bg-[#A8A8A81A] w-[120px]">
              ABOUT US
            </p>
            <p className="backdrop-blur-[6px] bg-[#A8A8A81A] text-center w-[60px] h-[36px] flex items-center justify-center rounded-[2px] border-[0.5px]">
              0
            </p>
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
            <div className="flex justify-between items-center mb-4">
              <button onClick={toggleSearchModal} className="focus:outline-none">
                <Image src="/XMenuIcon.svg" width={24} height={24} alt="close modal" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter your search term..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded-md bg-[#FFFFFF1A] border-[0.5px] border-white text-white placeholder-gray-300 focus:outline-none"
            />
            <div className="mt-4 w-full bg-[#FFFFFF1A] border-[0.5px] border-white rounded-md p-2 text-white overflow-y-auto">
              {/* Sección fija de productos más buscados */}
              <div className="mb-4">
                <p className="mb-2 font-semibold">Productos más buscados:</p>
                <ul className="space-y-2">
                  {topSearchedProducts.map((product) => (
                    <li
                      key={product.id}
                      className="cursor-pointer hover:underline"
                      onClick={() => setSearchTerm(product.title)}
                    >
                      {product.title}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sección dinámica de resultados de búsqueda */}
              {searchTerm !== '' && (
                <div>
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="flex flex-col items-center">
                          <Image
                            src={product.image}
                            width={150}
                            height={150}
                            alt={product.title}
                            className="rounded-md"
                          />
                          <p className="mt-2 text-center">{product.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No se encontraron productos</p>
                  )}
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