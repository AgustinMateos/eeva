import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import style from '@/app/ui/navbar.module.css'; // Asegúrate de que la ruta sea correcta

const colecciones = [
    "New Asia",
    "Amsterdam",
    "New York",
    "Groenlandia",
    "Buenos Aires",
    "Los Angeles",
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHombreOpen, setIsHombreOpen] = useState(false);
    const [isMujerOpen, setIsMujerOpen] = useState(false);
    const [isColeccionesOpen, setIsColeccionesOpen] = useState(false);

    const menuRef = useRef(null);
    const hombreRef = useRef(null);
    const mujerRef = useRef(null);
    const coleccionesRef = useRef(null);

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
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, isHombreOpen, isMujerOpen, isColeccionesOpen]);

    return (
        <div className="absolute w-full">
            <div className="flex justify-around h-[90px] items-center">
                <div className="w-[424px] h-[36px] flex justify-around items-center text-[#FFFFFF]">
                    {/* Botón hamburguesa */}
                    <div ref={menuRef}>
                        <button
                            onClick={toggleDropdown}
                            className={`${style.menuIcon} focus:outline-none`}
                        >
                            <Image
                                src={isOpen ? '/xMenuIcon.svg' : '/IconoHamburguesa.svg'}
                                width={50}
                                height={50}
                                alt={isOpen ? 'close menu' : 'menu'}
                            />
                        </button>
                        {/* Dropdown del menú hamburguesa */}
                        {isOpen && (
                            <div className="absolute top-[70px] left-[10px] w-[200px] backdrop-blur-[6px] rounded-[2px] border-[0.5px] bg-[#A8A8A81A] text-white z-50">
                                <div className="flex flex-col py-4 space-y-2 px-4">
                                    {/* Colecciones en desktop (sin dropdown) */}
                                    <div className="hidden md:block">
                                        {colecciones.map((coleccion, index) => (
                                            <a
                                                key={index}
                                                href={`#${coleccion.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="flex justify-start items-start h-[20px] text-left"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {coleccion}
                                            </a>
                                        ))}
                                    </div>

                                    {/* Botones en móvil (orden: Lupa, Colecciones, Hombre, Mujer, About Us) */}
                                    <div className="block md:hidden">
                                        {/* Botón de la lupa (primero en móvil) */}
                                        <div className="mt-2">
                                            <div className="backdrop-blur-[6px] text-center w-[60px] h-[36px] flex items-center justify-center bg-[#A8A8A81A] rounded-[2px] border-[0.5px]">
                                                <Image
                                                    src={'/lupa.svg'}
                                                    width={24}
                                                    height={24}
                                                    alt="lupa"
                                                />
                                            </div>
                                        </div>

                                        {/* Colecciones en móvil (dentro de un dropdown) */}
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
                                                            <a
                                                                key={index}
                                                                href={`#${coleccion.toLowerCase().replace(/\s+/g, '-')}`}
                                                                className="flex justify-start items-start h-[20px] text-left"
                                                                onClick={() => {
                                                                    setIsColeccionesOpen(false);
                                                                    setIsOpen(false);
                                                                }}
                                                            >
                                                                {coleccion}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Botón Hombre */}
                                        <div ref={hombreRef} className="relative mt-2">
                                            <button
                                                onClick={toggleHombreDropdown}
                                                className="w-full backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none"
                                            >
                                                Hombre
                                            </button>
                                            {isHombreOpen && (
                                                <div className="mt-2 w-full backdrop-blur-[6px] bg-[#A8A8A81A] text-white shadow-lg z-50">
                                                    <div className="flex flex-col py-2 space-y-1 px-2">
                                                        <a
                                                            href="#"
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

                                        {/* Botón Mujer */}
                                        <div ref={mujerRef} className="relative mt-2">
                                            <button
                                                onClick={toggleMujerDropdown}
                                                className="w-full backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none"
                                            >
                                                Mujer
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

                                        {/* Botón About Us */}
                                        <div className="mt-2">
                                            <p className="backdrop-blur-[6px] rounded-[2px] border-[0.5px] border-white h-[36px] flex justify-center items-center text-center bg-[#A8A8A81A] w-full">
                                                About Us
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones Hombre y Mujer fuera del menú hamburguesa (solo en desktop) */}
                    <div className="hidden md:flex">
                        <div className="flex w-[280px] justify-around">
                            <div ref={hombreRef} className="relative">
                                <button
                                    onClick={toggleHombreDropdown}
                                    className="w-[120px] backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none"
                                >
                                    Hombre
                                </button>
                                {isHombreOpen && (
                                    <div className="absolute top-[40px] left-0 w-[120px] backdrop-blur-[6px] bg-[#A8A8A81A] text-white shadow-lg z-50">
                                        <div className="flex flex-col py-2 space-y-1 px-2">
                                            <a
                                                href="#"
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
                            <div ref={mujerRef} className="relative">
                                <button
                                    onClick={toggleMujerDropdown}
                                    className="w-[120px] backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none"
                                >
                                    Mujer
                                </button>
                                {isMujerOpen && (
                                    <div className="absolute top-[40px] left-0 w-[120px] backdrop-blur-[6px] bg-[#A8A8A81A] text-white shadow-lg z-50">
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
                        </div>
                    </div>
                </div>

                {/* Logo */}
                <div>
                    <Image src={'/LogoFullEEVA.svg'} width={262} height={31} alt="logo" />
                </div>

                {/* Sección derecha */}
                <div className="w-[424px] text-[#FFFFFF] flex justify-end">
                    <div className="flex w-[188px] md:w-[288px] justify-around items-center">
                        {/* Botón de la lupa fuera del menú hamburguesa (solo en desktop) */}
                        <div className="hidden md:flex backdrop-blur-[6px] text-center w-[60px] h-[36px] items-center justify-center bg-[#A8A8A81A] rounded-[2px] border-[0.5px]">
                            <Image
                                src={'/lupa.svg'}
                                width={24}
                                height={24}
                                alt="lupa"
                            />
                        </div>
                        {/* Botón About Us fuera del menú hamburguesa (solo en desktop) */}
                        <p className="hidden md:flex backdrop-blur-[6px] rounded-[2px] border-[0.5px] border-white h-[36px] justify-center items-center text-center bg-[#A8A8A81A] w-[120px]">
                            About Us
                        </p>
                        {/* Carrito */}
                        <p className="backdrop-blur-[6px] bg-[#A8A8A81A] text-center w-[60px] h-[36px] flex items-center justify-center rounded-[2px] border-[0.5px]">
                            0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;