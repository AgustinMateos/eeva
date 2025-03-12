import React, { useState } from 'react';
import Image from 'next/image';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='absolute w-full'>
            <div className='flex justify-around h-[90px] items-center'>
                <div className='w-[424px] h-[36px] flex justify-around items-center text-[#FFFFFF]'>
                    {/* Botón hamburguesa */}
                    <button onClick={toggleDropdown} className='focus:outline-none'>
                        <Image 
                            src={"/IconoHamburguesa.svg"} 
                            width={50} 
                            height={50} 
                            alt='menu'
                        />
                    </button>

                    <div className='flex'>
                        <div className='flex w-[280px] justify-around'>
                            <p className='w-[120px] backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]'>
                                Hombre
                            </p>
                            <p className='w-[120px] backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]'>
                                Mujer
                            </p>
                        </div>
                    </div>
                </div>

                {/* Logo */}
                <div>
                    <Image 
                        src={"/eevaLogo.svg"} 
                        width={262} 
                        height={31} 
                        alt='logo' 
                    />
                </div>

                {/* Sección derecha */}
                <div className='w-[424px] text-[#FFFFFF] flex justify-end'>
                    <div className='flex w-[288px] justify-around items-center'>
                        <div className='backdrop-blur-[6px] text-center w-[60px] h-[36px] flex items-center justify-center bg-[#A8A8A81A] rounded-[2px] border-[0.5px]'>
                            <Image 
                                src={"/lupa.svg"} 
                                width={24} 
                                height={24} 
                                alt='search' 
                            />
                        </div>
                        <p className='backdrop-blur-[6px] rounded-[2px] border-[0.5px] border-white h-[36px] flex justify-center items-center text-center bg-[#A8A8A81A] w-[120px]'>
                            About Us
                        </p>
                        <p className='backdrop-blur-[6px] bg-[#A8A8A81A] text-center w-[60px] h-[36px] flex items-center justify-center  rounded-[2px] border-[0.5px]'>
                            0
                        </p>
                    </div>
                </div>
            </div>

            {/* Dropdown con 4 opciones */}
            {isOpen && (
                <div className='absolute top-[90px] left-[85px] w-[200px] backdrop-blur-[6px] bg-[#A8A8A81A] text-white shadow-lg z-50'>
                    <div className="flex flex-col py-4 space-y-2 px-4">
                        <a 
                            href="#" 
                            className="backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                            onClick={() => setIsOpen(false)}
                        >
                            Opción 1
                        </a>
                        <a 
                            href="#" 
                            className="backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                            onClick={() => setIsOpen(false)}
                        >
                            Opción 2
                        </a>
                        <a 
                            href="#" 
                            className="backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                            onClick={() => setIsOpen(false)}
                        >
                            Opción 3
                        </a>
                        <a 
                            href="#" 
                            className="backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]"
                            onClick={() => setIsOpen(false)}
                        >
                            Opción 4
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;