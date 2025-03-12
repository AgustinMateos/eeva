import React from 'react'
import Image from 'next/image'
const Navbar = () => {
    return (
        <div className='absolute w-full'>
            <div className='flex justify-around h-[90px] items-center'>
                <div className='w-[424px] h-[36px] flex justify-around items-center text-[#FFFFFF]'>
                    <Image src={"/IconoHamburguesa.svg"} width={50} height={50} alt='logo' />
                    <div className='flex'>
                        <div className='flex w-[280px] justify-around '>
                            <p className='w-[120px] backdrop-blur-[6px] flex justify-center items-center  h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]'>Hombre</p>

                            <p className='w-[120px] backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A]'>Mujer</p>
                        </div>
                    </div>
                </div>
                <div>
                    <Image src={"/eevaLogo.svg"} width={262} height={31} alt='logo' />
                </div>
                <div className='w-[424px] text-[#FFFFFF]' >
                    <div className='flex w-[288px] justify-around items-center'>
                        <div className='backdrop-blur-[6px] text-center w-[60px] h-[36px] flex items-center justify-center bg-[#A8A8A81A] rounded-[2px] border-[0.5px]'>
                            <Image src={"/lupa.svg"} width={24} height={24} alt='logo' /></div>

                        <p className='backdrop-blur-[6px] rounded-[2px] border-[0.5px] border-white  h-[36px] flex justify-center items-center text-center bg-[#A8A8A81A] w-[120px]'>About Us</p>
                        <p>0</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar