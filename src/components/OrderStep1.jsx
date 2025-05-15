import React from 'react';
import Footer from './Footer';

const OrderStep1 = () => {
    return (
        <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
           <div className='w-[85%] flex'><div className="w-[70%] border-r border-r-[#D7D7D780]">
                <div className='h-[256px] flex flex-col justify-between'>
                    <h2 className='font-ibm text-[22px] leading-[64px] tracking-[-0.04em] align-middle uppercase text-white'>INFORMACIÓN</h2>

                    <input className='w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203]' type="text" placeholder="Nombres" />
                    <input className='w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203]' type="text" placeholder="Apellidos" />
                    <input className='w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203]' type="email" placeholder="Correo electrónico" />

                </div>


      <div className='h-[400px] flex flex-col justify-between'><h2 className='font-ibm text-[22px] leading-[64px] tracking-[-0.04em] align-middle uppercase text-white'>DIRECCIÓN DE ENVÍO</h2>
      <div className='flex justify-between w-[713px]'>
                <select className='w-[139px] text-white h-[48px] pr-[16px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203]'>
                        <option>C. Área</option>
                    </select>
                    <input className='w-[558px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203]' type="text" placeholder="Teléfono / Celular" />
                </div>
                <div className='flex justify-between w-[713px]'>
                <select className='w-[139px] text-white h-[48px] pr-[16px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203]'>
                        <option>DNI</option>
                    </select>
                    <input className='w-[558px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203]'  type="text" placeholder="Número de documento" />
                </div>
                <input className='w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203]' type="text" placeholder="País / Región" />
                <input className='w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203]' type="text" placeholder="Región / Provincia" />
                <div className='flex justify-between w-[713px]'>
                    <select className='w-[139px] text-white h-[48px] pr-[16px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203]'>
                        <option>C. Postal</option>
                    </select>
                    <input className='w-[558px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203]' type="text" placeholder="Calle + Altura" />
                </div></div>
                
            </div>
            <div className="w-[30%] ">
              s  {/* This section is empty as per your current code; you can add content if needed */}
            </div></div>
            
            <div className="h-[315px] flex min-w-[100%] md:min-w-[1315px]">
                <Footer />
            </div>
        </div>
    );
};

export default OrderStep1;