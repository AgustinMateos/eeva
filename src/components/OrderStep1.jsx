"use client";

import React from 'react';
import Footer from './Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/context/CartContext';

const OrderStep1 = () => {
  const { cart, totalPrice } = useCart();

  return (
    <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
      <div className="w-[85%] flex">
        <div className="w-[70%] border-r border-r-[#D7D7D780]">
          <div className="h-[256px] flex flex-col justify-between">
            <h2 className="font-ibm text-[22px] leading-[64px] tracking-[-0.04em] align-middle uppercase text-white">
              INFORMACIÓN
            </h2>
            <input
              className="w-[713px]  h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:border-nonefocus:ring-2 focus:ring-white/50 text-white"
              type="text"
              placeholder="Nombres"
            />
            <input
              className="w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:border-nonefocus:ring-2 focus:ring-white/50 text-white"
              type="text"
              placeholder="Apellidos"
            />
            <input
              className="w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:border-nonefocus:ring-2 focus:ring-white/50 text-white"
              type="email"
              placeholder="Correo electrónico"
            />
          </div>

          <div className="h-[400px] flex flex-col justify-between">
            <h2 className="font-ibm text-[22px] leading-[64px] tracking-[-0.04em] align-middle uppercase text-white">
              DIRECCIÓN DE ENVÍO
            </h2>
            <div className="flex justify-between w-[713px]">
              <select className="w-[139px] h-[48px] pr-[16px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:border-nonefocus:ring-2 focus:ring-white/50 text-white">
                <option>C. Área</option>
              </select>
              <input
                className="w-[558px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:border-nonefocus:ring-2 focus:ring-white/50 text-white"
                type="text"
                placeholder="Teléfono / Celular"
              />
            </div>
            <div className="flex justify-between w-[713px]">
              <select className="w-[139px] text-white h-[48px] pr-[16px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203]">
                <option>DNI</option>
                <option>Pasaporte</option>
              </select>
              <input
                className="w-[558px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:border-nonefocus:ring-2 focus:ring-white/50 text-white"
                type="text"
                placeholder="Número de documento"
              />
            </div>
            <input
              className="w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:border-nonefocus:ring-2 focus:ring-white/50 text-white"
              type="text"
              placeholder="País / Región"
            />
            <input
              className="w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:border-nonefocus:ring-2 focus:ring-white/50 text-white"
              type="text"
              placeholder="Región / Provincia"
            />
            <div className="flex justify-between w-[713px]">
              <select className="w-[139px]  h-[48px] pr-[16px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:border-nonefocus:ring-2 focus:ring-white/50 text-white">
                <option>C. Postal</option>
              </select>
              <input
                className="w-[558px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:border-nonefocus:ring-2 focus:ring-white/50 text-white"
                type="text"
                placeholder="Calle + Altura"
              />
            </div>
          </div>
          <div className="w-[713px] pt-[60px] flex justify-between">
            <Link
              href="/"
              className="inline-block pr-2 text-white underline hover:text-gray-400 transition"
            >
              Continue shopping
            </Link>
            <Link
              href="/"
              className="text-white w-[160px] pb-[10px] md:w-[160px] h-[40px] gap-2 px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] transition-all duration-200 hover:bg-[#2C2C2CE5] uppercase text-center"
            >
              Continuar
            </Link>
          </div>
        </div>
        <div className="w-[30%] pl-6">
          {/* Cart Products Section */}
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="mb-4 font-ibm-mono font-normal text-[32px] leading-[64px] tracking-[-0.04em] text-center align-middle uppercase text-white">
                Your cart is empty
              </p>
              <Link
                href="/"
                className="inline-block pr-2 text-white underline hover:text-gray-400 transition"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-400 text-white">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}`}
                  className="relative w-full py-4 flex justify-between gap-4 pt-10"
                >
                  <div className="w-24 h-24 relative">
                    <Image
                      src={"/" + item.image + ".png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="font-medium">{item.name.toUpperCase()}</h3>
                    <div className="flex gap-2 items-center">
                      <p className="text-xs">{item.color}</p>
                      <p className="text-sm">|</p>
                      <p className="text-xs">{item.size}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex gap-2 items-center">
                      <h3 className="font-medium text-md">ARS</h3>
                      <span className="text-lg font-medium text-md">
                        ${item.price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-medium text-xs text-[#A2A2A2]">
                        Precios sin impuestos:
                      </span>
                      <span className="font-medium text-xs text-[#A2A2A2]">
                        ${(item.price / 1.21).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-10">
                <div className="w-full flex gap-2 items-center justify-between text-white">
                  <span className="text-sm font-light">Subtotal</span>
                  <div className="flex gap-2 items-center text-white">
                    <h3 className="font-medium text-md">ARS</h3>
                    <span className="text-lg font-medium text-md">
                      ${totalPrice.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="h-[315px] flex min-w-[100%] md:min-w-[1315px]">
        <Footer />
      </div>
    </div>
  );
};

export default OrderStep1;