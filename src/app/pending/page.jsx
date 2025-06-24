"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const PendingPage = () => {
  const [orderDetails, setOrderDetails] = React.useState(null);

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem('orderDetails') || '{}');
    setOrderDetails(details);
  }, []);

  if (!orderDetails) {
    return (
      <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px] text-white">
        <h2 className="font-ibm-mono text-[28px] uppercase">Error</h2>
        <p className="text-sm">No se encontraron los detalles de la orden.</p>
        <Link
          href="/"
          className="text-white w-[160px] h-[40px] px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] hover:bg-[#2C2C2CE5] uppercase text-center flex items-center justify-center mt-4"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const { orderId, userInfo, shippingAddress, cart, totalPrice, shippingCost } = orderDetails;
  const formattedAddress = `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.country} ${shippingAddress.postalCode}`;

  return (
    <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px] text-white">
      <h2 className="font-ibm-mono text-[28px] leading-[64px] tracking-[-0.75px] uppercase mb-4">
        Pago Pendiente
      </h2>
      <p className="text-sm mb-4">Tu pago está en proceso. Te notificaremos cuando se confirme.</p>
      <div className="w-[90%] md:w-[100%] flex flex-col items-start p-[10px]">
        <h3 className="font-ibm-mono text-[18px] uppercase mb-4">Detalle de la Orden</h3>
        <div className="w-full border-r border-r-[#D7D7D780]">
          <div className="p-[15px]">
            <h4 className="font-ibm-mono text-[16px] uppercase mb-2">Información del Cliente</h4>
            <p className="text-sm"><span className="font-medium">ID de la Orden:</span> {orderId}</p>
            <p className="text-sm"><span className="font-medium">Nombre:</span> {userInfo.firstName} {userInfo.lastName}</p>
            <p className="text-sm"><span className="font-medium">Correo Electrónico:</span> {userInfo.email}</p>
            <p className="text-sm"><span className="font-medium">Teléfono:</span> {shippingAddress.phone}</p>
            <p className="text-sm"><span className="font-medium">Dirección de Envío:</span> {formattedAddress}</p>
          </div>
          <div className="divide-y divide-gray-400 p-[10px]">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.color}-${item.size}`}
                className="relative w-full py-4 flex justify-between gap-4 pt-10"
              >
                <div className="w-24 h-24 relative">
                  <Image
                    src={`/products/${item.image}.webp`}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="font-medium">{item.name.toUpperCase()}</h3>
                  <div className="flex gap-2 items-center">
                    <p className="text-xs">{item.color}</p>
                    <p className="text-sm">|</p>
                    <p className="text-xs">{item.size}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-xs">Item:</p>
                    <p className="text-xs">{item.quantity}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex gap-2 items-center">
                    <h3 className="font-medium text-md">ARS</h3>
                    <span className="text-lg font-medium text-md">
                      ${(item.price * item.quantity).toLocaleString('es-ES', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-10">
              <div className="w-full flex gap-2 items-center justify-between">
                <span className="text-sm font-light">Subtotal</span>
                <div className="flex gap-2 items-center">
                  <h3 className="font-medium text-md">ARS</h3>
                  <span className="text-lg font-medium text-md">
                    ${totalPrice.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              {shippingCost > 0 && (
                <div className="w-full flex gap-2 items-center justify-between mt-4">
                  <span className="text-sm font-light">Envío</span>
                  <div className="flex gap-2 items-center">
                    <h3 className="font-medium text-md">ARS</h3>
                    <span className="text-lg font-medium text-md">
                      ${shippingCost.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
              <div className="w-full flex gap-2 items-center justify-between mt-4">
                <span className="text-sm font-medium">Total</span>
                <div className="flex gap-2 items-center">
                  <h3 className="font-medium text-md">ARS</h3>
                  <span className="text-lg font-medium text-md">
                    ${(totalPrice + shippingCost).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full pt-[60px] flex justify-center">
            <Link
              href="/"
              className="text-white w-[90%] md:w-[160px] h-[40px] px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] hover:bg-[#2C2C2CE5] uppercase text-center flex items-center justify-center"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingPage;